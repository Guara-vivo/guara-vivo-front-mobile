import React, { forwardRef, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import type { TextInputProps } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
	label: string
	// Mostra o olho de mostrar/ocultar e esconde o texto por padrão.
	secure?: boolean
	hasError?: boolean
}

// Campo de login e cadastro: rótulo fixo acima, fundo cinza e borda azul em foco.
export const AuthField = forwardRef<TextInput, Props>(function AuthField(
	{ label, secure = false, hasError = false, onFocus, onBlur, ...inputProps },
	ref,
) {
	const [focused, setFocused] = useState(false)
	const [visible, setVisible] = useState(false)

	return (
		<View style={appStyles.authFieldWrap}>
			<Text style={appStyles.authFieldLabel}>{label}</Text>
			<View
				style={[
					appStyles.authFieldRow,
					focused && appStyles.authFieldRowFocused,
					hasError && appStyles.authFieldRowError,
				]}
			>
				<TextInput
					ref={ref}
					accessibilityLabel={label}
					placeholderTextColor={colors.placeholder}
					autoCapitalize="none"
					autoCorrect={false}
					{...inputProps}
					secureTextEntry={secure && !visible}
					onFocus={(event) => {
						setFocused(true)
						onFocus?.(event)
					}}
					onBlur={(event) => {
						setFocused(false)
						onBlur?.(event)
					}}
					style={appStyles.authFieldInput}
				/>
				{secure ? (
					<Pressable
						onPress={() => setVisible((current) => !current)}
						accessibilityRole="button"
						accessibilityLabel={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
						style={appStyles.authFieldEye}
					>
						<Ionicons
							name={visible ? 'eye-outline' : 'eye-off-outline'}
							size={22}
							color={colors.muted}
						/>
					</Pressable>
				) : null}
			</View>
		</View>
	)
})

export default AuthField
