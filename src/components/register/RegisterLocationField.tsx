import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation('register')

	return (
		<View style={appStyles.registerDateRow}>
			<View style={appStyles.registerDateField}>
				<Pressable
					onPress={onOpen}
					accessibilityRole="button"
					accessibilityLabel={hasSelectedLocation ? t('location.changeA11y') : t('location.chooseA11y')}
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
						{hasSelectedLocation ? t('location.selected') : t('location.current')}
					</Text>
				</Pressable>
				{!hasSelectedLocation && <Ionicons name="map-outline" size={16} color={colors.secondary} />}
				{hasSelectedLocation && (
					<Pressable
						onPress={onClear}
						disabled={disabled}
						accessibilityRole="button"
						accessibilityLabel={t('location.useDevice')}
						style={styles.locationClearButton}
					>
						<Ionicons name="close-circle" size={20} color={colors.primary} />
					</Pressable>
				)}
			</View>
		</View>
	)
}
