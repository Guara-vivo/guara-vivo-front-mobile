import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import FeedbackModal from '../components/FeedbackModal'
import { AuthField } from '../components/auth/AuthField'
import { AuthFrame } from '../components/auth/AuthFrame'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import type { AuthStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>

export function RegisterEmailScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation('auth')
	const [email, setEmail] = useState('')
	const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)

	const handleContinue = () => {
		if (!email.trim()) {
			setFeedback({
				title: t('register.emailRequiredTitle'),
				message: t('register.emailRequiredMessage'),
			})
			return
		}
		navigation.navigate('RegisterPassword')
	}

	return (
		<>
			<AuthFrame
				title={t('register.emailTitle')}
				subtitle={t('register.emailSubtitle')}
				onBack={() => navigation.goBack()}
				step={{ current: 1, total: 2 }}
				footer={<ActionButton title={t('register.continue')} onPress={handleContinue} />}
			>
				<AuthField
					label={t('login.email')}
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoComplete="email"
					textContentType="emailAddress"
					returnKeyType="next"
					onSubmitEditing={handleContinue}
				/>
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

export default RegisterEmailScreen
