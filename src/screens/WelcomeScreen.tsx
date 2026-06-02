import React from 'react'
import { Image, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../constants/theme'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

const welcomeLogo = require('../assets/images/Logo Fonte Clara.png')

export function WelcomeScreen() {
	const navigation = useNavigation<NavigationProp>()

	return (
		<View style={appStyles.welcomeScreen}>
			<View style={appStyles.welcomeContent}>
				<Image
					source={welcomeLogo}
					style={appStyles.welcomeLogo}
					resizeMode="contain"
				/>

				<View style={appStyles.welcomeActions}>
					<ActionButton
						title="Acessar minha conta"
						onPress={() => navigation.navigate('Login')}
						containerStyle={appStyles.welcomePrimaryButton}
						textStyle={appStyles.welcomePrimaryButtonLabel}
					/>
					<View style={{ height: spacing.lg }} />
					<View style={appStyles.welcomeActions}>
						<ActionButton
							title="CRIAR CONTA"
							onPress={() => navigation.navigate('RegisterEmail')}
							containerStyle={appStyles.welcomeTextButton}
							textStyle={appStyles.welcomeTextButtonLabel}
						/>
					</View>
				</View>
			</View>
		</View>
	)
}

export default WelcomeScreen
