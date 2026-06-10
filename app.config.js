import { withAndroidManifest } from '@expo/config-plugins'

function withGoogleMapsApiKey(expoConfig) {
	return withAndroidManifest(expoConfig, (config) => {
		const mainApplication = config.modResults.manifest.application[0]
		mainApplication['meta-data'] = [
			...(mainApplication['meta-data'] ?? []),
			{
				$: {
					'android:name': 'com.google.android.geo.API_KEY',
					'android:value': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
				},
			},
		]
		return config
	})
}

export default {
	expo: {
		name: 'GuaráVivo',
		slug: 'guaravivo',
		version: '0.1.0',
		orientation: 'portrait',
		userInterfaceStyle: 'light',
		splash: {
			backgroundColor: '#E8F1FC',
		},
		ios: {
			supportsTablet: true,
		},
		icon: './src/assets/images/icon.png',
		android: {
			package: 'com.guaravivo.app',
			adaptiveIcon: {
				foregroundImage: './src/assets/images/adaptive_icon.png',
				backgroundColor: '#F1F1F1',
			},
			softwareKeyboardLayoutMode: 'pan',
		},
		plugins: [
			'expo-font',
			[
				'expo-location',
				{
					locationWhenInUsePermission:
						'O app precisa da sua localização para centralizar o mapa na posição atual do aparelho.',
				},
			],
			[
				'expo-image-picker',
				{
					photosPermission:
						'O app precisa acessar suas fotos para anexar imagens ao registro.',
				},
			],
			'@react-native-community/datetimepicker',
			'expo-secure-store',
			withGoogleMapsApiKey,
		],
	},
}
