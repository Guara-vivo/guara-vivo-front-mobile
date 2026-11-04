import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import {
	MAX_PASSWORD_BYTES,
	MIN_PASSWORD_LENGTH,
	type PasswordRuleStatus,
} from '../utils/passwordRules'

function Rule({ ok, bad = false, text }: { ok: boolean; bad?: boolean; text: string }) {
	return (
		<View
			style={appStyles.authRuleRow}
			accessible
			accessibilityLabel={`${text}: ${ok ? 'cumprida' : bad ? 'não cumprida' : 'pendente'}`}
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
	return (
		<View style={appStyles.authRules}>
			<Rule ok={status.minLength} text={`Pelo menos ${MIN_PASSWORD_LENGTH} caracteres`} />
			<Rule ok={status.matches} text="As duas senhas são iguais" />
			{!status.withinByteLimit ? (
				<Rule
					ok={false}
					bad
					text={`Máximo de ${MAX_PASSWORD_BYTES} bytes (acentos e símbolos ocupam mais espaço)`}
				/>
			) : null}
		</View>
	)
}

export default PasswordRules
