import React, { useCallback, useReducer, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { PasswordRules } from '../components/PasswordRules'
import { AuthField } from '../components/auth/AuthField'
import { ActionButton } from '../components/common'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { getPasswordRuleStatus } from '../utils/passwordRules'

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
	const status = getPasswordRuleStatus(state.newPassword, state.confirmPassword)

	const goBack = useCallback(() => navigation.goBack(), [navigation])

	return (
		<KeyboardAvoidingView
			style={appStyles.profileScreen}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<Header title="Alterar senha" leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView
				contentContainerStyle={appStyles.settingsContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.changePasswordCard}>
					<AuthField
						label="Senha atual"
						secure
						value={state.currentPassword}
						onChangeText={(value) => dispatch({ field: 'currentPassword', value })}
						autoComplete="current-password"
					/>
					<AuthField
						label="Nova senha"
						secure
						value={state.newPassword}
						onChangeText={(value) => dispatch({ field: 'newPassword', value })}
						autoComplete="new-password"
						hasError={!status.withinByteLimit}
					/>
					<AuthField
						label="Confirmar nova senha"
						secure
						value={state.confirmPassword}
						onChangeText={(value) => dispatch({ field: 'confirmPassword', value })}
						autoComplete="new-password"
					/>
					<PasswordRules status={status} />
				</View>
			</ScrollView>

			<View style={appStyles.settingsFooter}>
				<ActionButton title="Alterar senha" onPress={() => setShowComingSoon(true)} />
				<Pressable
					onPress={goBack}
					accessibilityRole="button"
					accessibilityLabel="Cancelar"
					style={appStyles.settingsCancelButton}
				>
					<Text style={appStyles.settingsCancelText}>Cancelar</Text>
				</Pressable>
			</View>

			<ComingSoonModal
				visible={showComingSoon}
				message="A alteração de senha ainda não está disponível no aplicativo."
				onClose={() => setShowComingSoon(false)}
			/>
		</KeyboardAvoidingView>
	)
}

export default ChangePasswordScreen
