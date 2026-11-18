import React, { useRef, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import FeedbackModal from '../components/FeedbackModal'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { RegistrationClosedModal } from '../components/auth/RegistrationClosedModal'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { login } from '../services/authService'
import { appStyles } from '../styles/appStyles'
import type { UserRead } from '../types/api'
import { formatAppVersion } from '../utils/appVersion'
import { getLoginErrorFeedback } from '../utils/loginErrorMessage'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function LoginScreen({ onSuccess }: { onSuccess: (user: UserRead) => void }) {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation(['auth', 'common'])
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showForgotNotice, setShowForgotNotice] = useState(false)
	const [showRegistrationClosed, setShowRegistrationClosed] = useState(false)
	const passwordInputRef = useRef<TextInput>(null)
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)

	const handleLogin = async () => {
		if (!email || !password) {
			setFeedback({
				title: t('auth:login.requiredTitle'),
				message: t('auth:login.requiredMessage'),
			})
			return
		}

		try {
			setIsLoading(true)
			const response = await login(email.trim(), password)
			onSuccess(response.user)
			// A navegação é feita pelo RootNavigator, que reage a isAuthenticated.
		} catch (error) {
			setFeedback(getLoginErrorFeedback(error))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<AuthFrame
				title={t('auth:login.title')}
				subtitle={t('auth:login.subtitle')}
				onBack={() => navigation.goBack()}
				footer={
					<>
						<ActionButton
							title={isLoading ? t('auth:login.submitting') : t('auth:login.submit')}
							onPress={handleLogin}
							disabled={isLoading}
						/>
						<View style={appStyles.authBelowRow}>
							<Text style={appStyles.authBelowText}>{t('auth:login.noAccount')}</Text>
							<Pressable
								onPress={() => setShowRegistrationClosed(true)}
								accessibilityRole="button"
								accessibilityLabel={t('auth:login.createAccount')}
								hitSlop={8}
							>
								<Text style={appStyles.authLink}>{t('auth:login.createAccount')}</Text>
							</Pressable>
						</View>
						<Text style={appStyles.authVersion}>{formatAppVersion()}</Text>
					</>
				}
			>
				<AuthField
					label={t('auth:login.email')}
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoComplete="email"
					textContentType="emailAddress"
					returnKeyType="next"
					onSubmitEditing={() => passwordInputRef.current?.focus()}
					blurOnSubmit={false}
					editable={!isLoading}
				/>
				<AuthField
					ref={passwordInputRef}
					label={t('auth:login.password')}
					value={password}
					onChangeText={setPassword}
					secure
					autoComplete="current-password"
					textContentType="password"
					returnKeyType="go"
					onSubmitEditing={handleLogin}
					editable={!isLoading}
				/>
				<Pressable
					onPress={() => setShowForgotNotice(true)}
					accessibilityRole="button"
					accessibilityLabel={t('auth:login.forgotA11y')}
					hitSlop={{ left: 8, right: 8 }}
					style={appStyles.authLinkButton}
				>
					<Text style={appStyles.authLink}>{t('auth:login.forgot')}</Text>
				</Pressable>
			</AuthFrame>

			<RegistrationClosedModal
				visible={showRegistrationClosed}
				onClose={() => setShowRegistrationClosed(false)}
			/>

			<ComingSoonModal
				visible={showForgotNotice}
				message={t('auth:login.forgotUnavailable')}
				onClose={() => setShowForgotNotice(false)}
			/>

			{feedback ? (
				<FeedbackModal
					visible
					title={feedback.title}
					message={feedback.message}
					buttonLabel={t('common:ok')}
					iconName="alert-circle-outline"
					iconColor={colors.primary}
					onConfirm={() => setFeedback(null)}
				/>
			) : null}
		</>
	)
}

export default LoginScreen
