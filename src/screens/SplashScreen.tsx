import React, { useEffect } from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

const welcomeLogo = require('../assets/images/Logo Fonte Clara.png')

type SplashScreenProps = {
	isLoading?: boolean
	onFinish?: () => void
}

export function SplashScreen({ isLoading = false, onFinish }: SplashScreenProps) {
	useEffect(() => {
		if (!onFinish) {
			return undefined
		}

		const timer = setTimeout(onFinish, 1600)
		return () => clearTimeout(timer)
	}, [onFinish])

	return (
		<View style={[appStyles.screen, appStyles.splashScreen]}>
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<Image
					source={welcomeLogo}
					style={[appStyles.splashLogo, { alignSelf: 'center' }]}
					resizeMode="contain"
				/>
				{isLoading ? (
					<ActivityIndicator
						size="large"
						color={colors.secondary}
						style={appStyles.splashLoadingIndicator}
					/>
				) : null}
			</View>
		</View>
	)
}

export default SplashScreen
