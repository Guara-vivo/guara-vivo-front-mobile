import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Header from '../components/Header'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function ProfileScreen({
	onNavigate,
	onLogout,
}: {
	onNavigate: (screen: ScreenId) => void
	onLogout: () => void
}) {
	return (
		<View style={appStyles.profileScreen}>
			<Header title="Meu Perfil" />
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

export default ProfileScreen
