import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import FeedbackModal from '../components/FeedbackModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function RegisterEmailScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [email, setEmail] = useState('')
	const [feedback, setFeedback] = useState<{
		title: string
		message: string
	} | null>(null)

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
		<View style={appStyles.registerAccountScreen}>
			<ScrollView
				contentContainerStyle={appStyles.authContent}
				style={appStyles.screen}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.registerHeaderRow}>
						<Pressable
							onPress={() => navigation.goBack()}
							accessibilityRole="button"
							accessibilityLabel="Voltar"
							hitSlop={10}
							style={appStyles.registerBackButton}
						>
							<Ionicons name="chevron-back" size={24} color={colors.text} />
						</Pressable>

					<Text style={appStyles.registerHeaderTitle}>Crie sua conta</Text>
				</View>

				<View style={appStyles.registerAccountTopWrap}>
					<View style={appStyles.registerAccountFieldBlock}>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="Qual seu e-mail?"
							placeholderTextColor={colors.placeholder}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							autoComplete="email"
							textContentType="emailAddress"
							returnKeyType="next"
							onSubmitEditing={handleContinue}
							accessibilityLabel="E-mail"
							style={appStyles.registerAccountInput}
						/>
						<View style={appStyles.registerAccountDivider} />
					</View>
				</View>

				<View style={appStyles.authButtonWrap}>
						<ActionButton
							title="CONTINUAR"
							onPress={handleContinue}
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
