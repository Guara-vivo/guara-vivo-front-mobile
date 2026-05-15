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

export function RegisterEmailScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [email, setEmail] = useState('')

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
								Alert.alert(
									'Campo obrigatorio',
									'Informe um e-mail para continuar.',
								)
								return
							}
							onNavigate('register-password')
						}}
						containerStyle={appStyles.authPrimaryButton}
						textStyle={appStyles.authPrimaryButtonText}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export default RegisterEmailScreen
