import React, { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'
import type { UserRead } from '../types/api'
import type { MainTabParamList } from '../types/navigation'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { logout } from '../services/authService'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

export function ProfileScreen({
	user,
	onLogoutSuccess,
}: {
	user: UserRead | null
	onLogoutSuccess: () => void
}) {
	const navigation = useNavigation<NavigationProp>()
	const displayName = user?.name ?? 'Usuário Guará Vivo'
	const displayEmail = user?.email ?? 'Sessão local'
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogoutPress = async () => {
		setIsLoggingOut(true)
		try {
			await logout()
			onLogoutSuccess()
		} finally {
			setIsLoggingOut(false)
		}
	}

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

					<Text style={appStyles.profileHeroName}>{displayName}</Text>
					<Text style={appStyles.profileHeroEmail}>{displayEmail}</Text>

					<Pressable
						onPress={() => navigation.navigate('EditProfile')}
						style={appStyles.profileEditButton}
					>
						<Text style={appStyles.profileEditButtonText}>EDITAR</Text>
					</Pressable>
				</View>

				<View style={appStyles.profileMenuCard}>
					<Text style={appStyles.profileMenuTitle}>CONFIGURAÇÕES</Text>

					<Pressable
						onPress={() => navigation.navigate('ChangePassword')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons name="lock-closed-outline" size={19} color="#125ED0" />
						<Text style={appStyles.profileMenuItemText}>Alterar senha</Text>
					</Pressable>

					<Pressable
						onPress={() => navigation.navigate('Notifications')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons name="notifications-outline" size={19} color="#125ED0" />
						<Text style={appStyles.profileMenuItemText}>Notificações</Text>
					</Pressable>

					<Pressable
						onPress={() => navigation.navigate('About')}
						style={appStyles.profileMenuItem}
					>
						<Ionicons
							name="information-circle-outline"
							size={19}
							color="#125ED0"
						/>
						<Text style={appStyles.profileMenuItemText}>Sobre o app</Text>
					</Pressable>

					<Pressable
						onPress={handleLogoutPress}
						disabled={isLoggingOut}
						style={appStyles.profileMenuItem}
					>
						<Ionicons name="log-out-outline" size={19} color="#F2201F" />
						<Text style={appStyles.profileMenuItemTextLogout}>
							Sair da conta
						</Text>
					</Pressable>
				</View>
			</ScrollView>

			{isLoggingOut && (
				<View style={appStyles.logoutOverlayContainer}>
					<View style={appStyles.logoutOverlayCard}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={appStyles.logoutOverlayText}>
							Saindo da conta...
						</Text>
					</View>
				</View>
			)}
		</View>
	)
}

export default ProfileScreen
