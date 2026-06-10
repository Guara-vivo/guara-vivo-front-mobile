import React from 'react'
import { ScrollView, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>
const aboutLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function AboutScreen() {
	const navigation = useNavigation<NavigationProp>()
	return (
		<View style={appStyles.profileScreen}>
			<Header
				title="Sobre o App"
				leftIcon={
					<Pressable
						onPress={() => navigation.goBack()}
						hitSlop={8}
						style={appStyles.headerActionButton}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
				}
			/>


			<ScrollView
				contentContainerStyle={appStyles.profileContent}
			>

				<View style={appStyles.aboutCard}>
					<Image
						source={aboutLogo}
						style={appStyles.aboutLogo}
						resizeMode="contain"
					/>
					<Text style={appStyles.aboutAppName}>GUARAVIVO</Text>
					<Text style={appStyles.aboutVersion}>Versão 1.0.0</Text>

					<View style={appStyles.aboutSection}>
						<View style={appStyles.aboutSectionTitleRow}>
							<Ionicons
								name="information-circle-outline"
								size={16}
								color="#125ED0"
							/>
							<Text style={appStyles.aboutSectionTitle}>SOBRE O PROJETO</Text>
						</View>
						<Text style={appStyles.aboutBodyText}>
							Sistema de auxílio ao monitoramento e proteção do Guará na ARIE. O
							aplicativo facilita o registro de avistamentos, análise de
							comportamentos e geração de mapas de concentração para apoiar a
							equipe de gestão no desenvolvimento de planos de manejo
							eficientes.
						</Text>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>FUNCIONALIDADES</Text>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Registro de avistamentos com análise IA
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Mapeamento de áreas de alimentação e ninhos
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Histórico completo de registros
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Visualização de rotas de voo
							</Text>
						</View>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>DESENVOLVEDORES</Text>
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
