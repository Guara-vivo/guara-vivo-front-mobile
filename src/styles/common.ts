import { StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize } from '../constants/theme'
import { screenGutter, cornerRadius, unifiedShadow, overlayShadow } from './shared'

export const commonStyles = StyleSheet.create<Record<string, any>>({
	app: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	screen: {
		flex: 1,
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
		borderLeftColor: colors.success,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		...overlayShadow,
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
		fontSize: fontSize.body,
	},
	inAppNotificationMessage: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 17,
	},
	inAppNotificationCloseButton: {
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fieldWrapper: {
		gap: spacing.xs,
	},
	fieldLabel: {
		color: colors.text,
		fontSize: fontSize.body,
		textTransform: 'uppercase',
	},
	textField: {
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		fontSize: fontSize.bodyLarge,
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
		marginRight: spacing.sm2,
	},
	actionButtonIconRight: {
		marginLeft: spacing.sm2,
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
	actionButtonPressed: {
		opacity: 0.85,
		transform: [{ scale: 0.99 }],
	},
	actionButtonDisabled: {
		opacity: 0.45,
	},
	actionButtonText: {
		color: colors.surface,
		fontSize: fontSize.bodyLarge,
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
		backgroundColor: colors.scrimSoft,
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
		...overlayShadow,
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
		fontSize: fontSize.title,
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	feedbackModalMessage: {
		color: colors.muted,
		fontSize: fontSize.body,
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
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
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
		fontSize: fontSize.title,
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
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	headerTitle: {
		color: colors.text,
		fontSize: fontSize.display,
	},
	headerSubtitle: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 20,
	},
	sectionTitle: {
		color: colors.secondary,
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	bottomNav: {
		flexDirection: 'row',
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		height: 66,
		// Sem padding vertical: o conjunto ícone + rótulo centraliza na altura da barra.
		paddingTop: 0,
		paddingBottom: 0,
		paddingHorizontal: spacing.sm,
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
		minWidth: 0,
		width: '100%',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: cornerRadius,
		paddingHorizontal: 0,
		paddingVertical: spacing.xs,
		gap: 2,
	},
	bottomNavTabContentActive: {
		backgroundColor: 'transparent',
	},
	bottomNavLabel: {
		color: colors.muted,
		width: '100%',
		fontSize: fontSize.micro,
		textTransform: 'uppercase',
		textAlign: 'center',
	},
	bottomNavLabelActive: {
		color: colors.primary,
	},
})
