import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
import { screenGutter, screenBottomPadding, cornerRadius, unifiedShadow } from './shared'

export const profileStyles = StyleSheet.create<Record<string, any>>({
	profileScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	profileContent: {
		paddingHorizontal: screenGutter,
		paddingBottom: screenBottomPadding,
		paddingTop: spacing.lg,
		gap: spacing.lg,
	},
	profileHeroCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.sm2,
		paddingVertical: 20,
		alignItems: 'center',
		...unifiedShadow,
	},
	profileAvatarCircle: {
		width: 104,
		height: 104,
		borderRadius: radius.pill,
		borderWidth: 2.8,
		borderColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: spacing.sm,
	},
	profileHeroName: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		lineHeight: 18,

		textAlign: 'center',
	},
	profileHeroEmail: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 15,

		textAlign: 'center',
		marginBottom: spacing.sm2,
	},
	profileEditButton: {
		minWidth: 114,
		minHeight: 48,
		borderRadius: cornerRadius,
		backgroundColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.md,
	},
	profileEditButtonText: {
		color: colors.surface,
		fontSize: fontSize.body,

		textTransform: 'uppercase',
	},
	profileMenuCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		gap: spacing.sm2,
		...unifiedShadow,
	},
	profileMenuTitle: {
		color: colors.secondary,
		fontSize: fontSize.body,

		textTransform: 'uppercase',
		marginBottom: 2,
	},
	profileMenuItem: {
		minHeight: 48,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		paddingHorizontal: spacing.sm,
	},
	profileMenuItemText: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	profileMenuItemTextLogout: {
		color: colors.primary,
		fontSize: fontSize.body,
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
