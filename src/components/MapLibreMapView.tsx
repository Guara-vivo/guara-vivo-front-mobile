import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MAP_CENTER } from '../config/map'
import type { MapLayerId, MapRecord } from '../config/map'
import { useEffect, useState } from 'react'

type Props = {
	selectedLayer: MapLayerId
	records: MapRecord[]
}

export function MapLibreMapView({ selectedLayer, records }: Props) {
	const [mapCenter, setMapCenter] = useState(MAP_CENTER)
	const [locationReady, setLocationReady] = useState(false)

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
					setMapCenter({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					})
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

	const visibleRecords = records.filter((record) => {
		const behavior = String(record.behavior || '').toLowerCase()

		if (selectedLayer === 'all') {
			return behavior.includes('ninh') || behavior.includes('aliment')
		}

		if (selectedLayer === 'feeding') {
			return behavior.includes('aliment')
		}

		return behavior.includes('ninh')
	})

	const markers = visibleRecords.map((record) => {
		const behavior = String(record.behavior || '').toLowerCase()
		const isNest = behavior.includes('ninh')
		const isFeeding = behavior.includes('aliment')
		const markerColor = isNest ? '#2F6FE4' : '#E53935'
		const markerIcon = isNest ? 'home' : 'fish'
		const markerDotSize = isFeeding ? 18 : 11

		return (
			<Marker
				key={record.id}
				coordinate={{
					latitude: record.latitude_camera,
					longitude: record.longitude_camera,
				}}
				onPress={() => {
					// Adicionar lógica de popover/info aqui
				}}
			>
				<View style={styles.customMarker}>
					{markerIcon ? (
						<Ionicons name={markerIcon} size={20} color={markerColor} />
					) : (
						<View
							style={[
								styles.markerDot,
								{
									width: markerDotSize,
									height: markerDotSize,
									borderRadius: markerDotSize,
									backgroundColor: markerColor,
								},
							]}
						/>
					)}
				</View>
			</Marker>
		)
	})

	const visibleCount = visibleRecords.length
	const badgeText =
		selectedLayer === 'all'
			? 'registros'
			: selectedLayer === 'feeding'
				? 'alimentação'
				: 'ninhos'

	return (
		<View style={styles.container}>
			<MapView
				style={styles.mapView}
				showsPointsOfInterest={false}
				showsIndoors={false}
				showsBuildings={false}
				customMapStyle={mapStyle}
				initialRegion={{
					latitude: mapCenter.lat,
					longitude: mapCenter.lng,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				onRegionChangeComplete={(e) => {
					// Atualiza o estado do centro do mapa se necessário
					setMapCenter({ lat: e.latitude, lng: e.longitude })
				}}
			>
				{markers}
			</MapView>
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
	customMarker: {
		width: 22,
		height: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	markerDot: {
		width: 11,
		height: 11,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: '#FFFFFF',
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
