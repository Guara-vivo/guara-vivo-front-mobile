import { StyleSheet } from 'react-native'
import { colors, fontSize, radius, spacing } from '../../constants/theme'
import { overlayShadow } from '../../styles/shared'

export const mapViewStyles = StyleSheet.create({
	container: {
		flex: 1,
		minHeight: 430,
		overflow: 'hidden',
		backgroundColor: '#F4F5F7',
	},
	mapView: {
		flex: 1,
		width: '100%',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(244, 245, 247, 0.2)',
	},
	recordsLoadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
	recordsLoadingPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm2,
		borderRadius: radius.pill,
		backgroundColor: colors.surface,
		...overlayShadow,
	},
	loadingText: {
		fontSize: fontSize.body,
		fontWeight: '600',
		color: colors.text,
	},
	zonePressMarker: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		backgroundColor: 'rgba(255, 255, 255, 0.01)',
		zIndex: 0,
	},
})
