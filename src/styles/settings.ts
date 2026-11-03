import { StyleSheet } from 'react-native'
import { colors, fontSize, spacing } from '../constants/theme'
import { cornerRadius, unifiedShadow } from './shared'

export const settingsStyles = StyleSheet.create<Record<string, any>>({
	changePasswordCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.md,
		gap: 14,
		...unifiedShadow,
	},
	changePasswordFieldWrap: {
		gap: 5,
	},
	changePasswordLabelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
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
		paddingLeft: 10,
		paddingRight: 6,
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
		paddingHorizontal: 10,
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
		gap: 10,
		marginTop: 10,
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
		paddingVertical: 14,
		gap: spacing.sm2,
		...unifiedShadow,
	},
	notificationsTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 7,
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
		paddingHorizontal: 10,
		paddingVertical: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
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
		paddingHorizontal: 14,
		paddingVertical: spacing.md,
		gap: spacing.sm2,
		...unifiedShadow,
	},
	aboutLogo: {
		alignSelf: 'center',
		width: 210,
		height: 110,
		marginTop: spacing.sm,
		marginBottom: 6,
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
		marginBottom: 10,
	},
	aboutSection: {
		gap: 6,
	},
	aboutSectionTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
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
		gap: 6,
	},
	aboutBulletDot: {
		color: colors.primary,
		fontSize: fontSize.caption,
		lineHeight: 24,
	},
	aboutFooterDivider: {
		height: 1,
		backgroundColor: colors.border,
		marginTop: 6,
	},
	aboutFooterText: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 15,

		textAlign: 'center',
	},
})
