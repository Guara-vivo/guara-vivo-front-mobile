import type { TextStyle, ViewStyle } from 'react-native'
import { colors, radius, spacing } from '../constants/theme'

export const screenGutter = spacing.md
export const screenBottomPadding = 120
export const cornerRadius = radius.md ?? 12
export const unifiedShadow = {
	shadowColor: colors.text,
	shadowOpacity: 1,
	shadowOffset: { width: 0, height: 5 },
	shadowRadius: cornerRadius,
	elevation: 10,
}

// palette aliases — prefer theme colors, fallback to literals when needed
export const palette = {
	primary: colors.primary,
	primaryDark: colors.primaryDark,
	secondary: colors.secondary,
	secondaryLight: colors.secondaryLight,
	background: colors.background,
	surface: colors.surface,
	text: colors.text,
	muted: colors.muted,
	border: colors.border,
	splash: colors.splash,
	white: colors.surface,
}

export const baseCard: ViewStyle = {
	backgroundColor: palette.surface,
	borderRadius: cornerRadius,
	padding: spacing.md,
	borderWidth: 1,
	borderColor: palette.border,
	...unifiedShadow,
}

export const basePrimaryButton: ViewStyle = {
	minHeight: 44,
	padding: 16,
	borderRadius: cornerRadius,
	alignItems: 'center',
	justifyContent: 'center',
	...unifiedShadow,
}

export const basePrimaryButtonLabel: TextStyle = {
	color: palette.surface,
	fontSize: 15,
}
