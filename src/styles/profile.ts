import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius, fontFamily } from '../constants/theme'
import { screenGutter, screenBottomPadding, cornerRadius, unifiedShadow } from './shared'

export const profileStyles = StyleSheet.create<Record<string, any>>({
	profileScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	profileContent: {
		paddingHorizontal: screenGutter,
		paddingTop: spacing.lg,
		paddingBottom: screenBottomPadding,
		gap: spacing.md,
	},
	profileTitle: {
		color: colors.text,
		fontSize: 40,
		lineHeight: 48,
		fontFamily: fontFamily.display,
	},
	profileUserCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.lg,
		padding: spacing.md,
	},
	profileUserInfo: {
		flex: 1,
	},
	profileHeroName: {
		color: colors.text,
		fontSize: fontSize.title,
		fontWeight: '700',
	},
	profileHeroEmail: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	profileEditButton: {
		minHeight: 44,
		justifyContent: 'center',
		paddingHorizontal: spacing.sm2,
		borderRadius: radius.pill,
		backgroundColor: colors.blueSoft,
	},
	profileEditButtonText: {
		color: colors.secondary,
		fontSize: fontSize.body,
		fontWeight: '700',
	},
	profileGroupTitle: {
		color: colors.muted,
		fontSize: fontSize.body,
		fontWeight: '700',
		marginTop: spacing.sm,
	},
	profileGroupCard: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		overflow: 'hidden',
	},
	profileMenuItem: {
		minHeight: 60,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		paddingHorizontal: spacing.sm2,
	},
	profileMenuItemDivider: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	profileMenuIcon: {
		width: 36,
		height: 36,
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.blueSoft,
	},
	profileMenuItemText: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
	},
	profileLogoutButton: {
		minHeight: 56,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		borderRadius: radius.md,
		backgroundColor: colors.redSoft,
		marginTop: spacing.sm,
	},
	profileMenuItemTextLogout: {
		color: colors.dangerText,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	logoutOverlayContainer: {
		position: 'absolute' as const,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: colors.scrim,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	logoutOverlayCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.lg,
		alignItems: 'center',
		gap: spacing.md,
		...unifiedShadow,
	},
	logoutOverlayText: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		textAlign: 'center',
	},
})
