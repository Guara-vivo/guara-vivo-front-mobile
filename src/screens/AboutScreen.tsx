import React from 'react'
import { ScrollView, Image, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>
const aboutLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function AboutScreen() {
	const navigation = useNavigation<NavigationProp>()
	return (
		<View style={appStyles.profileScreen}>
			<Header
				title="Sobre o app"
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
					
					<Text style={appStyles.aboutVersion}>Versão 1.0.0</Text>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>Sobre o projeto</Text>
						<Text style={appStyles.aboutBodyText}>
							Sistema de auxílio ao monitoramento e proteção do Guará na ARIE. O
							aplicativo facilita o registro de avistamentos, análise de
							comportamentos e geração de mapas de concentração para apoiar a
							equipe de gestão no desenvolvimento de planos de manejo
							eficientes.
						</Text>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>Funcionalidades</Text>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBulletText}>
								Registro de avistamentos com análise IA
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBulletText}>
								Mapeamento de áreas de alimentação e ninhos
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBulletText}>
								Histórico completo de registros
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBulletText}>
								Visualização de rotas de voo
							</Text>
						</View>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>Desenvolvedores</Text>
						<Text style={appStyles.aboutBodyText}>
							Desenvolvido para a ARIE - Área de Relevante Interesse Ecológico
						</Text>
					</View>

					<View style={appStyles.aboutFooterDivider} />
					<Text style={appStyles.aboutFooterText}>
						© 2026 GuaráVivo. Todos os direitos reservados.
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default AboutScreen
