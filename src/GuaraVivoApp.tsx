import React, { useEffect, useMemo, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomNavigation } from './components/common'
import { ErrorBoundary } from './components/ErrorBoundary'
import { colors } from './constants/theme'
import { LoginScreen } from './screens/LoginScreen'
import { RegisterEmailScreen } from './screens/RegisterEmailScreen'
import { RegisterPasswordScreen } from './screens/RegisterPasswordScreen'
import { SplashScreen } from './screens/SplashScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { HomeScreen } from './screens/HomeScreen'
import { MapsScreen } from './screens/MapsScreen'
import { RecordDetailScreen } from './screens/RecordDetailScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { AboutScreen } from './screens/AboutScreen'
import { ChangePasswordScreen } from './screens/ChangePasswordScreen'
import { EditProfileScreen } from './screens/EditProfileScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { logout, restoreSession } from './services/authService'
import { appStyles } from './styles/appStyles'
import type { UserRead } from './types/api'
import type { ScreenId } from './types/navigation'

export default function GuaraVivoApp() {
	const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isSessionReady, setIsSessionReady] = useState(false)
	const [splashFinished, setSplashFinished] = useState(false)
	const [currentUser, setCurrentUser] = useState<UserRead | null>(null)
	const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>()

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
		if (!splashFinished || !isSessionReady || currentScreen !== 'splash') {
			return
		}

		setCurrentScreen(isAuthenticated ? 'home' : 'welcome')
	}, [currentScreen, isAuthenticated, isSessionReady, splashFinished])

	const handleNavigate = (screen: ScreenId, recordId?: number) => {
		if (recordId !== undefined) {
			setSelectedRecordId(recordId)
		}

		setCurrentScreen(screen)
	}

	const handleAuthSuccess = (user?: UserRead) => {
		setCurrentUser(user ?? null)
		setIsAuthenticated(true)
	}

	const handleLogout = async () => {
		await logout()
		setIsAuthenticated(false)
		setCurrentUser(null)
		setSelectedRecordId(undefined)
		setCurrentScreen('welcome')
	}

	const showNavigation = useMemo(() => {
		if (!isAuthenticated) {
			return false
		}

		return ['home', 'register', 'maps', 'history', 'profile'].includes(
			currentScreen,
		)
	}, [currentScreen, isAuthenticated])

	const renderScreen = () => {
		switch (currentScreen) {
			case 'splash':
				return <SplashScreen onFinish={() => setSplashFinished(true)} />
			case 'welcome':
				return <WelcomeScreen onNavigate={handleNavigate} />
			case 'login':
				return (
					<LoginScreen
						onNavigate={handleNavigate}
						onSuccess={handleAuthSuccess}
					/>
				)
			case 'register-email':
				return <RegisterEmailScreen onNavigate={handleNavigate} />
			case 'register-password':
				return (
					<RegisterPasswordScreen
						onNavigate={handleNavigate}
						onSuccess={handleAuthSuccess}
					/>
				)
			case 'home':
				return <HomeScreen onNavigate={handleNavigate} />
			case 'register':
				return <RegisterScreen onNavigate={handleNavigate} />
			case 'maps':
				return <MapsScreen onNavigate={handleNavigate} />
			case 'history':
				return (
					<HistoryScreen
						onNavigate={handleNavigate}
						onOpenRecord={(recordId: number) =>
							handleNavigate('record-detail', recordId)
						}
					/>
				)
			case 'record-detail':
				return (
					<RecordDetailScreen
						onNavigate={handleNavigate}
						recordId={selectedRecordId}
					/>
				)
			case 'profile':
				return (
					<ProfileScreen
						onNavigate={handleNavigate}
						onLogout={handleLogout}
						user={currentUser}
					/>
				)
			case 'edit-profile':
				return <EditProfileScreen onNavigate={handleNavigate} />
			case 'change-password':
				return <ChangePasswordScreen onNavigate={handleNavigate} />
			case 'notifications':
				return <NotificationsScreen onNavigate={handleNavigate} />
			case 'about':
				return <AboutScreen onNavigate={handleNavigate} />
			default:
				return <HomeScreen onNavigate={handleNavigate} />
		}
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
				{showNavigation ? (
					<BottomNavigation
						currentScreen={currentScreen}
						onNavigate={handleNavigate}
					/>
				) : null}
			</SafeAreaView>
		</ErrorBoundary>
	)
}
