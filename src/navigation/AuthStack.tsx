import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { WelcomeScreen } from '../screens/WelcomeScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterEmailScreen } from '../screens/RegisterEmailScreen'
import { RegisterPasswordScreen } from '../screens/RegisterPasswordScreen'
import type { AuthStackParamList } from '../types/navigation'
import type { UserRead } from '../types/api'

const Stack = createNativeStackNavigator<AuthStackParamList>()

type AuthStackProps = {
	onAuthSuccess: (user: UserRead) => void
}

export function AuthStack({ onAuthSuccess }: AuthStackProps) {
	return (
		<Stack.Navigator 
			screenOptions={{ 
				headerShown: false 
			}}
		>
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Login">
				{() => <LoginScreen onSuccess={onAuthSuccess} />}
			</Stack.Screen>
			<Stack.Screen name="RegisterEmail" component={RegisterEmailScreen} />
			<Stack.Screen name="RegisterPassword">
				{() => <RegisterPasswordScreen onSuccess={() => {}} />}
			</Stack.Screen>
		</Stack.Navigator>
	)
}
