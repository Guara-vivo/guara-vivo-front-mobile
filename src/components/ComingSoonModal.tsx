import React from 'react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation('common')

	return (
		<FeedbackModal
			visible={visible}
			title={t('comingSoon')}
			message={message}
			iconName="information-circle-outline"
			iconColor={colors.secondary}
			onConfirm={onClose}
		/>
	)
}

export default ComingSoonModal
