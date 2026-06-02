import React from 'react'
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

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabs() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: appStyles.bottomNav,
				tabBarLabelStyle: appStyles.bottomNavLabel,
				tabBarIconStyle: appStyles.bottomNavIcon,
				tabBarActiveTintColor: colors.surface,
				tabBarInactiveTintColor: '#8A8D95',
				tabBarItemStyle: appStyles.bottomNavItem,
				tabBarActiveBackgroundColor: colors.secondary,
			})}
		>
			<Tab.Screen 
				name="Home" 
				component={HomeScreen} 
				options={{
					tabBarLabel: 'Início',
					tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={23} color={color} />,
				}}
			/>
			<Tab.Screen 
				name="Register" 
				component={RegisterScreen} 
				options={{
					tabBarLabel: 'Registrar',
					tabBarIcon: ({ color }) => <Ionicons name="location-outline" size={23} color={color} />,
				}}
			/>
			<Tab.Screen 
				name="Maps" 
				component={MapsScreen} 
				options={{
					tabBarLabel: 'Mapas',
					tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={23} color={color} />,
				}}
			/>
			<Tab.Screen 
				name="History" 
				component={HistoryScreen} 
				options={{
					tabBarLabel: 'Histórico',
					tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={23} color={color} />,
				}}
			/>
			<Tab.Screen 
				name="Profile" 
				component={ProfileScreen} 
				options={{
					tabBarLabel: 'Perfil',
					tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={23} color={color} />,
				}}
			/>
		</Tab.Navigator>
	)
}
