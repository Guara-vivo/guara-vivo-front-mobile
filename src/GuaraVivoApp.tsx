import React, { useEffect, useMemo, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { ErrorBoundary } from './components/ErrorBoundary'
import { colors } from './constants/theme'
import { logout, restoreSession } from './services/authService'
import { RootNavigator } from './navigation/RootNavigator'
import { appStyles } from './styles/appStyles'
import type { UserRead } from './types/api'


export default function GuaraVivoApp() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isSessionReady, setIsSessionReady] = useState(false)
	const [splashFinished, setSplashFinished] = useState(false)
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

	useEffect(() => {
		if (!splashFinished || !isSessionReady) {
			return
		}
	}, [isAuthenticated, isSessionReady, splashFinished])


	const handleNavigate = (screen: ScreenId, recordId?: number) => {
		// This function is now deprecated and will be removed after screen refactoring
	}


	const handleAuthSuccess = (user?: UserRead) => {
		setCurrentUser(user ?? null)
		setIsAuthenticated(true)
	}

	const handleLogout = async () => {
		await logout()
		setIsAuthenticated(false)
		setCurrentUser(null)
	}


	const showNavigation = useMemo(() => {
		if (!isAuthenticated) {
			return false
		}

		return true
	}, [isAuthenticated])

	const renderScreen = () => {
		return (
			<NavigationContainer>
				<RootNavigator
					isAuthenticated={isAuthenticated}
					currentUser={currentUser}
				/>
			</NavigationContainer>
		)
	}


	const statusBarColor =
		currentScreen === 'welcome' ? colors.splash : colors.background
	const safeAreaStyle = [
		appStyles.app,
		currentScreen === 'welcome' ? appStyles.appSplash : colors.background,
	]

	return (
		<ErrorBoundary>
			<SafeAreaView style={safeAreaStyle}>
				<StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
				{renderScreen()}
			</SafeAreaView>
		</ErrorBoundary>
	)
}
