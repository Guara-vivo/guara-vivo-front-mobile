import { StyleSheet, ViewStyle } from 'react-native'
import { colors, fontFamily, fontSize, radius, spacing } from '../constants/theme'

// Folha de filtros do histórico: seções em cartões, campos com rótulo e comportamentos em chips.
export const filtersStyles = StyleSheet.create<Record<string, any>>({
	filterHeader: {
		paddingHorizontal: spacing.md,
		paddingTop: spacing.xs,
		paddingBottom: spacing.sm2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	filterTitle: {
		color: colors.text,
		fontSize: fontSize.display,
		fontFamily: fontFamily.display,
	},
	filterClose: {
		width: 40,
		height: 40,
		borderRadius: radius.pill,
		backgroundColor: colors.field,
		alignItems: 'center',
		justifyContent: 'center',
	},
	filterContent: {
		paddingHorizontal: spacing.md,
		paddingTop: spacing.xs,
		paddingBottom: spacing.md,
		gap: spacing.sm2,
	},
	filterSection: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		overflow: 'hidden',
	} as ViewStyle,
	filterSectionHeader: {
		minHeight: 56,
		paddingHorizontal: spacing.sm2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
	},
	filterSectionIcon: {
		width: 36,
		height: 36,
		borderRadius: radius.sm,
		backgroundColor: colors.blueSoft,
		alignItems: 'center',
		justifyContent: 'center',
	},
	filterSectionTitle: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	filterSectionBody: {
		paddingHorizontal: spacing.sm2,
		paddingBottom: spacing.sm2,
		gap: spacing.sm2,
	},
	filterRow: {
		flexDirection: 'row',
		gap: spacing.sm2,
	},
	filterColumn: {
		flex: 1,
		gap: spacing.xs,
	},
	filterLabel: {
		color: colors.muted,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	filterField: {
		minHeight: 48,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.field,
		paddingHorizontal: spacing.sm2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	filterFieldPressable: {
		flex: 1,
		minHeight: 48,
		justifyContent: 'center',
	},
	// Texto (não input) dentro do botão de data: sem flex, senão ele encosta no topo.
	filterFieldText: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
	},
	filterFieldInput: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		paddingVertical: 0,
	},
	filterPicker: {
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.field,
		overflow: 'hidden',
	} as ViewStyle,
	filterPickerInput: {
		color: colors.text,
	} as ViewStyle,
	filterNotice: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.sm,
		borderRadius: radius.sm,
		backgroundColor: colors.warningSoft,
		padding: spacing.sm2,
	},
	filterNoticeText: {
		flex: 1,
		color: colors.warning,
		fontSize: fontSize.body,
	},
	filterFieldPlaceholder: {
		color: colors.placeholder,
	},
	filterChipRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	filterChip: {
		minHeight: 40,
		borderRadius: radius.pill,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.field,
		paddingHorizontal: spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	filterChipActive: {
		backgroundColor: colors.secondary,
		borderColor: colors.secondary,
	},
	filterChipText: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	filterChipTextActive: {
		color: colors.onColor,
	},
	filterActions: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingHorizontal: spacing.md,
		paddingTop: spacing.sm2,
		paddingBottom: spacing.md,
		flexDirection: 'row',
		gap: spacing.sm2,
	},
	filterAction: {
		flex: 1,
	},
})
