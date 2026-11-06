import React from 'react'
import { Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { mapStyle } from '../../config/mapStyle'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import { formatLocationLabel } from '../../utils/recordFormatters'

const MINI_MAP_DELTA = 0.004

// Cartão "Local": mini-mapa estático (liteMode, sem gestos), áreas e coordenadas.
export function RecordLocationCard({ record }: { record: RecordDetailItem }) {
	const areaLabel = record.map_zones.length
		? record.map_zones.map((zone) => zone.name).join(' · ')
		: 'Sem área'
	const coordinate = { latitude: record.latitude, longitude: record.longitude }

	return (
		<View style={appStyles.recordDetailCard}>
			<View style={appStyles.recordDetailCardHeader}>
				<View style={appStyles.recordDetailCardIcon}>
					<Ionicons name="location-outline" size={20} color={colors.primary} />
				</View>
				<View style={appStyles.recordDetailCardTitleWrap}>
					<Text style={appStyles.recordDetailCardTitle}>Local</Text>
					<Text style={appStyles.recordDetailCardText}>{areaLabel}</Text>
				</View>
			</View>

			<View
				style={appStyles.recordDetailMiniMap}
				accessible
				accessibilityLabel={`Mapa do local do registro, coordenadas ${formatLocationLabel(record.latitude, record.longitude)}`}
			>
				<MapView
					style={appStyles.recordDetailMiniMapView}
					liteMode
					scrollEnabled={false}
					zoomEnabled={false}
					rotateEnabled={false}
					pitchEnabled={false}
					toolbarEnabled={false}
					showsPointsOfInterest={false}
					customMapStyle={mapStyle}
					initialRegion={{
						...coordinate,
						latitudeDelta: MINI_MAP_DELTA,
						longitudeDelta: MINI_MAP_DELTA,
					}}
				>
					<Marker coordinate={coordinate} pinColor={colors.primary} />
				</MapView>
			</View>

			<Text style={appStyles.recordDetailCoordinates}>
				{`${record.latitude.toFixed(5)}, ${record.longitude.toFixed(5)}`}
			</Text>
		</View>
	)
}
