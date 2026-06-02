import React from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/HomeScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { MapsScreen } from '../screens/MapsScreen'
import { HistoryScreen } from '../screens/HistoryScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import { Ionicons } from '@expo/vector-icons'
import type { MainTabParamList } from '../types/navigation'
import type { UserRead } from '../types/api'

const Tab = createBottomTabNavigator<MainTabParamList>()
type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type TabBarIconProps = { color: string; focused: boolean }
type TabIconProps = TabBarIconProps & { label: string; icon: IoniconName }

function TabIcon({ color, focused, label, icon }: TabIconProps) {
	return (
		<View
			style={[
				appStyles.bottomNavTabContent,
				focused && appStyles.bottomNavTabContentActive,
			]}
		>
			<Ionicons name={icon} size={23} color={color} />
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				minimumFontScale={0.85}
				style={[
					appStyles.bottomNavLabel,
					{ color },
					focused && appStyles.bottomNavLabelActive,
				]}
			>
				{label}
			</Text>
		</View>
	)
}

function HomeTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} label="Início" icon="home-outline" />
}

function RegisterTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} label="Registrar" icon="location-outline" />
}

function MapsTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} label="Mapas" icon="map-outline" />
}

function HistoryTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} label="Histórico" icon="list-outline" />
}

function ProfileTabIcon(props: TabBarIconProps) {
	return <TabIcon {...props} label="Perfil" icon="person-outline" />
}

type MainTabsProps = {
	currentUser: UserRead | null
	onLogoutSuccess: () => void
}

export function MainTabs({ currentUser, onLogoutSuccess }: MainTabsProps) {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: appStyles.bottomNav,
				tabBarIconStyle: appStyles.bottomNavIcon,
				tabBarShowLabel: false,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: '#8A8D95',
				tabBarItemStyle: appStyles.bottomNavItem,
			}}
		>
			<Tab.Screen 
				name="Home" 
				component={HomeScreen} 
				options={{
					tabBarIcon: HomeTabIcon,
				}}
			/>
			<Tab.Screen 
				name="Register" 
				component={RegisterScreen} 
				options={{
					tabBarIcon: RegisterTabIcon,
				}}
			/>
			<Tab.Screen 
				name="Maps" 
				component={MapsScreen} 
				options={{
					tabBarIcon: MapsTabIcon,
				}}
			/>
			<Tab.Screen 
				name="History" 
				component={HistoryScreen} 
				options={{
					tabBarIcon: HistoryTabIcon,
				}}
			/>
			<Tab.Screen 
				name="Profile" 
				options={{
					tabBarIcon: ProfileTabIcon,
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
