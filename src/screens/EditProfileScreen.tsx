import React, { useReducer, useState } from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { colors } from '../constants/theme'
import type { UserRead } from '../types/api'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type EditProfileState = {
	name: string
	email: string
}

type EditProfileAction =
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }

function editProfileReducer(
	state: EditProfileState,
	action: EditProfileAction,
): EditProfileState {
	switch (action.type) {
		case 'SET_NAME':
			return { ...state, name: action.payload }
		case 'SET_EMAIL':
			return { ...state, email: action.payload }
		default:
			return state
	}
}

export function EditProfileScreen({ user }: { user: UserRead | null }) {
	const navigation = useNavigation<NavigationProp>()
	const [state, dispatch] = useReducer(editProfileReducer, {
		name: user?.name ?? '',
		email: user?.email ?? '',
	})

	const [showComingSoon, setShowComingSoon] = useState(false)

	return (
		<KeyboardAvoidingView
			style={appStyles.profileScreen}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
				<Header
					title="Editar Perfil"
					leftIcon={
							<HeaderBackButton onPress={() => navigation.goBack()} />
					}
				/>

			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>NOME</Text>
					<TextInput
						value={state.name}
						onChangeText={(text) =>
							dispatch({ type: 'SET_NAME', payload: text })
						}
						placeholder="Nome completo"
						accessibilityLabel="Nome"
						autoComplete="name"
						textContentType="name"
						placeholderTextColor={colors.placeholder}
						style={appStyles.changePasswordInput}
					/>

					<Text style={appStyles.changePasswordLabel}>E-MAIL</Text>
					<TextInput
						value={state.email}
						onChangeText={(text) =>
							dispatch({ type: 'SET_EMAIL', payload: text })
						}
						placeholder="E-mail"
						accessibilityLabel="E-mail"
						placeholderTextColor={colors.placeholder}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="email"
						textContentType="emailAddress"
						style={appStyles.changePasswordInput}
					/>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => setShowComingSoon(true)}
							accessibilityRole="button"
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								SALVAR
							</Text>
						</Pressable>
						<Pressable
							onPress={() => navigation.goBack()}
							accessibilityRole="button"
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								CANCELAR
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>

			<ComingSoonModal
				visible={showComingSoon}
				message="A edição de perfil ainda não está disponível no aplicativo."
				onClose={() => setShowComingSoon(false)}
			/>
		</KeyboardAvoidingView>
	)
}

export default EditProfileScreen
