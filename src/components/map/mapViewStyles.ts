import { StyleSheet } from 'react-native'
import { colors, fontSize, radius, spacing } from '../../constants/theme'

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
		backgroundColor: 'rgba(244, 245, 247, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: spacing.md,
	},
	loadingText: {
		fontSize: fontSize.body,
		color: colors.muted,
	},
	zonePressMarker: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		backgroundColor: 'rgba(255, 255, 255, 0.01)',
		zIndex: 0,
	},
	recordMarkerOuter: {
		minWidth: 28,
		height: 28,
		borderRadius: 18,
		paddingHorizontal: spacing.xs,
		backgroundColor: colors.primary,
		borderWidth: 2,
		borderColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		shadowColor: colors.primary,
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		elevation: 5,
	},
	recordMarkerOuterFocused: {
		backgroundColor: colors.secondary,
		borderColor: colors.surface,
		shadowColor: colors.secondary,
		shadowOpacity: 0.35,
		shadowRadius: 8,
		elevation: 8,
	},
	recordMarkerInner: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	recordMarkerText: {
		color: colors.onColor,
		fontSize: fontSize.caption,
		fontWeight: '900',
		lineHeight: 10,
	},
})
