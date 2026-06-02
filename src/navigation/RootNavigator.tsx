import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStack } from './AuthStack'
import { MainTabs } from './MainTabs'
import { RecordDetailScreen } from '../screens/RecordDetailScreen'
import { EditProfileScreen } from '../screens/EditProfileScreen'
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen'
import { NotificationsScreen } from '../screens/NotificationsScreen'
import { AboutScreen } from '../screens/AboutScreen'
import type { RootStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

interface RootNavigatorProps {
	isAuthenticated: boolean
	currentUser: any
}

export function RootNavigator({ isAuthenticated, currentUser }: RootNavigatorProps) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<>
					<Stack.Screen name="MainTabs" component={MainTabs} />
					<Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
					<Stack.Screen name="EditProfile" component={EditProfileScreen} />
					<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
					<Stack.Screen name="Notifications" component={NotificationsScreen} />
					<Stack.Screen name="About" component={AboutScreen} />
				</>
			) : (
				<Stack.Screen name="AuthStack" component={AuthStack} />
			)}
		</Stack.Navigator>
	)
}
