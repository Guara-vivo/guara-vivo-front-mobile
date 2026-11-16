import React from 'react'
import { ScrollView, Image, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { formatAppVersion } from '../utils/appVersion'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>
const aboutLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function AboutScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation('profile')
	const features = t('about.features', { returnObjects: true }) as string[]

	return (
		<View style={appStyles.profileScreen}>
			<Header
				title={t('about.title')}
				leftIcon={
					<HeaderBackButton onPress={() => navigation.goBack()} />
				}
			/>


			<ScrollView
				contentContainerStyle={appStyles.settingsContent}
			>

				<View style={appStyles.aboutCard}>
					<Image
						source={aboutLogo}
						style={appStyles.aboutLogo}
						resizeMode="contain"
					/>

					<Text style={appStyles.aboutVersion}>{formatAppVersion()}</Text>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>{t('about.projectTitle')}</Text>
						<Text style={appStyles.aboutBodyText}>{t('about.projectText')}</Text>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>{t('about.featuresTitle')}</Text>
						{features.map((feature) => (
							<View key={feature} style={appStyles.aboutBulletRow}>
								<Text style={appStyles.aboutBulletDot}>•</Text>
								<Text style={appStyles.aboutBulletText}>{feature}</Text>
							</View>
						))}
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>{t('about.developersTitle')}</Text>
						<Text style={appStyles.aboutBodyText}>{t('about.developersText')}</Text>
					</View>

					<View style={appStyles.aboutFooterDivider} />
					<Text style={appStyles.aboutFooterText}>{t('about.footer')}</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default AboutScreen
