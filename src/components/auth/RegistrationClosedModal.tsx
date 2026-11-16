import React from 'react'
import { useTranslation } from 'react-i18next'
import { colors } from '../../constants/theme'
import FeedbackModal from '../FeedbackModal'

// O cadastro de novas contas está fechado na API (POST /users). A tela de cadastro não é
// mais aberta: quem toca em "Criar conta" recebe este aviso.
export function RegistrationClosedModal({
	visible,
	onClose,
}: {
	visible: boolean
	onClose: () => void
}) {
	const { t } = useTranslation('auth')

	return (
		<FeedbackModal
			visible={visible}
			title={t('registrationClosed.title')}
			message={t('registrationClosed.message')}
			iconName="information-circle-outline"
			iconColor={colors.secondary}
			onConfirm={onClose}
		/>
	)
}

export default RegistrationClosedModal
