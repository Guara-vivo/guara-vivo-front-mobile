import React from 'react'
import { Pressable, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors } from '../../constants/theme'
import type { Coordinates } from '../../hooks/useRegisterLocation'
import { mapStyle } from '../../config/mapStyle'
import { UserLocationMarker } from '../map/UserLocationMarker'
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
	const { t } = useTranslation('register')

	return (
		<View style={styles.locationPickerOverlay}>
			<MapView
				style={styles.pickerMap}
				accessibilityLabel={t('location.mapA11y')}
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
				showsPointsOfInterest={false}
					showsIndoors={false}
					showsBuildings={false}
					customMapStyle={mapStyle}
					onPress={(e) => onSelect(e.nativeEvent.coordinate)}
			>
				{userLocation && (
					<UserLocationMarker
						latitude={userLocation.latitude}
						longitude={userLocation.longitude}
					/>
				)}
				{tempLocation && (
					<Marker coordinate={tempLocation} />
				)}
			</MapView>
			<View style={styles.pickerHeader}>
				<Pressable
					onPress={onBack}
					accessibilityRole="button"
					accessibilityLabel={t('back')}
					style={styles.pickerButton}
				>
					<Ionicons name="arrow-back" size={24} color={colors.text} />
					<Text style={styles.pickerButtonText}>{t('back')}</Text>
				</Pressable>
				<Pressable
					onPress={onConfirm}
					accessibilityRole="button"
					accessibilityLabel={t('location.confirmA11y')}
					accessibilityState={{ disabled: !tempLocation }}
					disabled={!tempLocation}
					style={[
						styles.pickerButton,
						!tempLocation && { opacity: 0.5 },
					]}
				>
					<Text style={styles.pickerButtonConfirmText}>{t('location.confirm')}</Text>
				</Pressable>
			</View>
		</View>
	)
}
