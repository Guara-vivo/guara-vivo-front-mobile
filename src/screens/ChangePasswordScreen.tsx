import React, { useReducer } from 'react'
import {
	Alert,
	ScrollView,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import { usePasswordValidation } from '../hooks/usePasswordValidation'

import type { ScreenId } from '../types/navigation'
import { Header } from '../components/Header'

type ChangePasswordState = {
	currentPassword: string
	newPassword: string
	confirmPassword: string
	showCurrentPassword: boolean
	showNewPassword: boolean
	showConfirmPassword: boolean
}

type ChangePasswordAction =
	| { type: 'SET_CURRENT_PASSWORD'; payload: string }
	| { type: 'SET_NEW_PASSWORD'; payload: string }
	| { type: 'SET_CONFIRM_PASSWORD'; payload: string }
	| { type: 'TOGGLE_SHOW_CURRENT_PASSWORD' }
	| { type: 'TOGGLE_SHOW_NEW_PASSWORD' }
	| { type: 'TOGGLE_SHOW_CONFIRM_PASSWORD' }

function changePasswordReducer(
	state: ChangePasswordState,
	action: ChangePasswordAction,
): ChangePasswordState {
	switch (action.type) {
		case 'SET_CURRENT_PASSWORD':
			return { ...state, currentPassword: action.payload }
		case 'SET_NEW_PASSWORD':
			return { ...state, newPassword: action.payload }
		case 'SET_CONFIRM_PASSWORD':
			return { ...state, confirmPassword: action.payload }
		case 'TOGGLE_SHOW_CURRENT_PASSWORD':
			return { ...state, showCurrentPassword: !state.showCurrentPassword }
		case 'TOGGLE_SHOW_NEW_PASSWORD':
			return { ...state, showNewPassword: !state.showNewPassword }
		case 'TOGGLE_SHOW_CONFIRM_PASSWORD':
			return { ...state, showConfirmPassword: !state.showConfirmPassword }
		default:
			return state
	}
}

export function ChangePasswordScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [state, dispatch] = useReducer(
		changePasswordReducer,
		{
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
			showCurrentPassword: false,
			showNewPassword: false,
			showConfirmPassword: false,
		},
	)

	const { message: passwordHint } = usePasswordValidation()

	return (
    <View style={appStyles.profileScreen}>
      
      <Header
              title="Editar Senha"
              leftIcon={
                <Pressable
                  onPress={() => onNavigate('profile')}
                  hitSlop={8}
                  style={appStyles.headerActionButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </Pressable>
              }
            />
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
			>

				<View style={appStyles.changePasswordCard}>
					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>SENHA ATUAL</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={state.currentPassword}
								onChangeText={(text) => dispatch({ type: 'SET_CURRENT_PASSWORD', payload: text })}
								secureTextEntry={!state.showCurrentPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => dispatch({ type: 'TOGGLE_SHOW_CURRENT_PASSWORD' })}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={state.showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
					</View>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>NOVA SENHA</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={state.newPassword}
								onChangeText={(text) => dispatch({ type: 'SET_NEW_PASSWORD', payload: text })}
								secureTextEntry={!state.showNewPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => dispatch({ type: 'TOGGLE_SHOW_NEW_PASSWORD' })}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={state.showNewPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
						<Text style={appStyles.changePasswordHint}>{passwordHint}</Text>
					</View>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>
								CONFIRMAR NOVA SENHA
							</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={state.confirmPassword}
								onChangeText={(text) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: text })}
								secureTextEntry={!state.showConfirmPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => dispatch({ type: 'TOGGLE_SHOW_CONFIRM_PASSWORD' })}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={state.showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
					</View>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => {
								Alert.alert(
									'Senha atualizada',
									'Sua senha foi alterada com sucesso.',
								)
								onNavigate('profile')
							}}
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								ALTERAR SENHA
							</Text>
						</Pressable>

						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								CANCELAR
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default ChangePasswordScreen
