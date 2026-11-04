import { StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize } from '../constants/theme'

export const datePickerStyles = StyleSheet.create<Record<string, any>>({
	dateSheetContent: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.lg,
		gap: spacing.sm2,
	},
	dateSheetTitle: {
		color: colors.text,
		fontSize: fontSize.title,
		fontWeight: '700',
	},
	dateShortcutRow: {
		flexDirection: 'row',
		gap: spacing.sm,
	},
	dateShortcut: {
		minHeight: 40,
		paddingHorizontal: spacing.md,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.field,
	},
	dateShortcutActive: {
		backgroundColor: colors.blueSoft,
	},
	dateShortcutText: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	dateShortcutTextActive: {
		color: colors.secondary,
	},
	dateMonthRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	dateMonthTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '700',
	},
	dateMonthButton: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateMonthButtonDisabled: {
		opacity: 0.35,
	},
	dateWeekRow: {
		flexDirection: 'row',
	},
	dateWeekLabel: {
		flex: 1,
		textAlign: 'center',
		color: colors.muted,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	dateGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	dateCell: {
		width: '14.2857%',
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateDay: {
		width: 40,
		height: 40,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateDaySelected: {
		backgroundColor: colors.primary,
	},
	dateDayText: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
	},
	dateDayTextSelected: {
		color: colors.onColor,
		fontWeight: '700',
	},
	dateDayTextDisabled: {
		color: colors.borderStrong,
	},
	dateSheetActions: {
		flexDirection: 'row',
		gap: spacing.sm2,
		marginTop: spacing.sm,
	},
	dateSheetAction: {
		flex: 1,
	},
})
