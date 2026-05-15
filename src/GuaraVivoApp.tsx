import React, { useMemo, useState } from 'react'
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
import { appStyles } from './styles/appStyles'
import type { ScreenId } from './types/navigation'

export default function GuaraVivoApp() {
	const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>()

	const handleNavigate = (screen: ScreenId, recordId?: number) => {
		if (recordId !== undefined) {
			setSelectedRecordId(recordId)
		}

		setCurrentScreen(screen)
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
				return <SplashScreen onFinish={() => setCurrentScreen('welcome')} />
			case 'welcome':
				return <WelcomeScreen onNavigate={handleNavigate} />
			case 'login':
				return (
					<LoginScreen
						onNavigate={handleNavigate}
						onSuccess={() => setIsAuthenticated(true)}
					/>
				)
			case 'register-email':
				return <RegisterEmailScreen onNavigate={handleNavigate} />
			case 'register-password':
				return (
					<RegisterPasswordScreen
						onNavigate={handleNavigate}
						onSuccess={() => setIsAuthenticated(true)}
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
						onOpenRecord={(recordId) =>
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
						onLogout={() => {
							setIsAuthenticated(false)
							setSelectedRecordId(undefined)
							setCurrentScreen('welcome')
						}}
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
