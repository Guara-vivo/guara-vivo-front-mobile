import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius, fontFamily } from '../constants/theme'
import { screenGutter, screenBottomPadding } from './shared'

export const recordStyles = StyleSheet.create<Record<string, any>>({
	analysisProgressWrap: {
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	analysisProgressTrack: {
		height: 6,
		borderRadius: radius.pill,
		backgroundColor: colors.field,
		overflow: 'hidden',
	},
	analysisProgressFill: {
		height: '100%',
		borderRadius: radius.pill,
		backgroundColor: colors.secondary,
	},
	analysisProgressLabel: {
		color: colors.secondary,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	analysisFailedChip: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		marginTop: spacing.xs,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
		borderRadius: radius.pill,
		backgroundColor: colors.redSoft,
	},
	analysisFailedText: {
		color: colors.dangerText,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	recordDetailScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	recordDetailContent: {
		paddingBottom: screenBottomPadding,
		gap: spacing.md,
	},
	recordDetailNotFoundWrap: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: screenGutter,
		paddingVertical: spacing.lg,
	},
	recordDetailSkeletonTitle: {
		marginVertical: spacing.xs,
	},
	recordDetailSkeletonBadge: {
		margin: spacing.md,
		marginTop: 0,
	},
	recordDetailSkeletonBlock: {
		gap: spacing.sm,
	},
	recordDetailRetryButton: {
		marginTop: spacing.md,
		paddingHorizontal: spacing.lg,
	},
	recordDetailEmptyText: {
		color: colors.muted,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	recordDetailHero: {
		width: '100%',
		aspectRatio: 1.1,
		position: 'relative',
		backgroundColor: colors.border,
	},
	recordDetailHeroBack: {
		position: 'absolute',
		top: spacing.sm2,
		left: spacing.md,
	},
	recordDetailHeroCounter: {
		position: 'absolute',
		right: spacing.md,
		bottom: spacing.md,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
		borderRadius: radius.pill,
		backgroundColor: colors.mediaBadge,
	},
	recordDetailHeroCounterText: {
		color: colors.onColor,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	recordDetailTitleBlock: {
		paddingHorizontal: screenGutter,
		gap: spacing.sm,
	},
	recordDetailTitle: {
		color: colors.text,
		fontSize: 38,
		lineHeight: 45,
		fontFamily: fontFamily.display,
	},
	recordDetailMeta: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
	},
	recordDetailChipRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	recordDetailChip: {
		borderRadius: radius.pill,
		backgroundColor: colors.blueSoft,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
	},
	recordDetailChipText: {
		color: colors.secondary,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	recordDetailCard: {
		marginHorizontal: screenGutter,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.md,
		gap: spacing.sm2,
	},
	recordDetailCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
	},
	recordDetailCardIcon: {
		width: 40,
		height: 40,
		borderRadius: radius.md,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.blueSoft,
	},
	recordDetailCardTitleWrap: {
		flex: 1,
	},
	recordDetailCardTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	recordDetailCardText: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 20,
	},
	recordDetailBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
		borderRadius: radius.pill,
	},
	recordDetailBadgeHigh: {
		backgroundColor: colors.successSoft,
	},
	recordDetailBadgeMedium: {
		backgroundColor: colors.warningSoft,
	},
	recordDetailBadgeLow: {
		backgroundColor: colors.dangerBg,
	},
	recordDetailBadgeNeutral: {
		backgroundColor: colors.field,
	},
	recordDetailBadgeText: {
		color: colors.muted,
		fontSize: fontSize.body,
		fontWeight: '700',
	},
	recordDetailBadgeTextHigh: {
		color: colors.success,
	},
	recordDetailBadgeTextMedium: {
		color: colors.warning,
	},
	recordDetailBadgeTextLow: {
		color: colors.dangerText,
	},
	recordDetailMiniMap: {
		height: 140,
		borderRadius: radius.md,
		overflow: 'hidden',
		backgroundColor: colors.field,
	},
	recordDetailMiniMapView: {
		flex: 1,
	},
	recordDetailCoordinates: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	recordDetailCarouselList: {
		width: '100%',
		height: '100%',
	},
	recordDetailCarouselSlide: {
		height: '100%',
	},
	recordDetailCarouselImagePressable: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.border,
		overflow: 'hidden',
	},
	recordDetailCarouselImage: {
		width: '100%',
		height: '100%',
	},
	recordDetailCarouselPlaceholder: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
	},
	recordDetailCarouselArrow: {
		position: 'absolute',
		top: '50%',
		width: 42,
		height: 42,
		borderRadius: radius.pill,
		backgroundColor: colors.mediaBadge,
		alignItems: 'center',
		justifyContent: 'center',
		transform: [{ translateY: -21 }],
	},
	recordDetailCarouselArrowLeft: {
		left: spacing.sm2,
	},
	recordDetailCarouselArrowRight: {
		right: spacing.sm2,
	},
})
