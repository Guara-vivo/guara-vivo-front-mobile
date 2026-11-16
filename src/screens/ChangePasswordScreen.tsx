import React, { useCallback, useReducer, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { PasswordRules } from '../components/PasswordRules'
import { AuthField } from '../components/auth/AuthField'
import { ActionButton } from '../components/common'
import { ComingSoonModal } from '../components/ComingSoonModal'
import { getPasswordRuleStatus } from '../utils/passwordRules'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type Field = 'currentPassword' | 'newPassword' | 'confirmPassword'
type State = Record<Field, string>

const initialState: State = { currentPassword: '', newPassword: '', confirmPassword: '' }

function reducer(state: State, action: { field: Field; value: string }): State {
	return { ...state, [action.field]: action.value }
}

export function ChangePasswordScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation(['profile', 'common'])
	const [state, dispatch] = useReducer(reducer, initialState)
	const [showComingSoon, setShowComingSoon] = useState(false)
	const status = getPasswordRuleStatus(state.newPassword, state.confirmPassword)

	const goBack = useCallback(() => navigation.goBack(), [navigation])

	return (
		<KeyboardAvoidingView
			style={appStyles.profileScreen}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<Header title={t('profile:password.title')} leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView
				contentContainerStyle={appStyles.settingsContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.changePasswordCard}>
					<AuthField
						label={t('profile:password.current')}
						secure
						value={state.currentPassword}
						onChangeText={(value) => dispatch({ field: 'currentPassword', value })}
						autoComplete="current-password"
					/>
					<AuthField
						label={t('profile:password.new')}
						secure
						value={state.newPassword}
						onChangeText={(value) => dispatch({ field: 'newPassword', value })}
						autoComplete="new-password"
						hasError={!status.withinByteLimit}
					/>
					<AuthField
						label={t('profile:password.confirm')}
						secure
						value={state.confirmPassword}
						onChangeText={(value) => dispatch({ field: 'confirmPassword', value })}
						autoComplete="new-password"
					/>
					<PasswordRules status={status} />
				</View>
			</ScrollView>

			<View style={appStyles.settingsFooter}>
				<ActionButton title={t('profile:password.title')} onPress={() => setShowComingSoon(true)} />
				<Pressable
					onPress={goBack}
					accessibilityRole="button"
					accessibilityLabel={t('common:cancel')}
					style={appStyles.settingsCancelButton}
				>
					<Text style={appStyles.settingsCancelText}>{t('common:cancel')}</Text>
				</Pressable>
			</View>

			<ComingSoonModal
				visible={showComingSoon}
				message={t('profile:password.unavailable')}
				onClose={() => setShowComingSoon(false)}
			/>
		</KeyboardAvoidingView>
	)
}

export default ChangePasswordScreen
