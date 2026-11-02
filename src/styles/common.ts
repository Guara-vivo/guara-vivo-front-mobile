import { StyleSheet } from 'react-native'
import { colors, radius, spacing } from '../constants/theme'
import { screenGutter, cornerRadius, unifiedShadow, palette } from './shared'

export const commonStyles = StyleSheet.create<Record<string, any>>({
	app: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	appSplash: {
		backgroundColor: colors.splash,
	},
	screen: {
		flex: 1,
	},
	screenPadding: {
		flex: 1,
		padding: spacing.md,
		backgroundColor: colors.splash,
	},
	inAppNotificationOverlay: {
		position: 'absolute',
		top: spacing.xl,
		left: spacing.md,
		right: spacing.md,
		zIndex: 1000,
		elevation: 1000,
	},
	inAppNotificationBanner: {
		minHeight: 74,
		borderRadius: radius.md,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderLeftWidth: 5,
		borderColor: colors.border,
		borderLeftColor: '#2E9D57',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		...unifiedShadow,
	},
	inAppNotificationBannerError: {
		borderLeftColor: colors.primary,
	},
	inAppNotificationIconWrap: {
		width: 28,
		alignItems: 'center',
	},
	inAppNotificationTextWrap: {
		flex: 1,
		gap: 2,
	},
	inAppNotificationTitle: {
		color: colors.text,
		fontSize: 14,
	},
	inAppNotificationMessage: {
		color: colors.muted,
		fontSize: 12,
		lineHeight: 17,
	},
	inAppNotificationCloseButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollContent: {
		padding: spacing.md,
		paddingBottom: 108,
		gap: spacing.md,
		backgroundColor: colors.splash,
	},
	pageTitleWrap: {
		flex: 1,
	},
	pageTitle: {
		color: palette.text,
		fontSize: 22,
	},
	pageSubtitle: {
		color: colors.muted,
		fontSize: 13,
		lineHeight: 18,
	},
	fieldWrapper: {
		gap: spacing.xs,
	},
	fieldLabel: {
		color: colors.text,
		fontSize: 13,
		textTransform: 'uppercase',
	},
	textField: {
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: 14,
		fontSize: 15,
		color: colors.text,
	},
	textFieldMultiline: {
		minHeight: 110,
		textAlignVertical: 'top',
	},
	actionButton: {
		minHeight: 52,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.md,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	actionButtonFullWidth: {
		width: '100%',
	},
	actionButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	actionButtonIconLeft: {
		marginRight: 12,
	},
	actionButtonIconRight: {
		marginLeft: 12,
	},
	actionButtonPrimary: {
		backgroundColor: colors.primary,
	},
	actionButtonSecondary: {
		backgroundColor: colors.secondary,
	},
	actionButtonOutline: {
		backgroundColor: 'transparent',
		borderColor: colors.secondary,
	},
	actionButtonGhost: {
		backgroundColor: 'transparent',
	},
	actionButtonGhostText: {
		color: colors.text,
		fontSize: 17,
		textTransform: 'uppercase',
	},
	actionButtonPressed: {
		opacity: 0.85,
		transform: [{ scale: 0.99 }],
	},
	actionButtonDisabled: {
		opacity: 0.45,
	},
	actionButtonText: {
		color: colors.surface,
		fontSize: 15,
		textTransform: 'uppercase',
	},
	actionButtonTextOutline: {
		color: colors.secondary,
	},
	actionButtonTextGhost: {
		color: colors.primary,
	},
	feedbackModalBackdrop: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.28)',
		paddingHorizontal: screenGutter,
	},
	feedbackModalCard: {
		width: '100%',
		maxWidth: 360,
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.xl,
		gap: spacing.md,
		...unifiedShadow,
	},
	feedbackModalIconWrap: {
		width: 64,
		height: 64,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.splash,
	},
	feedbackModalTitle: {
		color: colors.secondary,
		fontSize: 20,
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	feedbackModalMessage: {
		color: colors.muted,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
	},
	feedbackModalButton: {
		width: '100%',
		minHeight: 44,
		marginTop: spacing.sm,
	},
	header: {
		backgroundColor: colors.secondary,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 18,
		paddingVertical: 14,
		height: 56,
		width: '100%',
		alignSelf: 'stretch',
		...unifiedShadow,
	},
	headerLeft: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	appHeaderTitle: {
		color: colors.surface,
		marginLeft: spacing.md,
		fontSize: 20,
		lineHeight: 22,
		textTransform: 'uppercase',
	},
	headerRight: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: spacing.sm,
	},
	headerActionButton: {
		marginTop: 1,
	},
	headerWrap: {
		gap: spacing.xs,
		marginBottom: spacing.sm,
	},
	backButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: cornerRadius,
		backgroundColor: colors.splash,
	},
	backButtonText: {
		color: colors.secondary,
		fontSize: 12,
		textTransform: 'uppercase',
	},
	headerTitle: {
		color: colors.text,
		fontSize: 26,
	},
	headerSubtitle: {
		color: colors.muted,
		fontSize: 14,
		lineHeight: 20,
	},
	sectionTitle: {
		color: colors.secondary,
		fontSize: 12,
		textTransform: 'uppercase',
	},
	infoText: {
		color: colors.text,
		fontSize: 14,
		lineHeight: 21,
	},
	chipRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	chip: {
		backgroundColor: colors.splash,
		borderWidth: 1,
		borderColor: colors.secondaryLight,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	chipActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	chipText: {
		color: colors.text,
		fontSize: 12,
	},
	chipTextActive: {
		color: colors.surface,
	},
	rowGap: {
		gap: spacing.sm,
	},
	bottomNav: {
		flexDirection: 'row',
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		height: 66,
		paddingTop: 8,
		paddingBottom: 10,
		paddingHorizontal: 6,
	},
	bottomNavItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 0,
	},
	bottomNavIcon: {
		width: '100%',
		height: 54,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomNavTabContent: {
		minWidth: 68,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: cornerRadius,
		paddingHorizontal: 6,
		paddingVertical: 5,
		gap: 2,
	},
	bottomNavTabContentActive: {
		backgroundColor: 'transparent',
	},
	bottomNavLabel: {
		color: colors.muted,
		width: '100%',
		fontSize: 10,
		textTransform: 'uppercase',
		textAlign: 'center',
	},
	bottomNavLabelActive: {
		color: colors.primary,
	},
})
