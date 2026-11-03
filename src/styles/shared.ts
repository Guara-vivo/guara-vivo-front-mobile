import type { TextStyle, ViewStyle } from 'react-native'
import { colors, elevation, fontSize, radius, spacing } from '../constants/theme'

export const screenGutter = spacing.md
export const screenBottomPadding = 120
export const cornerRadius = radius.md ?? 12
// `unifiedShadow` = elevação de card; `overlayShadow` = elementos flutuantes. Botões são planos.
export const unifiedShadow = elevation.card
export const overlayShadow = elevation.overlay

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
	padding: spacing.md,
	borderRadius: cornerRadius,
	alignItems: 'center',
	justifyContent: 'center',
}

export const basePrimaryButtonLabel: TextStyle = {
	color: palette.surface,
	fontSize: fontSize.bodyLarge,
}
