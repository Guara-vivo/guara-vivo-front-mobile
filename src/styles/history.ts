import { StyleSheet, ViewStyle } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
import { screenGutter, screenBottomPadding } from './shared'

export const historyStyles = StyleSheet.create<Record<string, any>>({
	historyScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	historyContent: {
		flexGrow: 1,
		paddingHorizontal: screenGutter,
		paddingBottom: screenBottomPadding,
		paddingTop: spacing.md,
		gap: spacing.sm2,
	},
	historyHeaderGroup: {
		gap: spacing.sm2,
	},
	historyDiscardButton: {
		marginTop: spacing.sm,
	},
	historySearchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	historySearchInputWrap: {
		flex: 1,
		minHeight: 48,
		borderRadius: radius.md,
		paddingHorizontal: spacing.sm2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		backgroundColor: colors.field,
	},
	historySearchInput: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		paddingVertical: 0,
	},
	historyFilterButton: {
		width: 48,
		height: 48,
		borderRadius: radius.md,
		backgroundColor: colors.field,
		alignItems: 'center',
		justifyContent: 'center',
	},
	historyFilterButtonDisabled: {
		opacity: 0.45,
	},
	historySortPill: {
		alignSelf: 'flex-start',
		minHeight: 36,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		paddingHorizontal: spacing.sm2,
		borderRadius: radius.pill,
		backgroundColor: colors.blueSoft,
	},
	historySortPillText: {
		color: colors.secondary,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	historyDayHeader: {
		color: colors.muted,
		fontSize: fontSize.body,
		fontWeight: '700',
		marginTop: spacing.sm,
	},
	historyRecordCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.sm2,
	},
	historyRecordThumb: {
		width: 72,
		height: 72,
		borderRadius: radius.sm,
		backgroundColor: colors.field,
		alignItems: 'center',
		justifyContent: 'center',
	},
	historyRecordBody: {
		flex: 1,
		gap: 2,
	},
	historyRecordTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	historyRecordTitleSkeleton: {
		marginVertical: 1,
	},
	historyRecordMeta: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	historyRecordSide: {
		alignItems: 'flex-end',
		justifyContent: 'center',
		gap: spacing.xs,
	},
	historyTagRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	historyTagChip: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.pill,
		backgroundColor: colors.blueSoft,
	},
	historyTagChipText: {
		color: colors.secondary,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	historySyncChip: {
		alignSelf: 'flex-start',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.pill,
		backgroundColor: colors.warningSoft,
	},
	historySyncChipFailed: {
		backgroundColor: colors.dangerBg,
	},
	historySyncChipText: {
		textAlign: 'center',
		includeFontPadding: false,
		color: colors.warning,
		fontSize: fontSize.caption,
		fontWeight: '700',
	},
	historySyncChipTextFailed: {
		color: colors.dangerText,
	},
	historyDetailButton: {
		minHeight: 44,
		paddingHorizontal: spacing.sm2,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.borderStrong,
		alignItems: 'center',
		justifyContent: 'center',
	},
	historyDetailButtonText: {
		color: colors.dangerText,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	historyEmptyWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		paddingHorizontal: spacing.md,
	},
	historyLoadingIcon: {
		marginBottom: spacing.sm,
	},
	historyEmptyText: {
		color: colors.muted,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	historyBottomSheetBackground: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	} as ViewStyle,
	historyBottomSheetIndicator: {
		backgroundColor: colors.border,
		width: 42,
	} as ViewStyle,
})
