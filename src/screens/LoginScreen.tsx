import React, { useState } from 'react'
import {
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import FeedbackModal from '../components/FeedbackModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { login } from '../services/authService'
import { appStyles } from '../styles/appStyles'
import type { UserRead } from '../types/api'
import type { ScreenId } from '../types/navigation'

export function LoginScreen({
	onNavigate,
	onSuccess,
}: {
	onNavigate: (screen: ScreenId) => void
	onSuccess: (user: UserRead) => void
}) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [feedback, setFeedback] = useState<{
		title: string
		message: string
	} | null>(null)

	const showErrorFeedback = (title: string, message: string) => {
		setFeedback({ title, message })
	}

	const handleLogin = async () => {
		if (!email || !password) {
			showErrorFeedback(
				'Campos obrigatorios',
				'Preencha e-mail e senha para continuar.',
			)
			return
		}

		try {
			setIsLoading(true)
			const response = await login(email.trim(), password)
			onSuccess(response.user)
			onNavigate('home')
		} catch {
			showErrorFeedback('Falha no login', 'Confira e-mail e senha e tente novamente.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View style={appStyles.loginScreen}>
			<ScrollView
				contentContainerStyle={appStyles.loginContent}
				style={appStyles.screen}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.loginHeaderRow}>
					<Pressable
						onPress={() => onNavigate('welcome')}
						hitSlop={10}
						style={appStyles.loginBackButton}
					>
						<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
					</Pressable>
					<Text style={appStyles.loginTitle}>Acessar conta</Text>
				</View>

				<View style={appStyles.loginFields}>
					<View style={appStyles.loginFieldWrap}>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="E-mail de acesso"
							keyboardType="email-address"
							autoCapitalize="none"
							editable={!isLoading}
							placeholderTextColor="#AEB4BF"
							style={appStyles.loginInput}
						/>
						<View style={appStyles.loginDivider} />
					</View>

					<View style={appStyles.loginFieldWrap}>
						<View style={appStyles.loginPasswordRow}>
							<TextInput
								value={password}
								onChangeText={setPassword}
								placeholder="Senha de acesso"
								secureTextEntry={!showPassword}
								autoCapitalize="none"
								editable={!isLoading}
								placeholderTextColor="#AEB4BF"
								style={[appStyles.loginInput, appStyles.loginPasswordInput]}
							/>
							<Pressable
								onPress={() => setShowPassword((current) => !current)}
								hitSlop={10}
								style={appStyles.loginEyeButton}
							>
								<Ionicons
									name={showPassword ? 'eye' : 'eye-off-outline'}
									size={22}
									color="#A3A3A3"
								/>
							</Pressable>
						</View>
						<View style={appStyles.loginDivider} />
					</View>

					<Pressable
						onPress={() =>
							Alert.alert(
								'Recuperacao',
								'Fluxo de recuperacao entra na proxima etapa.',
							)
						}
					>
						<Text style={appStyles.loginForgot}>Recuperar senha</Text>
					</Pressable>
				</View>

				<View style={appStyles.loginButtonWrap}>
					<ActionButton
						title={isLoading ? 'ACESSANDO...' : 'ACESSAR'}
						onPress={handleLogin}
						disabled={isLoading}
						containerStyle={appStyles.loginPrimaryButton}
						textStyle={appStyles.loginPrimaryButtonLabel}
					/>
				</View>
			</ScrollView>

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
		</View>
	)
}

export default LoginScreen
