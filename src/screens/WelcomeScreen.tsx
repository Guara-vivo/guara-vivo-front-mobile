import React from 'react'
import { Image, View } from 'react-native'
import { spacing } from '../constants/theme'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

const welcomeLogo = require('../assets/images/Logo Fonte Clara.png')

export function WelcomeScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
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
						onPress={() => onNavigate('login')}
						containerStyle={appStyles.welcomePrimaryButton}
						textStyle={appStyles.welcomePrimaryButtonLabel}
					/>
					<View style={{ height: spacing.lg }} />
					<View style={appStyles.welcomeActions}>
						<ActionButton
							title="CRIAR CONTA"
							onPress={() => onNavigate('register-email')}
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
