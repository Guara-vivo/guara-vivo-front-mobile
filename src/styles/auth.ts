import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../constants/theme'
import { screenGutter, palette, basePrimaryButton, basePrimaryButtonLabel } from './shared'

export const authStyles = StyleSheet.create<Record<string, any>>({
	splashScreen: {
		justifyContent: 'center',
		color: colors.secondary,
		backgroundColor: colors.splash,
	},
	splashLogo: {
		width: 300,
		height: 240,
	},
	splashLoadingIndicator: {
		marginTop: spacing.lg,
	},
	welcomeLogo: {
		width: '80%',
		maxWidth: 320,
		height: 250,
	},
	welcomeScreen: {
		flex: 1,
		backgroundColor: colors.splash,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
	},
	welcomeContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: spacing.lg,
		gap: spacing.xl,
	},
	welcomeActions: {
		width: '100%',
		alignItems: 'center',
	},
	welcomePrimaryButton: {
		...basePrimaryButton,
		backgroundColor: colors.text,
	},
	welcomePrimaryButtonLabel: {
		...basePrimaryButtonLabel,
		color: colors.surface,
	},
	welcomeTextButton: {
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: 'transparent',
	},
	welcomeTextButtonLabel: {
		color: colors.text,
		fontWeight: '600',
		fontSize: fontSize.bodyLarge,
	},
	loginScreen: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	loginContent: {
		flexGrow: 1,
		backgroundColor: colors.surface,
		paddingTop: 48,
		paddingHorizontal: screenGutter,
		paddingBottom: 24,
	},
	loginHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginBottom: 56,
	},
	loginTitle: {
		color: colors.text,
		fontSize: fontSize.headline,
		lineHeight: 26,
	},
	loginBackButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginFields: {
		gap: 10,
	},
	loginFieldWrap: {
		gap: 5,
	},
	loginInput: {
		paddingHorizontal: 0,
		paddingVertical: 4,
		fontSize: fontSize.body,
		lineHeight: 20,
		color: colors.text,
		backgroundColor: 'transparent',
	},
	loginDivider: {
		height: 1,
		backgroundColor: colors.border,
	},
	loginPasswordRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	loginPasswordInput: {
		flex: 1,
		minHeight: 36,
	},
	loginEyeButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginForgot: {
		color: colors.secondary,
		fontSize: fontSize.body,
	},
	loginButtonWrap: {
		marginTop: 44,
		alignItems: 'center',
	},
	loginPrimaryButton: {
		...basePrimaryButton,
		backgroundColor: palette.text,
		width: '86%',
		maxWidth: 360,
	},
	authContent: {
		flexGrow: 1,
		backgroundColor: colors.surface,
		paddingTop: 48,
		paddingHorizontal: screenGutter,
		paddingBottom: 24,
	},
	authButtonWrap: {
		marginTop: 44,
		alignItems: 'center',
	},
	authPrimaryButton: {
		...basePrimaryButton,
		backgroundColor: palette.text,
		width: '86%',
		maxWidth: 360,
	},
	authPrimaryButtonText: {
		...basePrimaryButtonLabel,
	},
	loginPrimaryButtonLabel: {
		...basePrimaryButtonLabel,
	},
	registerAccountScreen: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	registerHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginBottom: 56,
	},
	registerBackButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	registerAccountTopWrap: {
		gap: 16,
	},
	registerAccountFieldBlock: {
		gap: 5,
	},
	registerAccountInput: {
		color: palette.text,
		fontSize: fontSize.body,
		lineHeight: 20,
		paddingVertical: 4,
		paddingHorizontal: 0,
	},
	registerAccountDivider: {
		height: 1,
		backgroundColor: palette.border,
		marginTop: 1,
	},
	registerPasswordFieldBlock: {
		gap: 2,
	},
	registerPasswordInputRow: {
		minHeight: 40,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	registerPasswordInput: {
		flex: 1,
		color: palette.text,
		fontSize: fontSize.body,
		lineHeight: 20,
		paddingVertical: 2,
		paddingHorizontal: 0,
	},
	registerPasswordDivider: {
		height: 1,
		backgroundColor: palette.border,
		marginTop: 0,
	},
	registerPasswordEyeButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	registerPasswordHint: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 14,
	},
	registerHeaderTitle: {
		color: colors.text,
		fontSize: fontSize.headline,
		lineHeight: 26,
	},
})
