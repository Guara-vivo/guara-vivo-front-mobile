import React from 'react'
import { ScrollView, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

const aboutLogo = require('../assets/images/Logo Fonte Clara.png')

export function AboutScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.aboutCard}>
					<Image
						source={aboutLogo}
						style={appStyles.aboutLogo}
						resizeMode="contain"
					/>
					<Text style={appStyles.aboutAppName}>GUARAVIVO</Text>
					<Text style={appStyles.aboutVersion}>Versao 1.0.0</Text>

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
							Sistema de auxilio ao monitoramento e protecao do Guara na ARIE. O
							aplicativo facilita o registro de avistamentos, analise de
							comportamentos e geracao de mapas de concentracao para apoiar a
							equipe de gestao no desenvolvimento de planos de manejo
							eficientes.
						</Text>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>FUNCIONALIDADES</Text>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Registro de avistamentos com analise IA
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Mapeamento de areas de alimentacao e ninhos
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Historico completo de registros
							</Text>
						</View>
						<View style={appStyles.aboutBulletRow}>
							<Text style={appStyles.aboutBulletDot}>•</Text>
							<Text style={appStyles.aboutBodyText}>
								Visualizacao de rotas de voo
							</Text>
						</View>
					</View>

					<View style={appStyles.aboutSection}>
						<Text style={appStyles.aboutSectionTitle}>DESENVOLVEDORES</Text>
						<Text style={appStyles.aboutBodyText}>
							Desenvolvido para a ARIE - Area de Relevante Interesse Ecologico
						</Text>
					</View>

					<View style={appStyles.aboutFooterDivider} />
					<Text style={appStyles.aboutFooterText}>
						© 2026 GuaraVivo. Todos os direitos reservados.
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default AboutScreen
