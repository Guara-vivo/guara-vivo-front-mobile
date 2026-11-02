import { StyleSheet } from 'react-native'
import { colors, spacing } from '../constants/theme'
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
		paddingHorizontal: 12,
		paddingVertical: 20,
		alignItems: 'center',
		...unifiedShadow,
	},
	profileAvatarCircle: {
		width: 104,
		height: 104,
		borderRadius: 104,
		borderWidth: 2.8,
		borderColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	profileHeroName: {
		color: colors.text,
		fontSize: 15,
		lineHeight: 18,

		textAlign: 'center',
	},
	profileHeroEmail: {
		color: colors.muted,
		fontSize: 12,
		lineHeight: 15,

		textAlign: 'center',
		marginBottom: 10,
	},
	profileEditButton: {
		minWidth: 114,
		minHeight: 36,
		borderRadius: cornerRadius,
		backgroundColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 18,
	},
	profileEditButtonText: {
		color: colors.surface,
		fontSize: 14,

		textTransform: 'uppercase',
	},
	profileMenuCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: 16,
		paddingVertical: 18,
		gap: 10,
		...unifiedShadow,
	},
	profileMenuTitle: {
		color: colors.secondary,
		fontSize: 14,

		textTransform: 'uppercase',
		marginBottom: 2,
	},
	profileMenuItem: {
		minHeight: 42,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 8,
	},
	profileMenuItemText: {
		color: colors.text,
		fontSize: 14,
	},
	profileMenuItemTextLogout: {
		color: colors.primary,
		fontSize: 14,
	},
	logoutOverlayContainer: {
		position: 'absolute' as const,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	logoutOverlayCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingVertical: 32,
		paddingHorizontal: 24,
		alignItems: 'center',
		gap: 16,
		...unifiedShadow,
	},
	logoutOverlayText: {
		color: colors.text,
		fontSize: 16,
		textAlign: 'center',
	},
})
