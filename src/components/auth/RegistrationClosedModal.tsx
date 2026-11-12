import React from 'react'
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
	return (
		<FeedbackModal
			visible={visible}
			title="Cadastro indisponível"
			message="O cadastro de novas contas está fechado no momento. Se você já tem uma conta, use o botão Entrar."
			iconName="information-circle-outline"
			iconColor={colors.secondary}
			onConfirm={onClose}
		/>
	)
}

export default RegistrationClosedModal
