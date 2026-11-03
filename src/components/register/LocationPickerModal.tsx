import React from 'react'
import { Pressable, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import type { Coordinates } from '../../hooks/useRegisterLocation'
import { mapViewStyles } from '../map/mapViewStyles'
import { registerStyles as styles } from './registerStyles'

type Props = {
	userLocation: Coordinates | null
	tempLocation: Coordinates | null
	onSelect: (coordinate: Coordinates) => void
	onBack: () => void
	onConfirm: () => void
}

// Tela cheia com o mapa para escolher onde o avistamento aconteceu.
export function LocationPickerModal({
	userLocation,
	tempLocation,
	onSelect,
	onBack,
	onConfirm,
}: Props) {
	return (
		<View style={styles.locationPickerOverlay}>
			<MapView
				style={styles.pickerMap}
				accessibilityLabel="Mapa para escolher a localização do registro"
				initialRegion={userLocation ? {
					latitude: userLocation.latitude,
					longitude: userLocation.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				} : {
					latitude: -24.4959,
					longitude: -47.8431,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}}
				onPress={(e) => onSelect(e.nativeEvent.coordinate)}
			>
				{userLocation && (
					<Marker
						coordinate={userLocation}
						anchor={{ x: 0.5, y: 0.5 }}
					>
						<View style={mapViewStyles.userMarkerContainer}>
							<View style={mapViewStyles.userMarkerCircle}>
								<Ionicons name="navigate" size={16} color={colors.onColor} />
							</View>
						</View>
					</Marker>
				)}
				{tempLocation && (
					<Marker coordinate={tempLocation} />
				)}
			</MapView>
			<View style={styles.pickerHeader}>
				<Pressable
					onPress={onBack}
					accessibilityRole="button"
					accessibilityLabel="Voltar"
					style={styles.pickerButton}
				>
					<Ionicons name="arrow-back" size={24} color={colors.text} />
					<Text style={styles.pickerButtonText}>Voltar</Text>
				</Pressable>
				<Pressable
					onPress={onConfirm}
					accessibilityRole="button"
					accessibilityLabel="Confirmar localização"
					accessibilityState={{ disabled: !tempLocation }}
					disabled={!tempLocation}
					style={[
						styles.pickerButton,
						!tempLocation && { opacity: 0.5 },
					]}
				>
					<Text style={styles.pickerButtonConfirmText}>Confirmar Localização</Text>
				</Pressable>
			</View>
		</View>
	)
}
