import MapView, { Circle, Marker, type Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { MAP_CENTER } from '../config/map'
import type { MapLayerId } from '../config/map'
import type { MapZoneRead } from '../types/api'
import type { RecordItem } from '../types/records'
import { useEffect, useMemo, useRef, useState } from 'react'

const MAP_REGION_DELTA = 0.01
const CAMERA_ANIMATION_DURATION_MS = 250
const DEFAULT_REGION: Region = {
	latitude: MAP_CENTER.lat,
	longitude: MAP_CENTER.lng,
	latitudeDelta: MAP_REGION_DELTA,
	longitudeDelta: MAP_REGION_DELTA,
}

type Props = {
	selectedLayer: MapLayerId
	records: RecordItem[]
	recordsLoading: boolean
	zones: MapZoneRead[]
	onMapPress?: (lat: number, lng: number) => void
}

export function MapLibreMapView({ selectedLayer, records, recordsLoading, zones, onMapPress }: Props) {
	const mapRef = useRef<MapView>(null)
	const cameraInitializedRef = useRef(false)
	const [cameraTargetRegion, setCameraTargetRegion] = useState<Region>(DEFAULT_REGION)
	const [hasLocationTarget, setHasLocationTarget] = useState(false)
	const [locationReady, setLocationReady] = useState(false)
	const [mapReady, setMapReady] = useState(false)
	const [cameraReady, setCameraReady] = useState(false)

	useEffect(() => {
		let isMounted = true

		const loadCurrentLocation = async () => {
			try {
				const permission = await Location.requestForegroundPermissionsAsync()

				if (!permission.granted) {
					if (isMounted) {
						setLocationReady(true)
					}
					return
				}

				const position = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				})

				if (isMounted) {
					setCameraTargetRegion({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: MAP_REGION_DELTA,
						longitudeDelta: MAP_REGION_DELTA,
					})
					setHasLocationTarget(true)
					setLocationReady(true)
				}
			} catch {
				if (isMounted) {
					setLocationReady(true)
				}
			}
		}

		loadCurrentLocation()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		let cameraFallback: ReturnType<typeof setTimeout> | undefined

		if (!mapReady || !locationReady || cameraInitializedRef.current) {
			return undefined
		}

		cameraInitializedRef.current = true

		if (!hasLocationTarget) {
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
	}, [cameraTargetRegion, hasLocationTarget, locationReady, mapReady])

	const visibleRecords = useMemo(() => records.filter((record) => {
		const behavior = String(record.flock_size || '').toLowerCase()

		if (selectedLayer === 'all') {
			return behavior.includes('ninh') || behavior.includes('aliment')
		}

		if (selectedLayer === 'feeding') {
			return behavior.includes('aliment')
		}

		return behavior.includes('ninh')
	}), [records, selectedLayer])

	const markers = useMemo(() => visibleRecords.map((record) => {
		const behavior = String(record.flock_size || '').toLowerCase()
		const isNest = behavior.includes('ninh')
		const markerColor = isNest ? '#2F6FE4' : '#E53935'

		return (
			<Marker
				key={record.id}
				coordinate={{
					latitude: record.latitude,
					longitude: record.longitude,
				}}
				onPress={() => {
					// Adicionar lógica de popover/info aqui
				}}
				pinColor={markerColor}
				tracksViewChanges={false}
			/>
		)
	}), [visibleRecords])

	const zoneCircles = useMemo(() => zones.map((zone) => {
		const circleColor = zone.type === 'nest' ? '#2f6ee43a' : '#e5383556'
		const circleStrokeColor = zone.type === 'nest' ? 'rgba(47, 111, 228, 0.4)' : 'rgba(229, 57, 53, 0.4)'

		return (
			<Circle
				key={zone.id}
				center={{
					latitude: zone.latitude,
					longitude: zone.longitude,
				}}
				radius={zone.radius_meters}
				strokeColor={circleStrokeColor}
				strokeWidth={2}
				fillColor={circleColor}
				zIndex={-1}
			/>
		)
	}), [zones])

	const visibleCount = visibleRecords.length
	const loadingText =
		!mapReady || !cameraReady
			? 'Preparando mapa...'
			: records.length > 0
				? 'Atualizando pontos...'
				: 'Carregando pontos...'
	const showRecordsLoading = recordsLoading || !mapReady || !cameraReady
	const badgeText =
		selectedLayer === 'all'
			? 'registros'
			: selectedLayer === 'feeding'
				? 'alimentação'
				: 'ninhos'

	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				style={styles.mapView}
				onMapReady={() => setMapReady(true)}
				onRegionChangeComplete={() => {
					if (cameraInitializedRef.current && !cameraReady) {
						setCameraReady(true)
					}
				}}
				showsPointsOfInterest={false}
				showsIndoors={false}
				showsBuildings={false}
				customMapStyle={mapStyle}
				initialRegion={DEFAULT_REGION}
				onPress={(e) => {
					if (onMapPress) {
						onMapPress(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
					}
				}}
			>
				{zoneCircles}
				{markers}
			</MapView>
			{showRecordsLoading ? (
				<View pointerEvents="none" style={styles.recordsLoadingOverlay}>
					<ActivityIndicator size="large" color="#1A1A1A" />
					<Text style={styles.loadingText}>{loadingText}</Text>
				</View>
			) : null}
			<View style={styles.countBadge}>
				<Text style={styles.countBadgeValue}>{visibleCount}</Text>
				<Text style={styles.countBadgeLabel}>{badgeText}</Text>
			</View>
			{!locationReady ? (
				<View pointerEvents="none" style={styles.loadingOverlay} />
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		minHeight: 430,
		overflow: 'hidden',
		backgroundColor: '#F4F5F7',
	},
	mapView: {
		flex: 1,
		width: '100%',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(244, 245, 247, 0.2)',
	},
	recordsLoadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(244, 245, 247, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: 16,
	},
	loadingText: {
		fontSize: 14,
		color: '#717182',
	},
	countBadge: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.94)',
		borderRadius: 14,
		paddingHorizontal: 10,
		paddingVertical: 7,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		borderWidth: 1,
		borderColor: '#E1E5EA',
	},
	countBadgeValue: {
		color: '#E53935',
		fontSize: 13,
		fontWeight: '900',
	},
	countBadgeLabel: {
		color: '#6B7280',
		fontSize: 11,
		fontWeight: '700',
	},
})

const mapStyle = [
	{
		featureType: 'poi',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.business',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.government',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.icon',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8d94a0' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#f5f5f5' }],
	},
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [{ color: '#f3f4f6' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#dfe6ee' }],
	},
]
