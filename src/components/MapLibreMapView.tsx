import MapView, { Circle, Marker } from 'react-native-maps'
import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { mapViewStyles as styles } from './map/mapViewStyles'
import { RecordMarker } from './map/RecordMarker'
import { UserLocationMarker } from './map/UserLocationMarker'
import { colors } from '../constants/theme'

const CAMERA_ANIMATION_DURATION_MS = 250
const EMPTY_RECORD_MARKERS: MapZoneRecordRead[] = []

type Props = {
	selectedLayer: MapLayerId
	zones: MapZoneRead[]
	recordMarkers?: MapZoneRecordRead[]
	onMapPress?: (lat: number, lng: number) => void
	onZonePress?: (zone: MapZoneRead) => void
	onRecordMarkerPress?: (recordId: number) => void
	selectedZoneId?: number | null
	selectedRecordId?: number | null
	isLoadingData?: boolean
}

function MapLibreMapViewBase({
	selectedLayer,
	zones,
	recordMarkers = EMPTY_RECORD_MARKERS,
	onMapPress,
	onZonePress,
	onRecordMarkerPress,
	selectedZoneId,
	selectedRecordId,
	isLoadingData = false,
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
			<Marker
				key={`zone-press-${zone.id}`}
				coordinate={{
					latitude: zone.latitude,
					longitude: zone.longitude,
				}}
				onPress={() => onZonePress(zone)}
				anchor={{ x: 0.5, y: 0.5 }}
				zIndex={0}
			>
				<View style={styles.zonePressMarker} />
			</Marker>
		))
	}, [onZonePress, visibleZones])

	const selectedRecordMarkers = useMemo(() => {
		return visibleRecordMarkers.map((record) => {
			const selected = record.id === selectedRecordId

			return (
				<RecordMarker
					key={`record-marker-${record.id}`}
					record={record}
					focused={selected}
					opacity={recordMarkerOpacity}
					onPress={onRecordMarkerPress}
				/>
			)
		})
	}, [selectedRecordId, onRecordMarkerPress, recordMarkerOpacity, visibleRecordMarkers])

	const showMapLoading = isLoadingData || !initialRegionReady || !mapReady || !cameraReady

	return (
		<View style={styles.container}>
			{initialRegionReady ? (
				<MapView
					ref={mapRef}
					style={styles.mapView}
					onMapReady={() => setMapReady(true)}
					onPanDrag={() => {
						userMovedMapRef.current = true
					}}
					onRegionChangeComplete={(region) => {
						persistCameraRegion(region)

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
						if (onMapPress) {
							onMapPress(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
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
			{showMapLoading ? (
				<View pointerEvents="none" style={styles.recordsLoadingOverlay}>
					<ActivityIndicator size="large" color={colors.text} />
					<Text style={styles.loadingText}>Preparando mapa...</Text>
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
