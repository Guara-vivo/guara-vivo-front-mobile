import { StyleSheet } from 'react-native'
import { colors, spacing } from '../constants/theme'
import { screenGutter, screenBottomPadding, cornerRadius, unifiedShadow } from './shared'

export const profileStyles = StyleSheet.create<Record<string, any>>({
	profileScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	profileHeaderBar: {
		backgroundColor: colors.secondary,
		minHeight: 82,
		justifyContent: 'flex-end',
		paddingBottom: 14,
		paddingHorizontal: screenGutter,
		paddingTop: 30,
	},
	profileSecondaryHeaderBar: {
		backgroundColor: colors.secondary,
		minHeight: 82,
		paddingTop: 30,
		paddingBottom: 14,
		paddingHorizontal: screenGutter,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	profileHeaderBackButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	profileHeaderTitle: {
		color: colors.surface,
		fontSize: 22,
		lineHeight: 39,

		textTransform: 'uppercase',
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
	profileHero: {
		alignItems: 'center',
	},
	avatarCircle: {
		width: 112,
		height: 112,
		borderRadius: 112,
		backgroundColor: colors.splash,
		borderWidth: 3,
		borderColor: colors.secondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarInitial: {
		color: colors.secondary,
		fontSize: 46,
	},
	profileName: {
		color: colors.text,
		fontSize: 20,

		textAlign: 'center',
	},
	profileEmail: {
		color: colors.muted,
		fontSize: 13,
		textAlign: 'center',
	},
})
