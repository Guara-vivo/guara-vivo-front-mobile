import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import FeedbackModal from '../components/FeedbackModal'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function RegisterEmailScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [email, setEmail] = useState('')
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)

	const handleContinue = () => {
		if (!email.trim()) {
			setFeedback({
				title: 'Campo obrigatório',
				message: 'Informe um e-mail para continuar.',
			})
			return
		}
		navigation.navigate('RegisterPassword')
	}

	return (
		<>
			<AuthFrame
				title="Crie sua conta"
				subtitle="Informe seu e-mail para começar."
				onBack={() => navigation.goBack()}
				step={{ current: 1, total: 2 }}
				footer={<ActionButton title="Continuar" onPress={handleContinue} />}
			>
				<AuthField
					label="E-mail"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoComplete="email"
					textContentType="emailAddress"
					returnKeyType="next"
					onSubmitEditing={handleContinue}
				/>
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

export default RegisterEmailScreen
