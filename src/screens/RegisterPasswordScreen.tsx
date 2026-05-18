import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import FeedbackModal from '../components/FeedbackModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

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
	const [feedback, setFeedback] = useState<{
		title: string
		message: string
	} | null>(null)

	const showErrorFeedback = (title: string, message: string) => {
		setFeedback({ title, message })
	}

	const handleFinish = () => {
		if (password.length < 6) {
			showErrorFeedback('Senha fraca', 'Use pelo menos 6 caracteres.')
			return
		}

		if (password !== confirmPassword) {
			showErrorFeedback(
				'Senhas diferentes',
				'A confirmacao nao confere com a senha.',
			)
			return
		}

		onSuccess()
		onNavigate('home')
	}

	return (
		<View style={appStyles.registerAccountScreen}>
			<ScrollView
				contentContainerStyle={appStyles.authContent}
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

				<View style={appStyles.authButtonWrap}>
					<ActionButton
						title="CONTINUAR"
						onPress={handleFinish}
						containerStyle={appStyles.authPrimaryButton}
						textStyle={appStyles.authPrimaryButtonText}
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

export default RegisterPasswordScreen
