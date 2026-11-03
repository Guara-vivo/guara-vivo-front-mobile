import { StyleSheet } from 'react-native'
import { colors, radius, spacing, fontSize } from '../constants/theme'
import { screenGutter, cornerRadius, unifiedShadow } from './shared'

export const registerStyles = StyleSheet.create<Record<string, any>>({
	registerScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	registerScroll: {
		flex: 1,
	},
	registerContent: {
		paddingHorizontal: screenGutter,
		paddingBottom: spacing.lg,
		paddingTop: spacing.lg,
	},
	registerCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingHorizontal: 14,
		paddingVertical: 14,
		...unifiedShadow,
		gap: 14,
	},
	registerSectionTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	registerSectionTitleTextBlue: {
		color: colors.secondary,
		fontSize: fontSize.bodyLarge,
		textTransform: 'uppercase',
	},
	registerSubsection: {
		gap: 10,
	},
	registerSubTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	registerSubTitleText: {
		color: colors.text,
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	registerDropZone: {
		minHeight: 110,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: colors.secondaryLight,
		borderRadius: cornerRadius,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16,
		gap: spacing.md,
	},
	registerDropZonePressed: {
		backgroundColor: colors.splash,
		opacity: 0.1,
		transform: [{ scale: 0.99 }],
	},
	registerDropZoneIconWrap: {
		width: 48,
		height: 48,
		alignItems: 'center',
		justifyContent: 'center',
	},
	registerDropZoneTitle: {
		color: colors.text,
		fontSize: fontSize.body,
		textAlign: 'center',
	},
	registerImagePreviewGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	registerImagePreviewWrap: {
		position: 'relative',
		width: 72,
		height: 72,
	},
	registerImagePreview: {
		width: 72,
		height: 72,
		borderRadius: cornerRadius,
		backgroundColor: colors.border,
	},
	registerImageRemoveButton: {
		position: 'absolute',
		top: -6,
		right: -6,
		width: 24,
		height: 24,
		borderRadius: radius.pill,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: colors.surface,
	},
	registerImageRemoveButtonPressed: {
		opacity: 0.8,
		transform: [{ scale: 0.96 }],
	},
	registerBehaviorList: {
		gap: spacing.md,
	},
	registerBehaviorItem: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 44,
		backgroundColor: colors.background,
		borderRadius: cornerRadius,
		paddingHorizontal: 12,
	},
	registerCheckbox: {
		width: 14,
		height: 14,
		borderWidth: 1,
		borderColor: colors.background,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	registerCheckboxActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	registerBehaviorLabel: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	registerDateRow: {
		flexDirection: 'row',
		gap: 10,
	},
	registerDateField: {
		flex: 1,
		minHeight: 42,
		borderRadius: cornerRadius,
		borderWidth: 1,
		borderColor: colors.secondaryLight,
		backgroundColor: colors.surface,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	registerDateFieldText: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	registerDateFieldPlaceholder: {
		color: colors.muted,
	},
	registerActionsRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 2,
	},
	registerSaveButton: {
		flex: 1,
		minHeight: 44,
		backgroundColor: colors.secondary,
	},
	registerCancelButton: {
		flex: 1,
		minHeight: 44,
		backgroundColor: colors.primary,
	},
	registerActionButtonLabel: {
		fontSize: fontSize.caption,
	},
})
