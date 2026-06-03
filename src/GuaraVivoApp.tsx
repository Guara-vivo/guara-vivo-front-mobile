import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalProvider } from '@gorhom/portal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'

import { ErrorBoundary } from './components/ErrorBoundary'
import { colors } from './constants/theme'
import { restoreSession } from './services/authService'
import { RootNavigator } from './navigation/RootNavigator'
import { SplashScreen } from './screens/SplashScreen'
import { appStyles } from './styles/appStyles'
import type { UserRead } from './types/api'


export default function GuaraVivoApp() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isSessionReady, setIsSessionReady] = useState(false)
	const [currentUser, setCurrentUser] = useState<UserRead | null>(null)


	useEffect(() => {
		let mounted = true

		restoreSession()
			.then((user) => {
				if (!mounted) {
					return
				}

				setCurrentUser(user)
				setIsAuthenticated(Boolean(user))
			})
			.finally(() => {
				if (mounted) {
					setIsSessionReady(true)
				}
			})

		return () => {
			mounted = false
		}
	}, [])

	const handleAuthSuccess = (user: UserRead) => {
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const handleLogoutSuccess = () => {
		setCurrentUser(null)
		setIsAuthenticated(false)
	}

	const renderScreen = () => {
		if (!isSessionReady) {
			return <SplashScreen isLoading />
		}

		return (
			<NavigationContainer>
				<RootNavigator
					isAuthenticated={isAuthenticated}
					currentUser={currentUser}
					onAuthSuccess={handleAuthSuccess}
					onLogoutSuccess={handleLogoutSuccess}
				/>
			</NavigationContainer>
		)
	}


	const statusBarColor = colors.background
	const safeAreaStyle = [
		appStyles.app,
		colors.background,
	]

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<PortalProvider>
					<BottomSheetModalProvider>
						<ErrorBoundary>
							<SafeAreaView style={safeAreaStyle}>
								<StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
								{renderScreen()}
							</SafeAreaView>
						</ErrorBoundary>
					</BottomSheetModalProvider>
				</PortalProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)

}
