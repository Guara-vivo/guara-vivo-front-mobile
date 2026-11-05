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
})
