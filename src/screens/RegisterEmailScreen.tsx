import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import FeedbackModal from '../components/FeedbackModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function RegisterEmailScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [email, setEmail] = useState('')
	const [feedback, setFeedback] = useState<{
		title: string
		message: string
	} | null>(null)

	return (
		<View style={appStyles.registerAccountScreen}>
			<ScrollView
				contentContainerStyle={appStyles.authContent}
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

				<View style={appStyles.authButtonWrap}>
					<ActionButton
						title="CONTINUAR"
						onPress={() => {
							if (!email) {
								setFeedback({
									title: 'Campo obrigatorio',
									message: 'Informe um e-mail para continuar.',
								})
								return
							}
							onNavigate('register-password')
						}}
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

export default RegisterEmailScreen
