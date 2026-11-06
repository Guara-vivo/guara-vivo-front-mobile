import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius, fontFamily } from '../constants/theme'
import { screenGutter, baseCard } from './shared'

export const homeStyles = StyleSheet.create<Record<string, any>>({
	card: {
		...baseCard,
		gap: spacing.md,
	},
	homeScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	homeContent: {
		flexGrow: 1,
		paddingHorizontal: screenGutter,
		paddingTop: spacing.xl,
		paddingBottom: spacing.lg,
	},
	homeBrand: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
		letterSpacing: 2,
	},
	homeBrandAccent: {
		color: colors.primary,
	},
	homeGreeting: {
		color: colors.text,
		fontSize: 43,
		lineHeight: 50,
		fontFamily: fontFamily.display,
		marginTop: spacing.lg,
	},
	homeDate: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
		marginTop: spacing.xs,
	},
	homeCta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		backgroundColor: colors.primary,
		borderRadius: radius.lg,
		padding: spacing.md,
		marginTop: spacing.lg,
		minHeight: 76,
	},
	homeCtaIcon: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primaryDark,
	},
	homeCtaText: {
		flex: 1,
	},
	homeCtaTitle: {
		color: colors.onColor,
		fontSize: fontSize.title,
		fontWeight: '700',
	},
	homeCtaHint: {
		color: colors.onColor,
		fontSize: fontSize.body,
		marginTop: 2,
	},
	homeStatRow: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	homeStat: {
		flex: 1,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.sm2,
	},
	homeStatValue: {
		color: colors.text,
		fontSize: 38,
		lineHeight: 43,
		fontFamily: fontFamily.display,
	},
	homeStatLabel: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 16,
		marginTop: 2,
	},
	homeStatSkeleton: {
		height: 43,
		justifyContent: 'center',
	},
	homeSkeletonLine: {
		marginTop: spacing.sm,
	},
	homeSyncSpinner: {
		width: 20,
		height: 20,
	},
	homeSectionTitle: {
		color: colors.text,
		fontSize: fontSize.title,
		fontWeight: '700',
		marginTop: spacing.lg,
		marginBottom: spacing.sm,
	},
	homeLatest: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.sm2,
	},
	homeLatestThumb: {
		width: 56,
		height: 56,
		borderRadius: radius.sm,
		backgroundColor: colors.field,
	},
	homeLatestThumbEmpty: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	homeLatestText: {
		flex: 1,
	},
	homeLatestTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	homeLatestSyncChip: {
		marginTop: spacing.xs,
	},
	homeLatestMeta: {
		color: colors.muted,
		fontSize: fontSize.body,
		marginTop: 2,
	},
	homeLatestChip: {
		backgroundColor: colors.blueSoft,
		borderRadius: radius.pill,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
	},
	homeLatestChipText: {
		color: colors.secondary,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	homeEmpty: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.md,
	},
	homeEmptyText: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 20,
	},
	homeSync: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginTop: spacing.lg,
	},
	homeSyncDot: {
		width: 20,
		height: 20,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.success,
	},
	homeSyncDotWarn: {
		backgroundColor: colors.warning,
	},
	homeSyncText: {
		flex: 1,
		color: colors.muted,
		fontSize: fontSize.body,
	},
})
