import React, { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../components/Avatar'
import { Flag } from '../components/language/Flag'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'
import { currentLanguage, otherLanguage } from '../i18n'
import { setLanguage } from '../i18n/storage'
import type { UserRead } from '../types/api'
import type { MainTabNavigationProp, RootStackParamList } from '../types/navigation'
import { logout } from '../services/authService'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type MenuRoute = Extract<keyof RootStackParamList, 'ChangePassword' | 'Notifications' | 'About'>
type MenuItem = { route: MenuRoute; labelKey: string; icon: IoniconName }

const ACCOUNT_ITEMS: MenuItem[] = [
	{ route: 'ChangePassword', labelKey: 'changePassword', icon: 'lock-closed-outline' },
	{ route: 'Notifications', labelKey: 'notifications', icon: 'notifications-outline' },
]

const ABOUT_ITEMS: MenuItem[] = [
	{ route: 'About', labelKey: 'aboutApp', icon: 'information-circle-outline' },
]

export function ProfileScreen({
	user,
	onLogoutSuccess,
}: {
	user: UserRead | null
	onLogoutSuccess: () => void
}) {
	const navigation = useNavigation<MainTabNavigationProp>()
	const { t } = useTranslation(['profile', 'common'])
	const displayName = user?.name ?? t('profile:defaultName')
	const displayEmail = user?.email ?? t('profile:localSession')
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const language = currentLanguage()
	const nextLanguage = otherLanguage(language)

	const handleLogoutPress = async () => {
		setIsLoggingOut(true)
		try {
			await logout()
			onLogoutSuccess()
		} finally {
			setIsLoggingOut(false)
		}
	}

	const renderGroup = (items: MenuItem[], withLanguage = false) => (
		<View style={appStyles.profileGroupCard}>
			{items.map((item, index) => (
				<Pressable
					key={item.route}
					onPress={() => navigation.navigate(item.route)}
					accessibilityRole="button"
					accessibilityLabel={t(`profile:${item.labelKey}`)}
					style={[appStyles.profileMenuItem, index > 0 && appStyles.profileMenuItemDivider]}
				>
					<View style={appStyles.profileMenuIcon}>
						<Ionicons name={item.icon} size={20} color={colors.secondary} />
					</View>
					<Text style={appStyles.profileMenuItemText}>{t(`profile:${item.labelKey}`)}</Text>
					<Ionicons name="chevron-forward" size={18} color={colors.muted} />
				</Pressable>
			))}
			{withLanguage ? (
				// O toque troca para o outro idioma; a linha mostra o idioma atual.
				<Pressable
					onPress={() => void setLanguage(nextLanguage)}
					accessibilityRole="button"
					accessibilityLabel={`${t('common:language.title')}: ${t(`common:language.native.${language}`)}. ${t('common:language.switchTo', { language: t(`common:language.names.${nextLanguage}`) })}`}
					style={[appStyles.profileMenuItem, appStyles.profileMenuItemDivider]}
				>
					<View style={appStyles.profileMenuIcon}>
						<Ionicons name="language-outline" size={20} color={colors.secondary} />
					</View>
					<Text style={appStyles.profileMenuItemText}>{t('common:language.title')}</Text>
					<View style={appStyles.profileLanguageValue}>
						<Flag language={language} />
						<Text style={appStyles.profileLanguageName}>
							{t(`common:language.native.${language}`)}
						</Text>
					</View>
				</Pressable>
			) : null}
		</View>
	)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView contentContainerStyle={appStyles.profileContent}>
				<Text style={appStyles.profileTitle} accessibilityRole="header">
					{t('profile:title')}
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
						accessibilityLabel={t('profile:editA11y')}
						style={appStyles.profileEditButton}
					>
						<Text style={appStyles.profileEditButtonText}>{t('profile:edit')}</Text>
					</Pressable>
				</View>

				<Text style={appStyles.profileGroupTitle}>{t('profile:groupAccount')}</Text>
				{renderGroup(ACCOUNT_ITEMS, true)}

				<Text style={appStyles.profileGroupTitle}>{t('profile:groupAbout')}</Text>
				{renderGroup(ABOUT_ITEMS)}

				<Pressable
					onPress={handleLogoutPress}
					accessibilityRole="button"
					accessibilityLabel={t('profile:logout')}
					accessibilityState={{ disabled: isLoggingOut }}
					disabled={isLoggingOut}
					style={appStyles.profileLogoutButton}
				>
					<Ionicons name="log-out-outline" size={20} color={colors.dangerText} />
					<Text style={appStyles.profileMenuItemTextLogout}>{t('profile:logout')}</Text>
				</Pressable>
			</ScrollView>

			{isLoggingOut && (
				<View style={appStyles.logoutOverlayContainer}>
					<View style={appStyles.logoutOverlayCard}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={appStyles.logoutOverlayText}>{t('profile:loggingOut')}</Text>
					</View>
				</View>
			)}
		</View>
	)
}

export default ProfileScreen
