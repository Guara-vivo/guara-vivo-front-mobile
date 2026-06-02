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
import type { UserRead } from '../types/api'

const Stack = createNativeStackNavigator<RootStackParamList>()

interface RootNavigatorProps {
	isAuthenticated: boolean
	currentUser: UserRead | null
	onAuthSuccess: (user: UserRead) => void
	onLogoutSuccess: () => void
}

export function RootNavigator({
	isAuthenticated,
	currentUser,
	onAuthSuccess,
	onLogoutSuccess,
}: RootNavigatorProps) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<>
					<Stack.Screen name="MainTabs">
						{() => (
							<MainTabs
								currentUser={currentUser}
								onLogoutSuccess={onLogoutSuccess}
							/>
						)}
					</Stack.Screen>
					<Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
					<Stack.Screen name="EditProfile" component={EditProfileScreen} />
					<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
					<Stack.Screen name="Notifications" component={NotificationsScreen} />
					<Stack.Screen name="About" component={AboutScreen} />
				</>
			) : (
				<Stack.Screen name="AuthStack">
					{() => <AuthStack onAuthSuccess={onAuthSuccess} />}
				</Stack.Screen>
			)}
		</Stack.Navigator>
	)
}
