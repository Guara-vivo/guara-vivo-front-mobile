import { View } from 'react-native'
import { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { mapViewStyles as styles } from './mapViewStyles'
import { colors } from '../../constants/theme'

type Props = {
	latitude: number
	longitude: number
}

export function UserLocationMarker({ latitude, longitude }: Props) {
	return (
		<Marker
			coordinate={{ latitude, longitude }}
			anchor={{ x: 0.5, y: 0.5 }}
			title="Sua Localização"
			description="Localização atual"
		>
			<View style={styles.userMarkerContainer}>
				<View style={styles.userMarkerCircle}>
					<Ionicons name="navigate" size={16} color={colors.onColor} />
				</View>
			</View>
		</Marker>
	)
}
