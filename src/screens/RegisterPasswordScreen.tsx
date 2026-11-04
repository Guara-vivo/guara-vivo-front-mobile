import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import FeedbackModal from '../components/FeedbackModal'
import { PasswordRules } from '../components/PasswordRules'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import {
	getPasswordRuleStatus,
	isPasswordLongEnough,
	isPasswordWithinLimit,
	MAX_PASSWORD_BYTES,
	MIN_PASSWORD_LENGTH,
} from '../utils/passwordRules'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function RegisterPasswordScreen({ onSuccess }: { onSuccess: () => void }) {
	const navigation = useNavigation<NavigationProp>()
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)
	const status = getPasswordRuleStatus(password, confirmPassword)

	const handleFinish = () => {
		if (!isPasswordLongEnough(password)) {
			setFeedback({ title: 'Senha fraca', message: `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` })
			return
		}

		if (!isPasswordWithinLimit(password)) {
			setFeedback({
				title: 'Senha muito longa',
				message: `Use no máximo ${MAX_PASSWORD_BYTES} bytes (acentos e símbolos ocupam mais de 1).`,
			})
			return
		}

		if (password !== confirmPassword) {
			setFeedback({ title: 'Senhas diferentes', message: 'A confirmação não confere com a senha.' })
			return
		}

		onSuccess()
		// A navegação é feita pelo RootNavigator, que reage a isAuthenticated.
	}

	return (
		<>
			<AuthFrame
				title="Crie sua senha"
				subtitle="Você vai usar ela, junto com o e-mail, para entrar."
				onBack={() => navigation.goBack()}
				step={{ current: 2, total: 2 }}
				footer={<ActionButton title="Continuar" onPress={handleFinish} />}
			>
				<AuthField
					label="Senha"
					value={password}
					onChangeText={setPassword}
					secure
					autoComplete="new-password"
					textContentType="newPassword"
					returnKeyType="next"
					hasError={!status.withinByteLimit}
				/>
				<AuthField
					label="Confirmar senha"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secure
					autoComplete="new-password"
					textContentType="newPassword"
					returnKeyType="go"
					onSubmitEditing={handleFinish}
				/>
				<PasswordRules status={status} />
			</AuthFrame>

			{feedback ? (
				<FeedbackModal
					visible
					title={feedback.title}
					message={feedback.message}
					buttonLabel="OK"
					iconName="alert-circle-outline"
					iconColor={colors.primary}
					onConfirm={() => setFeedback(null)}
				/>
			) : null}
		</>
	)
}

export default RegisterPasswordScreen
