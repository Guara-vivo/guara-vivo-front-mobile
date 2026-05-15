import React from 'react'
import { Pressable, Text } from 'react-native'
import type { ViewStyle, TextStyle } from 'react-native'
import { colors, spacing, radius } from '../constants/theme'

interface ButtonProps {
	children: React.ReactNode
	label?: string
	onPress: () => void
	variant?: 'primary' | 'secondary'
	fullWidth?: boolean
	disabled?: boolean
	style?: ViewStyle
	labelStyle?: TextStyle
}

const variants = {
	primary: {
		backgroundColor: colors.secondary,
	},
	secondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.secondary,
	},
}

export function Button({
	children,
	label = '',
	onPress,
	variant = 'primary',
	fullWidth = false,
	disabled = false,
	style,
	labelStyle,
}: ButtonProps) {
	const variantProps = variants[variant]

	const wrapperStyle: ViewStyle = {
		padding: spacing.md,
		borderRadius: radius.md,
		marginHorizontal: spacing.md,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: disabled ? 0.5 : 1,
		...style,
		...(fullWidth ? { marginHorizontal: 0, flex: 1 } : {}),
	}

	const textStyle: TextStyle = {
		fontSize: 16,
		fontWeight: '600',
		color: variantProps.backgroundColor === colors.secondary ? colors.surface : colors.secondary,
		...labelStyle,
	}

	return (
		<Pressable onPress={onPress} disabled={disabled} style={wrapperStyle}>
			<Text style={textStyle}>{children ?? label}</Text>
		</Pressable>
	)
}

export default Button
