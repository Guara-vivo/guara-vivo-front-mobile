import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
import { overlayShadow } from './shared'

export const mapsStyles = StyleSheet.create<Record<string, any>>({
	mapsScreen: {
		flex: 1,
		backgroundColor: colors.background,
	},
	mapsMapArea: {
		flex: 1,
		position: 'relative',
	},
	mapsChipsRow: {
		position: 'absolute',
		top: spacing.sm2,
		left: spacing.md,
		right: spacing.md,
		zIndex: 10,
		flexDirection: 'row',
		gap: spacing.sm,
	},
	mapsChip: {
		minHeight: 40,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		paddingHorizontal: spacing.sm2,
		borderRadius: radius.pill,
		backgroundColor: colors.surface,
		...overlayShadow,
	},
	mapsChipActive: {
		backgroundColor: colors.secondary,
	},
	mapsChipDot: {
		width: 10,
		height: 10,
		borderRadius: radius.pill,
		backgroundColor: colors.primary,
		borderWidth: 1.5,
		borderColor: colors.surface,
	},
	mapsChipDotNest: {
		backgroundColor: colors.secondary,
	},
	mapsChipLabel: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
	mapsChipLabelActive: {
		color: colors.onColor,
	},
	mapsCountPill: {
		position: 'absolute',
		top: 64,
		left: spacing.md,
		zIndex: 10,
		paddingHorizontal: spacing.sm2,
		paddingVertical: spacing.xs,
		borderRadius: radius.pill,
		backgroundColor: colors.overlaySurface,
		...overlayShadow,
	},
	mapsCountText: {
		color: colors.text,
		fontSize: fontSize.caption,
		fontWeight: '600',
	},
	mapsSideButtons: {
		position: 'absolute',
		right: spacing.md,
		bottom: spacing.md,
		zIndex: 10,
		gap: spacing.sm2,
	},
	mapsSideButton: {
		width: 48,
		height: 48,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.surface,
		...overlayShadow,
	},
	mapsSideButtonAccent: {
		backgroundColor: colors.primary,
	},
	mapsSideButtonDisabled: {
		opacity: 0.6,
	},
	mapsErrorBanner: {
		position: 'absolute',
		top: 100,
		left: spacing.md,
		right: spacing.md,
		zIndex: 10,
	},
	mapSelectionInstructionOverlay: {
		position: 'absolute',
		top: 112,
		left: spacing.md,
		right: spacing.md,
		zIndex: 10,
		alignItems: 'center',
	},
	mapSelectionInstructionPill: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: radius.pill,
		backgroundColor: colors.text,
	},
	mapSelectionInstructionText: {
		color: colors.onColor,
		fontSize: fontSize.body,
		fontWeight: '600',
	},
})
