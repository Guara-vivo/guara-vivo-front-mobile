import { Animated, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import type { MapZoneRecordRead } from '../../types/api'
import { mapViewStyles as styles } from './mapViewStyles'
import { colors } from '../../constants/theme'

type RecordMarkerProps = {
	record: MapZoneRecordRead
	focused: boolean
	opacity: Animated.Value
	onPress?: (recordId: number) => void
}

export function RecordMarker({ record, focused, opacity, onPress }: RecordMarkerProps) {
	return (
		<Marker
			coordinate={{
				latitude: record.latitude_camera,
				longitude: record.longitude_camera,
			}}
			onPress={onPress ? () => onPress(record.id) : undefined}
			anchor={{ x: 0.5, y: 0.5 }}
			zIndex={focused ? 201 : 200}
		>
			<Animated.View
				style={[
					styles.recordMarkerOuter,
					focused ? styles.recordMarkerOuterFocused : null,
					{ opacity },
				]}
			>
				<View style={styles.recordMarkerInner}>
					<Ionicons name="eye" size={12} color={colors.onColor} />
				</View>
				<Text style={styles.recordMarkerText}>{record.ibis_quantity ?? 0}</Text>
			</Animated.View>
		</Marker>
	)
}
