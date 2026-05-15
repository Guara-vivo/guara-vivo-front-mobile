import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function ProfileMenu({
	onNavigate,
	onLogout,
}: {
	onNavigate: (s: ScreenId) => void
	onLogout: () => void
}) {
	return (
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
				<Ionicons name="information-circle-outline" size={19} color="#125ED0" />
				<Text style={appStyles.profileMenuItemText}>Sobre o app</Text>
			</Pressable>

			<Pressable onPress={onLogout} style={appStyles.profileMenuItem}>
				<Ionicons name="log-out-outline" size={19} color="#F2201F" />
				<Text style={appStyles.profileMenuItemTextLogout}>Sair da conta</Text>
			</Pressable>
		</View>
	)
}

export default ProfileMenu
