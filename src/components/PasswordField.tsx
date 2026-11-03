import React, { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

type Props = {
	label: string
	value: string
	onChangeText: (text: string) => void
	hint?: string
	autoComplete?: 'current-password' | 'new-password'
}

// Campo de senha da tela de troca de senha: rótulo, olho de mostrar/ocultar e dica opcional.
export function PasswordField({ label, value, onChangeText, hint, autoComplete }: Props) {
	const [visible, setVisible] = useState(false)

	return (
		<View style={appStyles.changePasswordFieldWrap}>
			<View style={appStyles.changePasswordLabelRow}>
				<Ionicons name="lock-closed-outline" size={13} color={colors.primary} />
				<Text style={appStyles.changePasswordLabel}>{label}</Text>
			</View>
			<View style={appStyles.changePasswordInputRow}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					secureTextEntry={!visible}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete={autoComplete}
					accessibilityLabel={label}
					style={appStyles.changePasswordInputNoPadding}
				/>
				<Pressable
					onPress={() => setVisible((current) => !current)}
					accessibilityRole="button"
					accessibilityLabel={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
					hitSlop={8}
					style={appStyles.changePasswordEyeButton}
				>
					<Ionicons
						name={visible ? 'eye-outline' : 'eye-off-outline'}
						size={20}
						color={colors.muted}
					/>
				</Pressable>
			</View>
			{hint ? <Text style={appStyles.changePasswordHint}>{hint}</Text> : null}
		</View>
	)
}

export default PasswordField
