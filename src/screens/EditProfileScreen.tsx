import React, { useReducer } from 'react'
import { ScrollView, Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

type EditProfileState = {
	name: string
	email: string
}

type EditProfileAction =
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }

function editProfileReducer(state: EditProfileState, action: EditProfileAction): EditProfileState {
	switch (action.type) {
		case 'SET_NAME':
			return { ...state, name: action.payload }
		case 'SET_EMAIL':
			return { ...state, email: action.payload }
		default:
			return state
	}
}

export function EditProfileScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [state, dispatch] = useReducer(
		editProfileReducer,
		{
			name: 'Joao da Silva Goulard',
			email: 'joaosgoulard@email.com',
		},
	)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>NOME</Text>
					<TextInput
						value={state.name}
						onChangeText={(text) => dispatch({ type: 'SET_NAME', payload: text })}
						placeholder="Nome completo"
						placeholderTextColor="#8F9098"
						style={appStyles.changePasswordInput}
					/>

					<Text style={appStyles.changePasswordLabel}>E-MAIL</Text>
					<TextInput
						value={state.email}
						onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
						placeholder="E-mail"
						placeholderTextColor="#8F9098"
						keyboardType="email-address"
						style={appStyles.changePasswordInput}
					/>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								SALVAR
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

export default EditProfileScreen
