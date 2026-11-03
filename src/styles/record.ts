import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
import { screenGutter, screenBottomPadding, cornerRadius, unifiedShadow } from './shared'

export const recordStyles = StyleSheet.create<Record<string, any>>({
	analysisProgressWrap: {
		width: 38,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	analysisProgressText: {
		position: 'absolute',
		color: colors.text,
		fontSize: 7,
		lineHeight: 12,
		textAlign: 'center',
	},
	recordDetailScreen: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	recordDetailContent: {
		paddingHorizontal: screenGutter,
		paddingTop: spacing.lg,
		paddingBottom: screenBottomPadding,
		gap: spacing.lg,
	},
	recordDetailNotFoundWrap: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		paddingHorizontal: screenGutter,
		paddingVertical: spacing.lg,
	},
	recordDetailLoadingIcon: {
		marginBottom: spacing.sm,
	},
	recordDetailEmptyText: {
		color: colors.muted,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	recordDetailIdBadge: {
		flexShrink: 0,
		maxWidth: '30%',
		minWidth: 44,
		height: 30,
		borderRadius: cornerRadius,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.sm,
	},
	recordDetailIdText: {
		color: colors.surface,
		fontSize: fontSize.body,
		textTransform: 'uppercase',
	},
	recordDetailCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: 18,
		paddingVertical: 18,
		gap: spacing.sm,
		...unifiedShadow,
	},
	recordDetailSectionTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	recordDetailHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: spacing.sm,
	},
	recordDetailInfoHeaderTitle: {
		flex: 1,
	},
	recordDetailSectionTitle: {
		color: colors.secondary,
		fontSize: fontSize.bodyLarge,
		textTransform: 'uppercase',
	},
	recordDetailInfoList: {
		gap: spacing.sm,
	},
	recordDetailInfoRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.sm,
	},
	recordDetailInfoTextWrap: {
		flex: 1,
	},
	recordDetailInfoLabel: {
		color: colors.muted,
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	recordDetailValue: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		lineHeight: 20,
	},
	recordDetailCoordinates: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 17,
	},
	recordDetailChipRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	recordDetailChip: {
		borderRadius: cornerRadius,
		backgroundColor: colors.splash,
		paddingHorizontal: spacing.sm2,
		paddingVertical: 7,
	},
	recordDetailChipText: {
		color: colors.secondary,
		fontSize: fontSize.body,
	},
	recordDetailImageCarousel: {
		width: '100%',
		aspectRatio: 1.05,
		overflow: 'hidden',
		position: 'relative',
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
		borderRadius: cornerRadius,
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
		borderRadius: cornerRadius,
		backgroundColor: colors.border,
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
	},
	recordDetailCarouselCounter: {
		color: colors.muted,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	recordDetailCarouselArrow: {
		position: 'absolute',
		top: '50%',
		width: 42,
		height: 42,
		borderRadius: radius.pill,
		backgroundColor: 'rgba(117, 117, 117, 0.47)',
		alignItems: 'center',
		justifyContent: 'center',
		transform: [{ translateY: -21 }],
	},
	recordDetailCarouselArrowLeft: {
		left: 12,
	},
	recordDetailCarouselArrowRight: {
		right: 12,
	},
})
