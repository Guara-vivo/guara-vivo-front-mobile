import { StyleSheet } from 'react-native'
import { colors, fontSize, spacing } from '../constants/theme'
import { cornerRadius, unifiedShadow } from './shared'

export const settingsStyles = StyleSheet.create<Record<string, any>>({
	changePasswordCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.md,
		gap: spacing.md,
		...unifiedShadow,
	},
	changePasswordFieldWrap: {
		gap: spacing.xs,
	},
	changePasswordLabelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	changePasswordLabel: {
		color: colors.text,
		fontSize: fontSize.caption,

		textTransform: 'uppercase',
	},
	changePasswordInputRow: {
		minHeight: 42,
		borderRadius: cornerRadius,
		borderWidth: 1,
		borderColor: colors.secondaryLight,
		backgroundColor: colors.surface,
		paddingLeft: spacing.sm2,
		paddingRight: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	changePasswordInput: {
		minHeight: 42,
		borderRadius: cornerRadius,
		borderWidth: 1,
		borderColor: colors.secondaryLight,
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.sm2,
		color: colors.text,
		fontSize: fontSize.body,
	},
	changePasswordInputNoPadding: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.body,
		paddingVertical: 0,
	},
	changePasswordEyeButton: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	changePasswordHint: {
		color: colors.muted,
		fontSize: fontSize.caption,
	},
	changePasswordActionsRow: {
		flexDirection: 'row',
		gap: spacing.sm2,
		marginTop: spacing.sm2,
	},
	changePasswordPrimaryAction: {
		flex: 1,
		minHeight: 42,
		borderRadius: cornerRadius,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	changePasswordPrimaryActionText: {
		color: colors.surface,
		fontSize: fontSize.caption,

		textTransform: 'uppercase',
	},
	changePasswordSecondaryAction: {
		flex: 1,
		minHeight: 42,
		borderRadius: cornerRadius,
		backgroundColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	changePasswordSecondaryActionText: {
		color: colors.surface,
		fontSize: fontSize.caption,

		textTransform: 'uppercase',
	},
	notificationsCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.md,
		gap: spacing.sm2,
		...unifiedShadow,
	},
	notificationsTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		paddingHorizontal: spacing.xs,
	},
	notificationsTitle: {
		color: colors.secondary,
		fontSize: fontSize.body,

		textTransform: 'uppercase',
	},
	notificationsItem: {
		minHeight: 58,
		borderRadius: cornerRadius,
		backgroundColor: colors.background,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: spacing.sm2,
	},
	notificationsTextWrap: {
		flex: 1,
		gap: 2,
	},
	notificationsItemTitle: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	notificationsItemSubtitle: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 14,
	},
	aboutCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		gap: spacing.sm2,
		...unifiedShadow,
	},
	aboutLogo: {
		alignSelf: 'center',
		width: 210,
		height: 110,
		marginTop: spacing.sm,
		marginBottom: spacing.sm,
	},
	aboutAppName: {
		color: colors.secondary,
		fontSize: fontSize.title,

		textAlign: 'center',
		textTransform: 'uppercase',
	},
	aboutVersion: {
		color: colors.muted,
		fontSize: fontSize.body,

		textAlign: 'center',
		marginBottom: spacing.sm2,
	},
	aboutSection: {
		gap: spacing.sm,
	},
	aboutSectionTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	aboutSectionTitle: {
		color: colors.secondary,
		fontSize: fontSize.body,

		textTransform: 'uppercase',
	},
	aboutBodyText: {
		color: colors.text,
		fontSize: fontSize.body,
		lineHeight: 25,
	},
	aboutBulletRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.sm,
	},
	aboutBulletDot: {
		color: colors.primary,
		fontSize: fontSize.caption,
		lineHeight: 24,
	},
	aboutFooterDivider: {
		height: 1,
		backgroundColor: colors.border,
		marginTop: spacing.sm,
	},
	aboutFooterText: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 15,

		textAlign: 'center',
	},
})
