import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { WelcomeScreen } from '../screens/WelcomeScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterEmailScreen } from '../screens/RegisterEmailScreen'
import { RegisterPasswordScreen } from '../screens/RegisterPasswordScreen'
import type { AuthStackParamList } from '../types/navigation'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthStack() {
	return (
		<Stack.Navigator 
			screenOptions={{ 
				headerShown: false 
			}}
		>
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="RegisterEmail" component={RegisterEmailScreen} />
			<Stack.Screen name="RegisterPassword" component={RegisterPasswordScreen} />
		</Stack.Navigator>
	)
}
