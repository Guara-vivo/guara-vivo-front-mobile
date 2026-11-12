import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RegistrationClosedModal } from '../components/auth/RegistrationClosedModal'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

// Versão da logo com texto escuro, própria para fundo branco.
const welcomeLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function WelcomeScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [showRegistrationClosed, setShowRegistrationClosed] = useState(false)

	return (
		<View style={appStyles.welcomeScreen}>
			<View style={appStyles.welcomeBody}>
				<Image
					source={welcomeLogo}
					accessibilityLabel="Guará Vivo"
					style={appStyles.welcomeLogo}
					resizeMode="contain"
				/>
				<Text style={appStyles.welcomeTagline}>
					Monitoramento e proteção do guará na ARIE
				</Text>
			</View>

			<View style={appStyles.welcomeActions}>
				<ActionButton
					title="Entrar na minha conta"
					onPress={() => navigation.navigate('Login')}
				/>
				<ActionButton
					title="Criar conta"
					variant="secondary"
					onPress={() => setShowRegistrationClosed(true)}
				/>
			</View>

			<RegistrationClosedModal
				visible={showRegistrationClosed}
				onClose={() => setShowRegistrationClosed(false)}
			/>
		</View>
	)
}

export default WelcomeScreen
