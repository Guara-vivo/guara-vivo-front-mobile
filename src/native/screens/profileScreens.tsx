import React, { useState } from 'react'
import {
	Alert,
	Image,
	Pressable,
	ScrollView,
	Switch,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

const aboutLogo = require('../assets/images/Logo Fonte Clara.png')

export function ProfileScreen({
	onNavigate,
	onLogout,
}: {
	onNavigate: (screen: ScreenId) => void
	onLogout: () => void
}) {
	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>

				<View style={appStyles.profileHeroCard}>
					<View style={appStyles.profileAvatarCircle}>
						<Ionicons name="person-outline" size={58} color="#1F61C5" />
					</View>

					<Text style={appStyles.profileHeroName}>Joao da Silva Goulard</Text>
					<Text style={appStyles.profileHeroEmail}>joaosgoulard@email.com</Text>

					<Pressable
						onPress={() => onNavigate('edit-profile')}
						style={appStyles.profileEditButton}
					>
						<Text style={appStyles.profileEditButtonText}>EDITAR</Text>
					</Pressable>
				</View>

				<View style={appStyles.profileMenuCard}>
					<Text style={appStyles.profileMenuTitle}>CONFIGURACOES</Text>

					<Pressable
						onPress={() => onNavigate('change-password')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons name="lock-closed-outline" size={19} color="#125ED0" />
						<Text style={appStyles.profileMenuItemText}>Alterar senha</Text>
					</Pressable>

					<Pressable
						onPress={() => onNavigate('notifications')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons name="notifications-outline" size={19} color="#125ED0" />
						<Text style={appStyles.profileMenuItemText}>Notificacoes</Text>
					</Pressable>

					<Pressable
						onPress={() => onNavigate('about')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons
							name="information-circle-outline"
							size={19}
							color="#125ED0"
						/>
						<Text style={appStyles.profileMenuItemText}>Sobre o app</Text>
					</Pressable>

					<Pressable onPress={onLogout} style={appStyles.profileMenuItem}>
						<Ionicons name="log-out-outline" size={19} color="#F2201F" />
						<Text style={appStyles.profileMenuItemTextLogout}>
							Sair da conta
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	)
}

export function EditProfileScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [name, setName] = useState('Joao da Silva Goulard')
	const [email, setEmail] = useState('joaosgoulard@email.com')

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>NOME</Text>
					<TextInput
						value={name}
						onChangeText={setName}
						placeholder="Nome completo"
						placeholderTextColor="#8F9098"
						style={appStyles.changePasswordInput}
					/>

					<Text style={appStyles.changePasswordLabel}>E-MAIL</Text>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="E-mail"
						placeholderTextColor="#8F9098"
						keyboardType="email-address"
						style={appStyles.changePasswordInput}
					/>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								SALVAR
							</Text>
						</Pressable>

						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								CANCELAR
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export function ChangePasswordScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.changePasswordCard}>
					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>SENHA ATUAL</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={currentPassword}
								onChangeText={setCurrentPassword}
								secureTextEntry={!showCurrentPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowCurrentPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
					</View>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>NOVA SENHA</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={newPassword}
								onChangeText={setNewPassword}
								secureTextEntry={!showNewPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowNewPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
						<Text style={appStyles.changePasswordHint}>
							Minimo de 8 caracteres
						</Text>
					</View>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>
								CONFIRMAR NOVA SENHA
							</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showConfirmPassword}
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowConfirmPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
					</View>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => {
								Alert.alert(
									'Senha atualizada',
									'Sua senha foi alterada com sucesso.',
								)
								onNavigate('profile')
							}}
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								ALTERAR SENHA
							</Text>
						</Pressable>

						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								CANCELAR
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export function NotificationsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [newRecords, setNewRecords] = useState(true)
	const [mapUpdates, setMapUpdates] = useState(false)
	const [monthlyReport, setMonthlyReport] = useState(true)
	const [systemAlerts, setSystemAlerts] = useState(true)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.notificationsCard}>
					<View style={appStyles.notificationsTitleRow}>
						<Ionicons name="notifications-outline" size={17} color="#125ED0" />
						<Text style={appStyles.notificationsTitle}>
							PREFERENCIAS DE NOTIFICACAO
						</Text>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Novos Registros
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Receba notificacoes sobre novos avistamentos
							</Text>
						</View>
						<Switch
							value={newRecords}
							onValueChange={setNewRecords}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Atualizacoes de Mapas
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Notifique quando houver mudancas nos mapas de calor
							</Text>
						</View>
						<Switch
							value={mapUpdates}
							onValueChange={setMapUpdates}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Relatorio Mensal
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Resumo mensal de atividades e estatisticas
							</Text>
						</View>
						<Switch
							value={monthlyReport}
							onValueChange={setMonthlyReport}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Alertas do Sistema
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Avisos importantes e atualizacoes do aplicativo
							</Text>
						</View>
						<Switch
							value={systemAlerts}
							onValueChange={setSystemAlerts}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export function AboutScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
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
