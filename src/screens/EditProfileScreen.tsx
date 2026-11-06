import React, { useReducer, useState } from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { Avatar } from '../components/Avatar'
import { AuthField } from '../components/auth/AuthField'
import { ActionButton } from '../components/common'
import { ComingSoonModal } from '../components/ComingSoonModal'
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
				title="Editar perfil"
				leftIcon={<HeaderBackButton onPress={() => navigation.goBack()} />}
			/>

			<ScrollView
				contentContainerStyle={appStyles.settingsContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.settingsAvatarWrap}>
					<Avatar name={state.name} size={88} />
				</View>

				<View style={appStyles.changePasswordCard}>
					<AuthField
						label="Nome"
						value={state.name}
						onChangeText={(text) => dispatch({ type: 'SET_NAME', payload: text })}
						autoComplete="name"
						textContentType="name"
					/>
					<AuthField
						label="E-mail"
						value={state.email}
						onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="email"
						textContentType="emailAddress"
					/>
				</View>
			</ScrollView>

			<View style={appStyles.settingsFooter}>
				<ActionButton title="Salvar" onPress={() => setShowComingSoon(true)} />
				<Pressable
					onPress={() => navigation.goBack()}
					accessibilityRole="button"
					accessibilityLabel="Cancelar"
					style={appStyles.settingsCancelButton}
				>
					<Text style={appStyles.settingsCancelText}>Cancelar</Text>
				</Pressable>
			</View>

			<ComingSoonModal
				visible={showComingSoon}
				message="A edição de perfil ainda não está disponível no aplicativo."
				onClose={() => setShowComingSoon(false)}
			/>
		</KeyboardAvoidingView>
	)
}

export default EditProfileScreen
