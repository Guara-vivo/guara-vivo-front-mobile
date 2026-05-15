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
import { appStyles } from '../styles/appStyles'
import { usePasswordValidation } from '../hooks/usePasswordValidation'

import type { ScreenId } from '../types/navigation'

export function ChangePasswordScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const { message: passwordHint } = usePasswordValidation()

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.changePasswordCard}>
					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>SENHA ATUAL</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={currentPassword}
								onChangeText={setCurrentPassword}
								secureTextEntry={!showCurrentPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowCurrentPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
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
								value={newPassword}
								onChangeText={setNewPassword}
								secureTextEntry={!showNewPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowNewPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
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
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showConfirmPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowConfirmPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
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
