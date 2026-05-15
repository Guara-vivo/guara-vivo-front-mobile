import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import { appStyles } from '../styles/appStyles'

const welcomeLogo = require('../assets/images/Logo Fonte Clara.png')

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
	useEffect(() => {
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
			</View>
		</View>
	)
}

export default SplashScreen
