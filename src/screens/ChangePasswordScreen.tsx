import React, { useCallback, useReducer, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { PasswordField } from '../components/PasswordField'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { getPasswordHint } from '../utils/passwordRules'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type Field = 'currentPassword' | 'newPassword' | 'confirmPassword'
type State = Record<Field, string>

const initialState: State = { currentPassword: '', newPassword: '', confirmPassword: '' }

function reducer(state: State, action: { field: Field; value: string }): State {
	return { ...state, [action.field]: action.value }
}

export function ChangePasswordScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [state, dispatch] = useReducer(reducer, initialState)
	const [showComingSoon, setShowComingSoon] = useState(false)

	const goBack = useCallback(() => navigation.goBack(), [navigation])

	return (
		<KeyboardAvoidingView
			style={appStyles.profileScreen}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<Header title="Editar Senha" leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.changePasswordCard}>
					<PasswordField
						label="SENHA ATUAL"
						value={state.currentPassword}
						onChangeText={(value) => dispatch({ field: 'currentPassword', value })}
						autoComplete="current-password"
					/>
					<PasswordField
						label="NOVA SENHA"
						value={state.newPassword}
						onChangeText={(value) => dispatch({ field: 'newPassword', value })}
						hint={getPasswordHint(state.newPassword)}
						autoComplete="new-password"
					/>
					<PasswordField
						label="CONFIRMAR NOVA SENHA"
						value={state.confirmPassword}
						onChangeText={(value) => dispatch({ field: 'confirmPassword', value })}
						autoComplete="new-password"
					/>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => setShowComingSoon(true)}
							accessibilityRole="button"
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>ALTERAR SENHA</Text>
						</Pressable>
						<Pressable
							onPress={goBack}
							accessibilityRole="button"
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>CANCELAR</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>

			<ComingSoonModal
				visible={showComingSoon}
				message="A alteração de senha ainda não está disponível no aplicativo."
				onClose={() => setShowComingSoon(false)}
			/>
		</KeyboardAvoidingView>
	)
}

export default ChangePasswordScreen
