import { StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize, fontFamily } from '../constants/theme'
import { screenGutter, cornerRadius, overlayShadow } from './shared'

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
		minHeight: 76,
		borderRadius: radius.lg,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.sm2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		...overlayShadow,
	},
	inAppNotificationBannerError: {
		borderColor: colors.redSoft,
	},
	inAppNotificationIconWrap: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.successSoft,
	},
	inAppNotificationIconWrapError: {
		backgroundColor: colors.redSoft,
	},
	inAppNotificationTextWrap: {
		flex: 1,
		gap: 2,
	},
	inAppNotificationTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	inAppNotificationMessage: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 19,
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
		color: colors.muted,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	textField: {
		backgroundColor: colors.field,
		borderWidth: 1.5,
		borderColor: 'transparent',
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		minHeight: 52,
		fontSize: fontSize.bodyLarge,
		color: colors.text,
	},
	textFieldFocused: {
		backgroundColor: colors.surface,
		borderColor: colors.secondary,
	},
	textFieldMultiline: {
		minHeight: 110,
		textAlignVertical: 'top',
	},
	actionButton: {
		minHeight: 52,
		borderRadius: radius.lg,
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
		backgroundColor: 'transparent',
		borderColor: colors.borderStrong,
	},
	actionButtonOutline: {
		backgroundColor: colors.blueSoft,
		borderColor: colors.blueSoft,
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
		color: colors.onColor,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	actionButtonTextSecondary: {
		color: colors.text,
	},
	actionButtonTextOutline: {
		color: colors.secondary,
	},
	actionButtonTextGhost: {
		color: colors.secondary,
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
		backgroundColor: colors.background,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		height: 64,
		width: '100%',
		alignSelf: 'stretch',
	},
	headerLeft: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	appHeaderTitle: {
		color: colors.text,
		marginLeft: spacing.sm2,
		fontSize: fontSize.display + 6,
		lineHeight: 40,
		fontFamily: fontFamily.display,
	},
	headerRight: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: spacing.sm,
	},
	headerActionButton: {
		width: 40,
		height: 40,
		borderRadius: radius.pill,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: 'center',
		justifyContent: 'center',
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
	},
	bottomNav: {
		flexDirection: 'row',
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		height: 72,
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
		alignItems: 'center',
		justifyContent: 'center',
		gap: 3,
	},
	bottomNavTabContentActive: {},
	bottomNavPill: {
		width: 52,
		height: 30,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomNavPillActive: {
		backgroundColor: colors.blueSoft,
	},
	bottomNavRegisterButton: {
		width: 48,
		height: 48,
		borderRadius: radius.pill,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomNavLabel: {
		color: colors.muted,
		width: '100%',
		fontSize: fontSize.micro,
		fontWeight: '500',
		textAlign: 'center',
	},
	bottomNavLabelActive: {
		color: colors.secondary,
		fontWeight: '700',
	},
	bottomNavLabelRegister: {
		color: colors.primary,
		fontWeight: '700',
	},
})
