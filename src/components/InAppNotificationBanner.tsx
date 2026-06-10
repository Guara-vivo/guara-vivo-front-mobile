import React from 'react'
import { Pressable, Text, View, type GestureResponderEvent } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

export type InAppNotificationVariant = 'success' | 'error'

type InAppNotificationBannerProps = {
	title: string
	message: string
	variant: InAppNotificationVariant
	onPress: () => void
	onClose: () => void
}

export function InAppNotificationBanner({
	title,
	message,
	variant,
	onPress,
	onClose,
}: InAppNotificationBannerProps) {
	const isError = variant === 'error'
	const handleClose = (event: GestureResponderEvent) => {
		event.stopPropagation()
		onClose()
	}

	return (
		<View pointerEvents="box-none" style={appStyles.inAppNotificationOverlay}>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={`${title}. ${message}`}
				onPress={onPress}
				style={[
					appStyles.inAppNotificationBanner,
					isError && appStyles.inAppNotificationBannerError,
				]}
			>
				<View style={appStyles.inAppNotificationIconWrap}>
					<Ionicons
						name={isError ? 'alert-circle' : 'checkmark-circle'}
						size={22}
						color={isError ? colors.primary : '#2E9D57'}
					/>
				</View>

				<View style={appStyles.inAppNotificationTextWrap}>
					<Text style={appStyles.inAppNotificationTitle}>{title}</Text>
					<Text style={appStyles.inAppNotificationMessage}>{message}</Text>
				</View>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Fechar notificação"
					hitSlop={8}
					onPress={handleClose}
					style={appStyles.inAppNotificationCloseButton}
				>
					<Ionicons name="close" size={18} color={colors.muted} />
				</Pressable>
			</Pressable>
		</View>
	)
}

export default InAppNotificationBanner
