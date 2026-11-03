import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import { registerStyles as styles } from './registerStyles'

type Props = {
	hasSelectedLocation: boolean
	disabled: boolean
	onOpen: () => void
	onClear: () => void
}

export function RegisterLocationField({
	hasSelectedLocation,
	disabled,
	onOpen,
	onClear,
}: Props) {
	return (
		<View style={appStyles.registerDateRow}>
			<View style={appStyles.registerDateField}>
				<Pressable
					onPress={onOpen}
					accessibilityRole="button"
					accessibilityLabel={hasSelectedLocation ? "Localização selecionada. Alterar no mapa" : "Escolher localização no mapa. Usando a localização do dispositivo"}
					accessibilityState={{ disabled: !!disabled }}
					disabled={disabled}
					style={styles.locationFieldContent}
				>
					<Text
						style={[
							appStyles.registerDateFieldText,
							!hasSelectedLocation && appStyles.registerDateFieldPlaceholder,
						]}
					>
						{hasSelectedLocation ? 'Localização selecionada' : 'Localização atual do dispositivo'}
					</Text>
				</Pressable>
				{!hasSelectedLocation && <Ionicons name="map-outline" size={16} color={colors.secondary} />}
				{hasSelectedLocation && (
					<Pressable
						onPress={onClear}
						disabled={disabled}
						accessibilityRole="button"
						accessibilityLabel="Usar a localização do dispositivo"
						style={styles.locationClearButton}
					>
						<Ionicons name="close-circle" size={20} color={colors.primary} />
					</Pressable>
				)}
			</View>
		</View>
	)
}
