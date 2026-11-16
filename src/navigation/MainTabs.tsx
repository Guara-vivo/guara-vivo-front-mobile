import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/HomeScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { MapsScreen } from '../screens/MapsScreen'
import { HistoryScreen } from '../screens/HistoryScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { MainTabParamList } from '../types/navigation'
import type { UserRead } from '../types/api'

const Tab = createBottomTabNavigator<MainTabParamList>()
const BASE_TAB_BAR_HEIGHT = 72
type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type TabBarIconProps = { color: string; focused: boolean }
type TabIconProps = TabBarIconProps & {
	labelKey: string
	icon: IoniconName
	focusedIcon: IoniconName
}

function TabIcon({ color, focused, labelKey, icon, focusedIcon }: TabIconProps) {
	const { t } = useTranslation('nav')

	return (
		<View style={appStyles.bottomNavTabContent}>
			<View style={[appStyles.bottomNavPill, focused && appStyles.bottomNavPillActive]}>
				<Ionicons name={focused ? focusedIcon : icon} size={23} color={color} />
			</View>
			<Text
				numberOfLines={1}
				allowFontScaling={false}
				style={[appStyles.bottomNavLabel, { color }, focused && appStyles.bottomNavLabelActive]}
			>
				{t(labelKey)}
			</Text>
		</View>
	)
}

// Botão central de Registrar: a ação mais usada do app, sempre em vermelho e dentro da barra
// (fora dela o Android não entrega o toque).
function RegisterTab() {
	const { t } = useTranslation('nav')

	return (
		<View style={appStyles.bottomNavTabContent}>
			<View style={appStyles.bottomNavRegisterButton}>
				<Ionicons name="add" size={28} color={colors.onColor} />
			</View>
			<Text
				numberOfLines={1}
				allowFontScaling={false}
				style={[appStyles.bottomNavLabel, appStyles.bottomNavLabelRegister]}
			>
				{t('register')}
			</Text>
		</View>
	)
}

// O navegador chama `tabBarIcon` como função comum, então o texto (que usa hook) fica num componente.
function RegisterTabIcon() {
	return <RegisterTab />
}

function HomeTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} labelKey="home" icon="home-outline" focusedIcon="home" />
}

function MapsTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} labelKey="maps" icon="map-outline" focusedIcon="map" />
}

function HistoryTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} labelKey="history" icon="list" focusedIcon="list" />
}

function ProfileTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} labelKey="profile" icon="person-outline" focusedIcon="person" />
}

type MainTabsProps = {
	currentUser: UserRead | null
	onLogoutSuccess: () => void
}

export function MainTabs({ currentUser, onLogoutSuccess }: MainTabsProps) {
	const { t } = useTranslation('nav')
	// Soma o inset do sistema (gestos/botões) à altura da barra, para o branco ir até o fim da tela.
	const { bottom: bottomInset } = useSafeAreaInsets()
	const tabBarStyle = useMemo(
		() => [
			appStyles.bottomNav,
			{ height: BASE_TAB_BAR_HEIGHT + bottomInset, paddingBottom: bottomInset },
		],
		[bottomInset],
	)

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle,
				tabBarIconStyle: appStyles.bottomNavIcon,
				tabBarShowLabel: false,
				tabBarActiveTintColor: colors.secondary,
				tabBarInactiveTintColor: colors.muted,
				tabBarItemStyle: appStyles.bottomNavItem,
			}}
		>
			<Tab.Screen
				name="Home"
				options={{
					tabBarIcon: HomeTabIcon,
					tabBarAccessibilityLabel: t('home'),
				}}
			>
				{() => <HomeScreen userName={currentUser?.name} />}
			</Tab.Screen>
			<Tab.Screen 
				name="Maps" 
				component={MapsScreen} 
				options={{
					tabBarIcon: MapsTabIcon,
					tabBarAccessibilityLabel: t('maps'),
				}}
			/>
			<Tab.Screen 
				name="Register" 
				component={RegisterScreen} 
				options={{
					tabBarIcon: RegisterTabIcon,
					tabBarAccessibilityLabel: t('register'),
					// O registro em passos ocupa a tela toda: a barra volta ao sair dele.
					tabBarStyle: [tabBarStyle, { display: 'none' }],
				}}
			/>
			<Tab.Screen 
				name="History" 
				component={HistoryScreen} 
				options={{
					tabBarIcon: HistoryTabIcon,
					tabBarAccessibilityLabel: t('history'),
				}}
			/>
			<Tab.Screen 
				name="Profile" 
				options={{
					tabBarIcon: ProfileTabIcon,
					tabBarAccessibilityLabel: t('profile'),
				}}
			>
				{() => (
					<ProfileScreen
						user={currentUser}
						onLogoutSuccess={onLogoutSuccess}
					/>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	)
}
