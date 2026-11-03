import React from 'react'
import { colors } from '../constants/theme'
import FeedbackModal from './FeedbackModal'

// Aviso para ações cujo backend ainda não existe (evita fingir que algo foi salvo).
export function ComingSoonModal({
	visible,
	message,
	onClose,
}: {
	visible: boolean
	message: string
	onClose: () => void
}) {
	return (
		<FeedbackModal
			visible={visible}
			title="Em breve"
			message={message}
			iconName="information-circle-outline"
			iconColor={colors.secondary}
			onConfirm={onClose}
		/>
	)
}

export default ComingSoonModal
