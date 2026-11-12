import { StyleSheet } from 'react-native'
import { colors, fontSize, radius, spacing, fontFamily } from '../constants/theme'
import { cornerRadius, screenGutter } from './shared'

export const authStyles = StyleSheet.create<Record<string, any>>({
	// Splash e boas-vindas (fundo branco, logo escura)
	splashScreen: {
		justifyContent: 'center',
		backgroundColor: colors.surface,
	},
	splashContent: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	splashLogo: {
		alignSelf: 'center',
		width: 300,
		height: 169,
	},
	splashLoadingIndicator: {
		marginTop: spacing.lg,
	},
	welcomeScreen: {
		flex: 1,
		backgroundColor: colors.surface,
		paddingHorizontal: screenGutter,
		paddingBottom: spacing.lg,
	},
	welcomeBody: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
	},
	welcomeLogo: {
		width: '100%',
		maxWidth: 340,
		aspectRatio: 16 / 9,
	},
	welcomeTagline: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
		lineHeight: 22,
		textAlign: 'center',
		maxWidth: 280,
	},
	welcomeActions: {
		width: '100%',
		gap: spacing.sm2,
	},

	// Moldura das telas de login e cadastro
	authScreen: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	authScroll: {
		flexGrow: 1,
		paddingTop: spacing.md,
		paddingHorizontal: screenGutter,
		paddingBottom: spacing.lg,
	},
	authHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: 44,
	},
	authStepText: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	authProgress: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	authProgressBar: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.border,
	},
	authProgressBarDone: {
		backgroundColor: colors.primary,
	},
	authTitle: {
		color: colors.text,
		fontSize: 43,
		lineHeight: 50,
		fontFamily: fontFamily.display,
		marginTop: spacing.lg,
	},
	authSubtitle: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
		lineHeight: 22,
		marginTop: spacing.xs,
	},
	authBody: {
		marginTop: spacing.lg,
		gap: spacing.md,
	},
	authFooter: {
		paddingHorizontal: screenGutter,
		paddingTop: spacing.sm2,
		paddingBottom: spacing.md,
		backgroundColor: colors.surface,
		gap: spacing.sm2,
	},

	// Campo com rótulo fixo acima
	authFieldWrap: {
		gap: spacing.xs,
	},
	authFieldLabel: {
		color: colors.muted,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	authFieldRow: {
		minHeight: 52,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: cornerRadius,
		borderWidth: 1.5,
		borderColor: 'transparent',
		backgroundColor: colors.field,
		paddingLeft: spacing.md,
		paddingRight: spacing.xs,
	},
	authFieldRowFocused: {
		backgroundColor: colors.surface,
		borderColor: colors.secondary,
	},
	authFieldRowError: {
		borderColor: colors.primary,
	},
	authFieldInput: {
		flex: 1,
		minHeight: 48,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		paddingVertical: 0,
	},
	authFieldEye: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	authLinkButton: {
		alignSelf: 'flex-end',
		minHeight: 44,
		justifyContent: 'center',
	},
	authLink: {
		color: colors.secondary,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	authBelowRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.xs,
	},
	authBelowText: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	authVersion: {
		color: colors.muted,
		fontSize: fontSize.caption,
		textAlign: 'center',
		marginTop: spacing.sm,
	},

	// Lista de regras da senha (acende conforme a pessoa digita)
	authRules: {
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	authRuleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
	},
	authRuleMark: {
		width: 20,
		height: 20,
		borderRadius: radius.pill,
		borderWidth: 1.5,
		borderColor: colors.borderStrong,
		alignItems: 'center',
		justifyContent: 'center',
	},
	authRuleMarkOk: {
		backgroundColor: colors.success,
		borderColor: colors.success,
	},
	authRuleMarkBad: {
		backgroundColor: colors.dangerBg,
		borderColor: colors.dangerText,
	},
	authRuleText: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	authRuleTextOk: {
		color: colors.text,
	},
	authRuleTextBad: {
		color: colors.dangerText,
	},
})
