import React, { useEffect, useState } from 'react'
import {
	Alert,
	Image,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { spacing } from '../constants/theme'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

const welcomeLogo = require('../assets/images/Logo Fonte Clara.png')

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
	useEffect(() => {
		const timer = setTimeout(onFinish, 1600)
		return () => clearTimeout(timer)
	}, [onFinish])

	return (
		<View style={[appStyles.screen, appStyles.splashScreen]}>
			<Image
				source={welcomeLogo}
				style={appStyles.splashLogo}
				resizeMode="contain"
			/>
		</View>
	)
}

export function WelcomeScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	return (
		<View style={appStyles.welcomeScreen}>
			<View style={appStyles.welcomeContent}>
				<Image
					source={welcomeLogo}
					style={appStyles.welcomeLogo}
					resizeMode="contain"
				/>

				<View style={appStyles.welcomeActions}>
					<ActionButton
						title="Acessar minha conta"
						onPress={() => onNavigate('login')}
						containerStyle={appStyles.welcomePrimaryButton}
						textStyle={appStyles.welcomePrimaryButtonLabel}
					/>
					<View style={{ height: spacing.lg }} />
					<Pressable
						onPress={() => onNavigate('register-email')}
						style={appStyles.welcomeTextButton}
					>
						<Text style={appStyles.welcomeTextButtonLabel}>CRIAR CONTA</Text>
					</Pressable>
				</View>
			</View>
		</View>
	)
}

export function LoginScreen({
	onNavigate,
	onSuccess,
}: {
	onNavigate: (screen: ScreenId) => void
	onSuccess: () => void
}) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleLogin = () => {
		if (!email || !password) {
			Alert.alert(
				'Campos obrigatorios',
				'Preencha email e senha para continuar.',
			)
			return
		}

		onSuccess()
		onNavigate('home')
	}

	return (
		<View style={appStyles.loginScreen}>
			<ScrollView
				contentContainerStyle={appStyles.loginContent}
				style={appStyles.screen}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={appStyles.loginTitle}>Acessar conta</Text>

				<View style={appStyles.loginFields}>
					<View style={appStyles.loginFieldWrap}>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="E-mail de acesso"
							keyboardType="email-address"
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
								placeholderTextColor="#AEB4BF"
								style={appStyles.loginInput}
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
						title="ACESSAR"
						onPress={handleLogin}
						containerStyle={appStyles.loginPrimaryButton}
						textStyle={appStyles.loginPrimaryButtonLabel}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export function RegisterEmailScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [email, setEmail] = useState('')

	return (
		<View style={appStyles.registerAccountScreen}>
			<ScrollView
				contentContainerStyle={appStyles.registerAccountContent}
				style={appStyles.screen}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.registerHeaderRow}>
					<Pressable
						onPress={() => onNavigate('welcome')}
						style={appStyles.registerBackButton}
					>
						<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
					</Pressable>
					<Text style={appStyles.registerHeaderTitle}>Crie sua conta</Text>
				</View>

				<View style={appStyles.registerAccountTopWrap}>
					<View style={appStyles.registerAccountFieldBlock}>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="Qual seu e-mail?"
							placeholderTextColor="#9DA2AE"
							keyboardType="email-address"
							style={appStyles.registerAccountInput}
						/>
						<View style={appStyles.registerAccountDivider} />
					</View>
				</View>

				<View style={appStyles.registerAccountBottomWrap}>
					<ActionButton
						title="CONTINUAR"
						onPress={() => {
							if (!email) {
								Alert.alert(
									'Campo obrigatorio',
									'Informe um e-mail para continuar.',
								)
								return
							}
							onNavigate('register-password')
						}}
						containerStyle={appStyles.registerAccountPrimaryButton}
						textStyle={appStyles.registerAccountPrimaryButtonText}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export function RegisterPasswordScreen({
	onNavigate,
	onSuccess,
}: {
	onNavigate: (screen: ScreenId) => void
	onSuccess: () => void
}) {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleFinish = () => {
		if (password.length < 6) {
			Alert.alert('Senha fraca', 'Use pelo menos 6 caracteres.')
			return
		}

		if (password !== confirmPassword) {
			Alert.alert('Senhas diferentes', 'A confirmacao nao confere com a senha.')
			return
		}

		onSuccess()
		onNavigate('home')
	}

	return (
		<View style={appStyles.registerAccountScreen}>
			<ScrollView
				contentContainerStyle={appStyles.registerAccountContent}
				style={appStyles.screen}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.registerHeaderRow}>
					<Pressable
						onPress={() => onNavigate('register-email')}
						style={appStyles.registerBackButton}
					>
						<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
					</Pressable>
					<Text style={appStyles.registerHeaderTitle}>Crie sua senha</Text>
				</View>

				<View style={appStyles.registerAccountTopWrap}>
					<View style={appStyles.registerPasswordFieldBlock}>
						<View style={appStyles.registerPasswordInputRow}>
							<TextInput
								value={password}
								onChangeText={setPassword}
								placeholder="Senha"
								placeholderTextColor="#9DA2AE"
								secureTextEntry={!showPassword}
								style={appStyles.registerPasswordInput}
							/>
							<Pressable
								onPress={() => setShowPassword((current) => !current)}
								style={appStyles.registerPasswordEyeButton}
							>
								<Ionicons
									name={showPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#9A9A9A"
								/>
							</Pressable>
						</View>
						<View style={appStyles.registerPasswordDivider} />
						<Text style={appStyles.registerPasswordHint}>
							Minimo de 8 caracteres
						</Text>
					</View>

					<View style={appStyles.registerPasswordFieldBlock}>
						<View style={appStyles.registerPasswordInputRow}>
							<TextInput
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								placeholder="Confirmar senha"
								placeholderTextColor="#9DA2AE"
								secureTextEntry={!showConfirmPassword}
								style={appStyles.registerPasswordInput}
							/>
							<Pressable
								onPress={() => setShowConfirmPassword((current) => !current)}
								style={appStyles.registerPasswordEyeButton}
							>
								<Ionicons
									name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#9A9A9A"
								/>
							</Pressable>
						</View>
						<View style={appStyles.registerPasswordDivider} />
					</View>
				</View>

				<View style={appStyles.registerAccountBottomWrap}>
					<ActionButton
						title="CONTINUAR"
						onPress={handleFinish}
						containerStyle={appStyles.registerAccountPrimaryButton}
						textStyle={appStyles.registerAccountPrimaryButtonText}
					/>
				</View>
			</ScrollView>
		</View>
	)
}
