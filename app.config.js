import { withAndroidManifest } from '@expo/config-plugins'

function withGoogleMapsApiKey(expoConfig) {
	return withAndroidManifest(expoConfig, (config) => {
		const mainApplication = config.modResults.manifest.application[0]
		// Remove a entrada anterior (ex.: o placeholder do android/ versionado) para nao duplicar.
		const others = (mainApplication['meta-data'] ?? []).filter(
			(item) => item.$['android:name'] !== 'com.google.android.geo.API_KEY',
		)
		mainApplication['meta-data'] = [
			...others,
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
		version: '0.1.1',
		orientation: 'portrait',
		userInterfaceStyle: 'light',
		splash: {
			backgroundColor: '#FFFFFF',
		},
		ios: {
			supportsTablet: true,
		},
		icon: './src/assets/images/icon.png',
		android: {
			package: 'com.guaravivo.app',
			allowBackup: false,
			// WRITE_EXTERNAL_STORAGE nao entra aqui: o expo-image-picker a exige no Android 12 ou menor
			// para liberar a galeria (no AndroidManifest ela fica limitada a maxSdkVersion 32).
			blockedPermissions: [
				'android.permission.RECORD_AUDIO',
				'android.permission.SYSTEM_ALERT_WINDOW',
				'android.permission.CAMERA',
				'android.permission.USE_BIOMETRIC',
				'android.permission.USE_FINGERPRINT',
			],
			adaptiveIcon: {
				foregroundImage: './src/assets/images/adaptive_icon.png',
				backgroundColor: '#7FA8E6',
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
					microphonePermission: false,
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
