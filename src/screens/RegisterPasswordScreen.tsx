import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import FeedbackModal from '../components/FeedbackModal'
import { PasswordRules } from '../components/PasswordRules'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import {
	getPasswordRuleStatus,
	isPasswordLongEnough,
	isPasswordWithinLimit,
	MAX_PASSWORD_BYTES,
	MIN_PASSWORD_LENGTH,
} from '../utils/passwordRules'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function RegisterPasswordScreen({ onSuccess }: { onSuccess: () => void }) {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation('auth')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)
	const status = getPasswordRuleStatus(password, confirmPassword)

	const handleFinish = () => {
		if (!isPasswordLongEnough(password)) {
			setFeedback({
				title: t('register.weakTitle'),
				message: t('register.weakMessage', { min: MIN_PASSWORD_LENGTH }),
			})
			return
		}

		if (!isPasswordWithinLimit(password)) {
			setFeedback({
				title: t('register.tooLongTitle'),
				message: t('register.tooLongMessage', { max: MAX_PASSWORD_BYTES }),
			})
			return
		}

		if (password !== confirmPassword) {
			setFeedback({
				title: t('register.mismatchTitle'),
				message: t('register.mismatchMessage'),
			})
			return
		}

		onSuccess()
		// A navegação é feita pelo RootNavigator, que reage a isAuthenticated.
	}

	return (
		<>
			<AuthFrame
				title={t('register.passwordTitle')}
				subtitle={t('register.passwordSubtitle')}
				onBack={() => navigation.goBack()}
				step={{ current: 2, total: 2 }}
				footer={<ActionButton title={t('register.continue')} onPress={handleFinish} />}
			>
				<AuthField
					label={t('register.passwordLabel')}
					value={password}
					onChangeText={setPassword}
					secure
					autoComplete="new-password"
					textContentType="newPassword"
					returnKeyType="next"
					hasError={!status.withinByteLimit}
				/>
				<AuthField
					label={t('register.confirmLabel')}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secure
					autoComplete="new-password"
					textContentType="newPassword"
					returnKeyType="go"
					onSubmitEditing={handleFinish}
				/>
				<PasswordRules status={status} />
			</AuthFrame>

			{feedback ? (
				<FeedbackModal
					visible
					title={feedback.title}
					message={feedback.message}
					buttonLabel="OK"
					iconName="alert-circle-outline"
					iconColor={colors.primary}
					onConfirm={() => setFeedback(null)}
				/>
			) : null}
		</>
	)
}

export default RegisterPasswordScreen
