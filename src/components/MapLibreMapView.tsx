import MapView, { Circle } from 'react-native-maps'
import { ActivityIndicator, Dimensions, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapLayerId } from '../config/map'
import { mapStyle } from '../config/mapStyle'
import { useCurrentLocationTarget } from '../hooks/useCurrentLocationTarget'
import { useRecordMarkerFade } from '../hooks/useRecordMarkerFade'
import { useStoredCameraRegion } from '../hooks/useStoredCameraRegion'
import type { MapZoneRead, MapZoneRecordRead } from '../types/api'
import {
	filterZonesByLayer,
	getZoneCircleColors,
} from '../utils/mapZoneStyle'
import { findZoneAtCoordinate } from '../utils/mapZoneHit'
import { placeBalloon } from '../utils/balloonPlacement'
import { keepClustersClearOfZones } from '../utils/clusterPlacement'
import { clusterRecords, zoomFromLongitudeDelta } from '../utils/clusterRecords'
import { mapViewStyles as styles } from './map/mapViewStyles'
import { ClusterMarker } from './map/ClusterMarker'
import { BALLOON_HEIGHT_DP, BALLOON_WIDTH_DP, RecordBalloon, type RecordBalloonHandlers } from './map/RecordBalloon'
import { RecordMarker } from './map/RecordMarker'
import { ZoneMarker } from './map/ZoneMarker'
import { UserLocationMarker } from './map/UserLocationMarker'
import { colors } from '../constants/theme'

const CAMERA_ANIMATION_DURATION_MS = 250
const EMPTY_RECORD_MARKERS: MapZoneRecordRead[] = []
// Se nenhuma região mudar depois do toque (o marcador já estava no centro), o balão aparece depois disto.
const BALLOON_ANCHOR_FALLBACK_MS = 400

type Props = {
	selectedLayer: MapLayerId
	zones: MapZoneRead[]
	recordMarkers?: MapZoneRecordRead[]
	onMapPress?: (lat: number, lng: number) => void
	onZonePress?: (zone: MapZoneRead) => void
	onRecordMarkerPress?: (recordId: number) => void
	// Só no mapa do admin: tocar no marcador abre um balão (quando `shouldShow`) em vez de `onRecordMarkerPress`.
	recordBalloon?: RecordBalloonHandlers
	// Definido só para admin: marcadores distinguem registros próprios dos de outras pessoas.
	markerViewerId?: number | null
	selectedZoneId?: number | null
	selectedRecordId?: number | null
	isLoadingData?: boolean
	// Muda a cada toque em "ir para minha localização".
	recenterKey?: number
}

function MapLibreMapViewBase({
	selectedLayer,
	zones,
	recordMarkers = EMPTY_RECORD_MARKERS,
	onMapPress,
	onZonePress,
	onRecordMarkerPress,
	recordBalloon,
	markerViewerId,
	selectedZoneId,
	selectedRecordId,
	isLoadingData = false,
	recenterKey = 0,
}: Props) {
	const mapRef = useRef<MapView>(null)
	const cameraInitializedRef = useRef(false)
	const userMovedMapRef = useRef(false)
	const [mapReady, setMapReady] = useState(false)
	const [cameraReady, setCameraReady] = useState(false)
	const activeRecordMarkers = onRecordMarkerPress ? recordMarkers : EMPTY_RECORD_MARKERS

	const { initialRegion, initialRegionReady, persistCameraRegion } = useStoredCameraRegion()
	const { visibleRecordMarkers, recordMarkerOpacity } = useRecordMarkerFade(activeRecordMarkers)
	const { cameraTargetRegion, hasLocationTarget, locationReady } = useCurrentLocationTarget()

	// Zoom inteiro do mapa; só o admin agrupa registros (as demais contas seguem como antes).
	const [zoom, setZoom] = useState<number | null>(null)
	const clusteringEnabled = markerViewerId !== undefined

	// Balão do registro tocado (só admin). `anchor` é o centro do marcador na tela, em dp; fica nulo
	// enquanto o mapa se move e o balão some, e volta quando o movimento termina.
	const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null)
	const [balloon, setBalloon] = useState<{ recordId: number; anchor: { x: number; y: number } | null } | null>(null)
	const balloonRecordIdRef = useRef<number | null>(null)
	const balloonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const visibleRecordsRef = useRef<MapZoneRecordRead[]>(EMPTY_RECORD_MARKERS)
	visibleRecordsRef.current = visibleRecordMarkers

	const closeBalloon = useCallback(() => {
		balloonRecordIdRef.current = null

		if (balloonTimerRef.current) {
			clearTimeout(balloonTimerRef.current)
			balloonTimerRef.current = null
		}

		setBalloon((current) => (current === null ? current : null))
	}, [])

	const placeBalloonAnchor = useCallback(async (recordId: number) => {
		const record = visibleRecordsRef.current.find((item) => item.id === recordId)

		if (!record || !mapRef.current) {
			return
		}

		try {
			// No Android o ponto já vem em dp (a biblioteca divide pela densidade).
			const point = await mapRef.current.pointForCoordinate({
				latitude: record.latitude_camera,
				longitude: record.longitude_camera,
			})

			if (balloonRecordIdRef.current === recordId) {
				setBalloon({ recordId, anchor: point })
			}
		} catch {
			// Sem a posição não há onde ancorar o balão; ele simplesmente não aparece.
		}
	}, [])

	const handleRecordPress = useCallback(
		(recordId: number) => {
			if (recordBalloon?.shouldShow(recordId)) {
				balloonRecordIdRef.current = recordId
				setBalloon({ recordId, anchor: null })

				// O Google Maps recentra a câmera ao tocar no marcador, então a posição só é final quando a
				// região termina de mudar (onRegionChangeComplete); o temporizador cobre o caso sem mudança.
				if (balloonTimerRef.current) {
					clearTimeout(balloonTimerRef.current)
				}

				balloonTimerRef.current = setTimeout(() => {
					balloonTimerRef.current = null
					void placeBalloonAnchor(recordId)
				}, BALLOON_ANCHOR_FALLBACK_MS)
				return
			}

			closeBalloon()
			onRecordMarkerPress?.(recordId)
		},
		[closeBalloon, onRecordMarkerPress, placeBalloonAnchor, recordBalloon],
	)

	const handleZonePress = useCallback(
		(zone: MapZoneRead) => {
			closeBalloon()
			onZonePress?.(zone)
		},
		[closeBalloon, onZonePress],
	)

	useEffect(() => {
		return () => {
			if (balloonTimerRef.current) {
				clearTimeout(balloonTimerRef.current)
			}
		}
	}, [])

	// Fecha o balão se o registro some da lista (recarga, troca de camada) ou se o balão deixa de valer.
	useEffect(() => {
		if (balloon && (!recordBalloon || !visibleRecordMarkers.some((record) => record.id === balloon.recordId))) {
			closeBalloon()
		}
	}, [balloon, closeBalloon, recordBalloon, visibleRecordMarkers])

	useEffect(() => {
		if (initialRegionReady) {
			setZoom((current) => current ?? Math.round(zoomFromLongitudeDelta(initialRegion.longitudeDelta, Dimensions.get('window').width)))
		}
	}, [initialRegion, initialRegionReady])

	useEffect(() => {
		let cameraFallback: ReturnType<typeof setTimeout> | undefined

		if (!initialRegionReady || !mapReady || !locationReady || cameraInitializedRef.current) {
			return undefined
		}

		cameraInitializedRef.current = true

		if (!hasLocationTarget || userMovedMapRef.current) {
			setCameraReady(true)
			return undefined
		}

		mapRef.current?.animateToRegion(cameraTargetRegion, CAMERA_ANIMATION_DURATION_MS)
		cameraFallback = setTimeout(() => {
			setCameraReady(true)
		}, CAMERA_ANIMATION_DURATION_MS)

		return () => {
			if (cameraFallback) {
				clearTimeout(cameraFallback)
			}
		}
	}, [cameraTargetRegion, hasLocationTarget, initialRegionReady, locationReady, mapReady])

	useEffect(() => {
		if (recenterKey === 0 || !hasLocationTarget) {
			return
		}

		mapRef.current?.animateToRegion(cameraTargetRegion, CAMERA_ANIMATION_DURATION_MS)
	}, [recenterKey, cameraTargetRegion, hasLocationTarget])

	const visibleZones = useMemo(
		() => filterZonesByLayer(zones, selectedLayer),
		[selectedLayer, zones],
	)

	const zoneCircles = useMemo(() => visibleZones.map((zone) => {
		const { fill, stroke } = getZoneCircleColors(zone, selectedZoneId)

		return (
			<Circle
				key={zone.id}
				center={{
					latitude: zone.latitude,
					longitude: zone.longitude,
				}}
				radius={zone.radius_meters}
				strokeColor={stroke}
				strokeWidth={2}
				fillColor={fill}
				zIndex={-1}
			/>
		)
	}), [selectedZoneId, visibleZones])

	const zonePressMarkers = useMemo(() => {
		if (!onZonePress) {
			return null
		}

		return visibleZones.map((zone) => (
			<ZoneMarker
				key={`zone-press-${zone.id}`}
				zone={zone}
				selected={zone.id === selectedZoneId}
				dimmed={selectedZoneId !== null && selectedZoneId !== undefined}
				onPress={handleZonePress}
			/>
		))
	}, [handleZonePress, onZonePress, selectedZoneId, visibleZones])

	const clusterItems = useMemo(() => {
		if (!clusteringEnabled || zoom === null) {
			return null
		}

		// O grupo nasce no meio dos registros, que ficam em volta do ícone da zona: sem afastar, ele
		// esconderia o ícone. Só há ícone de zona quando as zonas são tocáveis.
		return keepClustersClearOfZones(clusterRecords(visibleRecordMarkers, zoom), onZonePress ? visibleZones : [], zoom)
	}, [clusteringEnabled, zoom, visibleRecordMarkers, visibleZones, onZonePress])

	const selectedRecordMarkers = useMemo(() => {
		const renderRecord = (record: MapZoneRecordRead) => (
			<RecordMarker
				key={`record-marker-${record.id}`}
				record={record}
				focused={record.id === selectedRecordId}
				opacity={recordMarkerOpacity}
				onPress={handleRecordPress}
				viewerId={markerViewerId}
			/>
		)

		if (!clusterItems) {
			return visibleRecordMarkers.map(renderRecord)
		}

		return clusterItems.map((item) => {
			if (item.kind === 'record') {
				return renderRecord(item.record)
			}

			// Toque no grupo: aproxima o mapa até enquadrar os registros dele.
			return (
				<ClusterMarker
					key={item.key}
					latitude={item.latitude}
					longitude={item.longitude}
					count={item.count}
					onPress={() => {
						closeBalloon()
						mapRef.current?.fitToCoordinates(
							item.records.map((record) => ({ latitude: record.latitude_camera, longitude: record.longitude_camera })),
							{ edgePadding: { top: 220, right: 120, bottom: 220, left: 120 }, animated: true },
						)
					}}
				/>
			)
		})
	}, [clusterItems, closeBalloon, handleRecordPress, selectedRecordId, recordMarkerOpacity, visibleRecordMarkers, markerViewerId])

	const balloonRecord = balloon ? visibleRecordMarkers.find((record) => record.id === balloon.recordId) : undefined
	const balloonPlacement = useMemo(
		() =>
			balloon?.anchor && containerSize
				? placeBalloon({
						anchor: balloon.anchor,
						balloon: { width: BALLOON_WIDTH_DP, height: BALLOON_HEIGHT_DP },
						container: containerSize,
					})
				: null,
		[balloon?.anchor, containerSize],
	)

	const { t } = useTranslation('map')
	const showMapLoading = isLoadingData || !initialRegionReady || !mapReady || !cameraReady

	return (
		<View
			style={styles.container}
			onLayout={(event) => {
				const { width, height } = event.nativeEvent.layout

				setContainerSize((current) => (current?.width === width && current?.height === height ? current : { width, height }))
			}}
		>
			{initialRegionReady ? (
				<MapView
					ref={mapRef}
					style={styles.mapView}
					onMapReady={() => setMapReady(true)}
					onPanDrag={() => {
						userMovedMapRef.current = true
						// O balão não acompanha o arrasto quadro a quadro: some e volta ao soltar.
						setBalloon((current) => (current && current.anchor ? { ...current, anchor: null } : current))
					}}
					onRegionChangeComplete={(region) => {
						persistCameraRegion(region)
						setZoom(Math.round(zoomFromLongitudeDelta(region.longitudeDelta, Dimensions.get('window').width)))

						if (balloonRecordIdRef.current !== null) {
							void placeBalloonAnchor(balloonRecordIdRef.current)
						}

						if (cameraInitializedRef.current && !cameraReady) {
							setCameraReady(true)
						}
					}}
					showsPointsOfInterest={false}
					showsIndoors={false}
					showsBuildings={false}
					customMapStyle={mapStyle}
					initialRegion={initialRegion}
					onPress={(e) => {
						const { latitude, longitude } = e.nativeEvent.coordinate

						closeBalloon()

						if (onMapPress) {
							onMapPress(latitude, longitude)
							return
						}

						// O Circle não recebe toque (e o marcador do centro fica sob os registros): o toque na
						// área da zona é que a abre. Tocar num marcador não passa por aqui.
						const zone = onZonePress ? findZoneAtCoordinate(visibleZones, latitude, longitude) : null

						if (zone) {
							onZonePress?.(zone)
						}
					}}
				>
					{zoneCircles}
					{zonePressMarkers}
					{selectedRecordMarkers}
					{hasLocationTarget && (
						<UserLocationMarker
							latitude={cameraTargetRegion.latitude}
							longitude={cameraTargetRegion.longitude}
						/>
					)}
				</MapView>
			) : null}
			{balloon && balloonRecord && balloonPlacement && recordBalloon ? (
				<RecordBalloon
					record={balloonRecord}
					placement={balloonPlacement}
					onPress={() => {
						closeBalloon()
						recordBalloon.onPress(balloonRecord.id)
					}}
				/>
			) : null}
			{showMapLoading ? (
				<View pointerEvents="none" style={styles.recordsLoadingOverlay}>
					<View
						style={styles.recordsLoadingPill}
						accessibilityLiveRegion="polite"
						accessibilityLabel={t('loading')}
					>
						<ActivityIndicator size="small" color={colors.secondary} />
						<Text style={styles.loadingText}>{t('loading')}…</Text>
					</View>
				</View>
			) : null}
			{!locationReady ? (
				<View pointerEvents="none" style={styles.loadingOverlay} />
			) : null}
		</View>
	)
}

// memo: o mapa só redesenha quando camada, zonas ou marcadores mudam (e não a cada render da tela).
export const MapLibreMapView = React.memo(MapLibreMapViewBase)
