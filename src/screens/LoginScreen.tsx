import React, { useRef, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FeedbackModal from '../components/FeedbackModal'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { RegistrationClosedModal } from '../components/auth/RegistrationClosedModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { login } from '../services/authService'
import { appStyles } from '../styles/appStyles'
import type { UserRead } from '../types/api'
import { formatAppVersion } from '../utils/appVersion'
import { getLoginErrorFeedback } from '../utils/loginErrorMessage'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function LoginScreen({ onSuccess }: { onSuccess: (user: UserRead) => void }) {
	const navigation = useNavigation<NavigationProp>()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showForgotNotice, setShowForgotNotice] = useState(false)
	const [showRegistrationClosed, setShowRegistrationClosed] = useState(false)
	const passwordInputRef = useRef<TextInput>(null)
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)

	const handleLogin = async () => {
		if (!email || !password) {
			setFeedback({
				title: 'Campos obrigatórios',
				message: 'Preencha e-mail e senha para continuar.',
			})
			return
		}

		try {
			setIsLoading(true)
			const response = await login(email.trim(), password)
			onSuccess(response.user)
			// A navegação é feita pelo RootNavigator, que reage a isAuthenticated.
		} catch (error) {
			setFeedback(getLoginErrorFeedback(error))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<AuthFrame
				title="Entrar"
				subtitle="Use o e-mail e a senha da sua conta."
				onBack={() => navigation.goBack()}
				footer={
					<>
						<ActionButton
							title={isLoading ? 'Entrando...' : 'Entrar'}
							onPress={handleLogin}
							disabled={isLoading}
						/>
						<View style={appStyles.authBelowRow}>
							<Text style={appStyles.authBelowText}>Ainda não tem conta?</Text>
							<Pressable
								onPress={() => setShowRegistrationClosed(true)}
								accessibilityRole="button"
								accessibilityLabel="Criar conta"
								hitSlop={8}
							>
								<Text style={appStyles.authLink}>Criar conta</Text>
							</Pressable>
						</View>
						<Text style={appStyles.authVersion}>{formatAppVersion()}</Text>
					</>
				}
			>
				<AuthField
					label="E-mail"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoComplete="email"
					textContentType="emailAddress"
					returnKeyType="next"
					onSubmitEditing={() => passwordInputRef.current?.focus()}
					blurOnSubmit={false}
					editable={!isLoading}
				/>
				<AuthField
					ref={passwordInputRef}
					label="Senha"
					value={password}
					onChangeText={setPassword}
					secure
					autoComplete="current-password"
					textContentType="password"
					returnKeyType="go"
					onSubmitEditing={handleLogin}
					editable={!isLoading}
				/>
				<Pressable
					onPress={() => setShowForgotNotice(true)}
					accessibilityRole="button"
					accessibilityLabel="Recuperar senha"
					hitSlop={{ left: 8, right: 8 }}
					style={appStyles.authLinkButton}
				>
					<Text style={appStyles.authLink}>Esqueci minha senha</Text>
				</Pressable>
			</AuthFrame>

			<RegistrationClosedModal
				visible={showRegistrationClosed}
				onClose={() => setShowRegistrationClosed(false)}
			/>

			<ComingSoonModal
				visible={showForgotNotice}
				message="A recuperação de senha ainda não está disponível no aplicativo."
				onClose={() => setShowForgotNotice(false)}
			/>

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

export default LoginScreen
