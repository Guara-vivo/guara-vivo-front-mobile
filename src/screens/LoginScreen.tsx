import React, { useRef, useState } from 'react'
import {
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import FeedbackModal from '../components/FeedbackModal'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { ApiError } from '../services/apiClient'
import { login } from '../services/authService'
import { appStyles } from '../styles/appStyles'
import type { UserRead } from '../types/api'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function LoginScreen({
	onSuccess,
}: {
	onSuccess: (user: UserRead) => void
}) {
	const navigation = useNavigation<NavigationProp>()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [showForgotNotice, setShowForgotNotice] = useState(false)
	const passwordInputRef = useRef<TextInput>(null)
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
				'Campos obrigatórios',
				'Preencha e-mail e senha para continuar.',
			)
			return
		}

		try {
			setIsLoading(true)
			const response = await login(email.trim(), password)
			onSuccess(response.user)
			// Navigation is now handled by RootNavigator reacting to isAuthenticated
		} catch (error) {
			// So uma resposta da API indica credenciais erradas; o resto e conexao.
			if (error instanceof ApiError && error.status < 500) {
				showErrorFeedback('Falha no login', 'Confira e-mail e senha e tente novamente.')
			} else {
				showErrorFeedback(
					'Sem conexão',
					'Não foi possível falar com o servidor. Verifique sua internet e tente novamente.',
				)
			}
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
						onPress={() => navigation.goBack()}
						accessibilityRole="button"
						accessibilityLabel="Voltar"
						hitSlop={10}
						style={appStyles.loginBackButton}
					>
						<Ionicons name="chevron-back" size={24} color={colors.text} />
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
							autoCorrect={false}
							autoComplete="email"
							textContentType="emailAddress"
							returnKeyType="next"
							onSubmitEditing={() => passwordInputRef.current?.focus()}
							blurOnSubmit={false}
							accessibilityLabel="E-mail de acesso"
							editable={!isLoading}
							placeholderTextColor={colors.placeholder}
							style={appStyles.loginInput}
						/>
						<View style={appStyles.loginDivider} />
					</View>

					<View style={appStyles.loginFieldWrap}>
						<View style={appStyles.loginPasswordRow}>
							<TextInput
								ref={passwordInputRef}
								value={password}
								onChangeText={setPassword}
								placeholder="Senha de acesso"
								secureTextEntry={!showPassword}
								autoCapitalize="none"
								autoCorrect={false}
								autoComplete="current-password"
								textContentType="password"
								returnKeyType="go"
								onSubmitEditing={handleLogin}
								accessibilityLabel="Senha de acesso"
								editable={!isLoading}
								placeholderTextColor={colors.placeholder}
								style={[appStyles.loginInput, appStyles.loginPasswordInput]}
							/>
							<Pressable
								onPress={() => setShowPassword((current) => !current)}
								accessibilityRole="button"
								accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
								hitSlop={10}
								style={appStyles.loginEyeButton}
							>
								<Ionicons
									name={showPassword ? 'eye' : 'eye-off-outline'}
									size={22}
									color={colors.muted}
								/>
							</Pressable>
						</View>
						<View style={appStyles.loginDivider} />
					</View>

						<Pressable
							onPress={() => setShowForgotNotice(true)}
							accessibilityRole="button"
							accessibilityLabel="Recuperar senha"
							hitSlop={8}
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
		</View>
	)
}

export default LoginScreen
