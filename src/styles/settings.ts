import { StyleSheet } from 'react-native'
import { colors, fontSize, radius, spacing } from '../constants/theme'
import { screenGutter } from './shared'

export const settingsStyles = StyleSheet.create<Record<string, any>>({
	settingsContent: {
		paddingHorizontal: screenGutter,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
		gap: spacing.md,
	},
	// Rodapé fixo dos formulários: salvar em destaque e "Cancelar" em texto.
	settingsFooter: {
		paddingHorizontal: screenGutter,
		paddingVertical: spacing.sm2,
		gap: spacing.xs,
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	settingsCancelButton: {
		minHeight: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	settingsCancelText: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	settingsAvatarWrap: {
		alignItems: 'center',
	},
	changePasswordCard: {
		gap: spacing.md,
	},
	changePasswordFieldWrap: {
		gap: spacing.xs,
	},
	changePasswordLabel: {
		color: colors.muted,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	changePasswordInputRow: {
		minHeight: 52,
		borderRadius: radius.md,
		borderWidth: 1.5,
		borderColor: 'transparent',
		backgroundColor: colors.field,
		paddingLeft: spacing.sm2,
		paddingRight: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	changePasswordInputNoPadding: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		paddingVertical: 0,
	},
	changePasswordEyeButton: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	changePasswordHint: {
		color: colors.muted,
		fontSize: fontSize.caption,
	},
	notificationsCard: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		overflow: 'hidden',
	},
	notificationsItem: {
		minHeight: 72,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: spacing.sm2,
	},
	notificationsItemDivider: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	notificationsTextWrap: {
		flex: 1,
		gap: 2,
	},
	notificationsItemTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	notificationsItemSubtitle: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 18,
	},
	aboutCard: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.md,
		gap: spacing.md,
	},
	aboutLogo: {
		alignSelf: 'center',
		width: 210,
		height: 110,
	},
	aboutVersion: {
		color: colors.muted,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	aboutSection: {
		gap: spacing.sm,
	},
	aboutSectionTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	aboutBodyText: {
		color: colors.text,
		fontSize: fontSize.body,
		lineHeight: 22,
	},
	aboutBulletRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.sm,
	},
	aboutBulletText: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.body,
		lineHeight: 22,
	},
	aboutBulletDot: {
		color: colors.primary,
		fontSize: fontSize.body,
		lineHeight: 22,
	},
	aboutFooterDivider: {
		height: 1,
		backgroundColor: colors.border,
	},
	aboutFooterText: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 16,
		textAlign: 'center',
	},
})
