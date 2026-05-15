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
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

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

export default LoginScreen
