import { StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../constants/theme'
import { screenGutter, cornerRadius, unifiedShadow, palette, baseCard, basePrimaryButton } from './shared'

export const homeStyles = StyleSheet.create<Record<string, any>>({
	card: {
		...baseCard,
		gap: spacing.md,
	},
	homeContent: {
		flexGrow: 1,
		backgroundColor: palette.background,
		paddingHorizontal: screenGutter,
		paddingTop: '25%',
		paddingBottom: spacing.lg,
		gap: spacing.md,
	},
	homeScreen: {
		flex: 1,
	},
	homeHeader: {
		alignItems: 'center',
		marginTop: spacing.lg,
	},
	homeLogo: {
		width: '100%',
		maxWidth: 300,
		height: 180,
	},
	homeKicker: {
		color: palette.text,
		fontSize: fontSize.bodyLarge,
		textTransform: 'uppercase',
	},
	homeSubtitle: {
		color: colors.muted,
		fontSize: fontSize.caption,
		lineHeight: 16,
		textAlign: 'center',
		maxWidth: 250,
	},
	homePrimaryButton: {
		...basePrimaryButton,
		minHeight: 78,
		backgroundColor: palette.primary,
	},
	homePrimaryButtonLabel: {
		fontSize: fontSize.bodyLarge,
	},
	homeShortcutRow: {
		flexDirection: 'row',
		gap: spacing.md,
		justifyContent: 'space-between',
	},
	homeShortcutCard: {
		flex: 1,
		minHeight: 140,
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		...unifiedShadow,
	},
	homeShortcutIconBox: {
		width: 54,
		height: 54,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	homeShortcutLabel: {
		color: colors.secondary,
		fontSize: fontSize.body,
		textTransform: 'uppercase',
	},
})
