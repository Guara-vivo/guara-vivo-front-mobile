import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalProvider } from '@gorhom/portal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'

import { ErrorBoundary } from './components/ErrorBoundary'
import { InAppNotificationProvider } from './contexts/InAppNotificationContext'
import { RecordProgressProvider } from './contexts/RecordProgressContext'
import { colors } from './constants/theme'
import { restoreSession } from './services/authService'
import { RootNavigator } from './navigation/RootNavigator'
import { SplashScreen } from './screens/SplashScreen'
import { MapZoneDetailProvider } from './contexts/MapZoneDetailContext'
import { MapZoneDetailSheet } from './components/MapZoneDetailSheet'
import { appStyles } from './styles/appStyles'
import type { UserRead } from './types/api'
import type { RootStackParamList } from './types/navigation'


export default function GuaraVivoApp() {
	const navigationRef = useNavigationContainerRef<RootStackParamList>()
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

	const handleOpenNotificationRecord = (recordId: number) => {
		if (!navigationRef.isReady()) {
			return
		}

		navigationRef.navigate('RecordDetail', { recordId })
	}

	const renderScreen = () => {
		if (!isSessionReady) {
			return <SplashScreen isLoading />
		}

		return (
			<InAppNotificationProvider
				isEnabled={isAuthenticated}
				onOpenRecord={handleOpenNotificationRecord}
			>
				<RecordProgressProvider isEnabled={isAuthenticated}>
					<NavigationContainer ref={navigationRef}>
						<MapZoneDetailProvider>
							<RootNavigator
								isAuthenticated={isAuthenticated}
								currentUser={currentUser}
								onAuthSuccess={handleAuthSuccess}
								onLogoutSuccess={handleLogoutSuccess}
							/>
							<MapZoneDetailSheet />
						</MapZoneDetailProvider>
					</NavigationContainer>
				</RecordProgressProvider>
			</InAppNotificationProvider>
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
			<BottomSheetModalProvider>
				<PortalProvider>
					<ErrorBoundary>
							<SafeAreaView style={safeAreaStyle}>
								<StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
								{renderScreen()}
							</SafeAreaView>
					</ErrorBoundary>
				</PortalProvider>
			</BottomSheetModalProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)

}
