import React from 'react'
import { Modal, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import { ActionButton } from './common'

type FeedbackModalProps = {
	visible: boolean
	title: string
	message: string
	buttonLabel?: string
	iconName?: keyof typeof Ionicons.glyphMap
	iconColor?: string
	onConfirm: () => void
}

export function FeedbackModal({
	visible,
	title,
	message,
	buttonLabel = 'OK',
	iconName = 'checkmark-circle-outline',
	iconColor = colors.secondary,
	onConfirm,
}: FeedbackModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onConfirm}
		>
			<View style={appStyles.feedbackModalBackdrop}>
				<View style={appStyles.feedbackModalCard}>
					<View style={appStyles.feedbackModalIconWrap}>
						<Ionicons name={iconName} size={46} color={iconColor} />
					</View>

					<Text style={appStyles.feedbackModalTitle}>{title}</Text>
					<Text style={appStyles.feedbackModalMessage}>{message}</Text>

					<ActionButton
						title={buttonLabel}
						onPress={onConfirm}
						containerStyle={appStyles.feedbackModalButton}
					/>
				</View>
			</View>
		</Modal>
	)
}

export default FeedbackModal
