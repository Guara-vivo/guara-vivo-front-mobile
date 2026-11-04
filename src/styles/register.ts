import { StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize, fontFamily } from '../constants/theme'
import { screenGutter } from './shared'

export const registerStyles = StyleSheet.create<Record<string, any>>({
	registerScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	registerStepHeader: {
		paddingHorizontal: screenGutter,
		paddingTop: spacing.md,
		gap: spacing.sm2,
	},
	registerStepTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	registerStepCount: {
		color: colors.muted,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	registerProgressRow: {
		flexDirection: 'row',
		gap: spacing.xs,
	},
	registerProgressSegment: {
		flex: 1,
		height: 4,
		borderRadius: radius.pill,
		backgroundColor: colors.border,
	},
	registerProgressSegmentOn: {
		backgroundColor: colors.primary,
	},
	registerStepTitle: {
		color: colors.text,
		fontSize: 35,
		lineHeight: 43,
		fontFamily: fontFamily.display,
		marginTop: spacing.sm,
	},
	registerStepHint: {
		color: colors.muted,
		fontSize: fontSize.bodyLarge,
	},
	registerScroll: {
		flex: 1,
	},
	registerContent: {
		paddingHorizontal: screenGutter,
		paddingBottom: spacing.md,
		paddingTop: spacing.md,
		gap: spacing.md,
	},
	registerSubsection: {
		gap: spacing.sm,
	},
	registerSubTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	registerSubTitleText: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '700',
	},
	registerDropZone: {
		minHeight: 160,
		borderWidth: 2,
		borderStyle: 'dashed',
		borderColor: colors.borderStrong,
		borderRadius: radius.lg,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing.md,
		gap: spacing.sm,
	},
	registerDropZonePressed: {
		backgroundColor: colors.blueSoft,
	},
	registerDropZoneIconWrap: {
		width: 56,
		height: 56,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.blueSoft,
	},
	registerDropZoneTitle: {
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	registerDropZoneHint: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
	registerImagePreviewGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm2,
	},
	registerImagePreviewWrap: {
		position: 'relative',
		width: 96,
		height: 96,
	},
	registerImagePreview: {
		width: 96,
		height: 96,
		borderRadius: radius.md,
		backgroundColor: colors.border,
	},
	registerImageRemoveButton: {
		position: 'absolute',
		top: -8,
		right: -8,
		width: 28,
		height: 28,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.text,
		borderWidth: 2,
		borderColor: colors.background,
	},
	registerImageRemoveButtonPressed: {
		opacity: 0.8,
	},
	registerBehaviorList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm2,
	},
	registerBehaviorItem: {
		flexBasis: '47%',
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 72,
		backgroundColor: colors.surface,
		borderRadius: radius.md,
		borderWidth: 2,
		borderColor: colors.border,
		paddingHorizontal: spacing.sm2,
		gap: spacing.sm,
	},
	registerBehaviorItemActive: {
		backgroundColor: colors.blueSoft,
		borderColor: colors.secondary,
	},
	registerCheckbox: {
		width: 22,
		height: 22,
		borderRadius: radius.pill,
		borderWidth: 2,
		borderColor: colors.borderStrong,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
	},
	registerCheckboxActive: {
		backgroundColor: colors.secondary,
		borderColor: colors.secondary,
	},
	registerBehaviorLabel: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
		fontWeight: '600',
	},
	registerDateRow: {
		flexDirection: 'row',
		gap: spacing.sm2,
	},
	registerDateField: {
		flex: 1,
		minHeight: 52,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		borderRadius: radius.md,
		backgroundColor: colors.field,
		paddingHorizontal: spacing.sm2,
	},
	registerDateFieldText: {
		flex: 1,
		color: colors.text,
		fontSize: fontSize.bodyLarge,
	},
	registerDateFieldPlaceholder: {
		color: colors.muted,
	},
	registerFieldError: {
		color: colors.dangerText,
		fontSize: fontSize.body,
	},
	registerFooter: {
		flexDirection: 'row',
		gap: spacing.sm2,
		paddingHorizontal: screenGutter,
		paddingVertical: spacing.sm2,
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	registerSaveButton: {
		flex: 1,
		minHeight: 52,
	},
	registerCancelButton: {
		flex: 1,
		minHeight: 52,
	},
	registerActionButtonLabel: {
		fontSize: fontSize.bodyLarge,
	},
})
