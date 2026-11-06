import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
import { screenGutter } from './shared'

export const recordImageStyles = StyleSheet.create<Record<string, any>>({
	recordImageModalScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	recordImageModalTopBar: {
		minHeight: 64,
		paddingHorizontal: screenGutter,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	recordImageModalTitle: {
		color: colors.text,
		fontSize: fontSize.title,
		fontWeight: '700',
	},
	recordImageModalContent: {
		paddingHorizontal: screenGutter,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	recordImageModalImageContainer: {
		width: '100%',
		height: 320,
		borderRadius: radius.lg,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: colors.text,
	},
	recordImageModalImage: {
		width: '100%',
		height: '100%',
	},
	recordImageModalImagePlaceholder: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	recordImageModalArrow: {
		position: 'absolute',
		top: '50%',
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		backgroundColor: colors.mediaBadge,
		alignItems: 'center',
		justifyContent: 'center',
		transform: [{ translateY: -22 }],
	},
	recordImageModalArrowLeft: {
		left: spacing.sm,
	},
	recordImageModalArrowRight: {
		right: spacing.sm,
	},
	recordImageModalIndexBadge: {
		position: 'absolute',
		left: spacing.sm2,
		bottom: spacing.sm2,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
		borderRadius: radius.pill,
		backgroundColor: colors.mediaBadge,
	},
	recordImageModalIndexText: {
		color: colors.onColor,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	recordImageModalSectionTitle: {
		color: colors.text,
		fontSize: fontSize.title,
		fontWeight: '700',
	},
	recordImageList: {
		gap: spacing.sm,
	},
	recordImageBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		padding: spacing.md,
		borderRadius: radius.md,
	},
	recordImageBannerHigh: {
		backgroundColor: colors.successSoft,
	},
	recordImageBannerMedium: {
		backgroundColor: colors.warningSoft,
	},
	recordImageBannerLow: {
		backgroundColor: colors.dangerBg,
	},
	recordImageBannerNeutral: {
		backgroundColor: colors.field,
	},
	recordImageBannerBody: {
		flex: 1,
		gap: 2,
	},
	recordImageBannerTitle: {
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	recordImageBannerText: {
		fontSize: fontSize.body,
		lineHeight: 20,
	},
	recordImageBannerTextHigh: {
		color: colors.success,
	},
	recordImageBannerTextMedium: {
		color: colors.warning,
	},
	recordImageBannerTextLow: {
		color: colors.dangerText,
	},
	recordImageBannerTextNeutral: {
		color: colors.muted,
	},
	recordImageDetection: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		overflow: 'hidden',
	},
	recordImageDetectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		padding: spacing.sm2,
		minHeight: 64,
	},
	recordImageDetectionSwatch: {
		width: 14,
		height: 14,
		borderRadius: radius.pill,
	},
	recordImageDetectionInfo: {
		flex: 1,
	},
	recordImageDetectionName: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	recordImageDetectionMeta: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	recordImageDetectionScore: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	recordImageDetectionScoreLow: {
		color: colors.warning,
	},
	recordImageDetectionBody: {
		paddingHorizontal: spacing.sm2,
		paddingBottom: spacing.sm2,
		gap: spacing.sm2,
	},
	recordImageBarRow: {
		gap: spacing.xs,
	},
	recordImageBarLabelRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	recordImageBarLabel: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	recordImageBarValue: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	recordImageBarTrack: {
		height: 8,
		borderRadius: radius.pill,
		backgroundColor: colors.border,
		overflow: 'hidden',
	},
	recordImageBarFill: {
		height: 8,
		borderRadius: radius.pill,
		backgroundColor: colors.secondary,
	},
	recordImageBarFillLow: {
		backgroundColor: colors.warning,
	},
	recordImageLowNotice: {
		color: colors.warning,
		fontSize: fontSize.body,
		lineHeight: 20,
	},
	recordImageEmpty: {
		padding: spacing.md,
		borderRadius: radius.md,
		backgroundColor: colors.field,
	},
	recordImageEmptyText: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
		textAlign: 'center',
	},
})
