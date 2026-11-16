import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import {
	MAX_PASSWORD_BYTES,
	MIN_PASSWORD_LENGTH,
	type PasswordRuleStatus,
} from '../utils/passwordRules'

function Rule({ ok, bad = false, text }: { ok: boolean; bad?: boolean; text: string }) {
	const { t } = useTranslation('auth')
	const state = t(ok ? 'rules.met' : bad ? 'rules.unmet' : 'rules.pending')

	return (
		<View
			style={appStyles.authRuleRow}
			accessible
			accessibilityLabel={t('rules.state', { text, state })}
		>
			<View
				style={[
					appStyles.authRuleMark,
					ok && appStyles.authRuleMarkOk,
					bad && appStyles.authRuleMarkBad,
				]}
			>
				{ok ? <Ionicons name="checkmark" size={13} color={colors.onColor} /> : null}
				{bad ? <Ionicons name="close" size={13} color={colors.dangerText} /> : null}
			</View>
			<Text
				style={[
					appStyles.authRuleText,
					ok && appStyles.authRuleTextOk,
					bad && appStyles.authRuleTextBad,
				]}
			>
				{text}
			</Text>
		</View>
	)
}

// Lista de regras da senha: cada uma acende quando cumprida. O limite de bytes só aparece quando estoura.
export function PasswordRules({ status }: { status: PasswordRuleStatus }) {
	const { t } = useTranslation('auth')

	return (
		<View style={appStyles.authRules}>
			<Rule ok={status.minLength} text={t('rules.minLength', { min: MIN_PASSWORD_LENGTH })} />
			<Rule ok={status.matches} text={t('rules.matches')} />
			{!status.withinByteLimit ? (
				<Rule
					ok={false}
					bad
					text={t('rules.tooLong', { max: MAX_PASSWORD_BYTES })}
				/>
			) : null}
		</View>
	)
}

export default PasswordRules
