import React, { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from '../components/Avatar'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'
import type { UserRead } from '../types/api'
import type { MainTabNavigationProp, RootStackParamList } from '../types/navigation'
import { logout } from '../services/authService'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type MenuRoute = Extract<keyof RootStackParamList, 'ChangePassword' | 'Notifications' | 'About'>

const ACCOUNT_ITEMS: { route: MenuRoute; label: string; icon: IoniconName }[] = [
	{ route: 'ChangePassword', label: 'Alterar senha', icon: 'lock-closed-outline' },
	{ route: 'Notifications', label: 'Notificações', icon: 'notifications-outline' },
]

const ABOUT_ITEMS: { route: MenuRoute; label: string; icon: IoniconName }[] = [
	{ route: 'About', label: 'Sobre o app', icon: 'information-circle-outline' },
]

export function ProfileScreen({
	user,
	onLogoutSuccess,
}: {
	user: UserRead | null
	onLogoutSuccess: () => void
}) {
	const navigation = useNavigation<MainTabNavigationProp>()
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

	const renderGroup = (items: typeof ACCOUNT_ITEMS) => (
		<View style={appStyles.profileGroupCard}>
			{items.map((item, index) => (
				<Pressable
					key={item.route}
					onPress={() => navigation.navigate(item.route)}
					accessibilityRole="button"
					accessibilityLabel={item.label}
					style={[appStyles.profileMenuItem, index > 0 && appStyles.profileMenuItemDivider]}
				>
					<View style={appStyles.profileMenuIcon}>
						<Ionicons name={item.icon} size={20} color={colors.secondary} />
					</View>
					<Text style={appStyles.profileMenuItemText}>{item.label}</Text>
					<Ionicons name="chevron-forward" size={18} color={colors.muted} />
				</Pressable>
			))}
		</View>
	)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView contentContainerStyle={appStyles.profileContent}>
				<Text style={appStyles.profileTitle} accessibilityRole="header">
					Perfil
				</Text>

				<View style={appStyles.profileUserCard}>
					<Avatar name={displayName} size={64} />
					<View style={appStyles.profileUserInfo}>
						<Text style={appStyles.profileHeroName} numberOfLines={1}>
							{displayName}
						</Text>
						<Text style={appStyles.profileHeroEmail} numberOfLines={1}>
							{displayEmail}
						</Text>
					</View>
					<Pressable
						onPress={() => navigation.navigate('EditProfile')}
						hitSlop={6}
						accessibilityRole="button"
						accessibilityLabel="Editar perfil"
						style={appStyles.profileEditButton}
					>
						<Text style={appStyles.profileEditButtonText}>Editar</Text>
					</Pressable>
				</View>

				<Text style={appStyles.profileGroupTitle}>Conta</Text>
				{renderGroup(ACCOUNT_ITEMS)}

				<Text style={appStyles.profileGroupTitle}>Sobre</Text>
				{renderGroup(ABOUT_ITEMS)}

				<Pressable
					onPress={handleLogoutPress}
					accessibilityRole="button"
					accessibilityLabel="Sair da conta"
					accessibilityState={{ disabled: isLoggingOut }}
					disabled={isLoggingOut}
					style={appStyles.profileLogoutButton}
				>
					<Ionicons name="log-out-outline" size={20} color={colors.dangerText} />
					<Text style={appStyles.profileMenuItemTextLogout}>Sair da conta</Text>
				</Pressable>
			</ScrollView>

			{isLoggingOut && (
				<View style={appStyles.logoutOverlayContainer}>
					<View style={appStyles.logoutOverlayCard}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={appStyles.logoutOverlayText}>Saindo da conta...</Text>
					</View>
				</View>
			)}
		</View>
	)
}

export default ProfileScreen
