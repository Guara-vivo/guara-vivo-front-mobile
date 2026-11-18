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
	balloon: {
		...StyleSheet.absoluteFillObject,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		paddingLeft: spacing.md,
		paddingRight: spacing.sm,
		borderRadius: radius.md,
		backgroundColor: colors.surface,
		...overlayShadow,
	},
	balloonBody: {
		flex: 1,
		justifyContent: 'center',
		gap: 2,
	},
	balloonRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	balloonAuthor: {
		flex: 1,
		fontSize: fontSize.body,
		fontWeight: '700',
		color: colors.text,
	},
	balloonId: {
		fontSize: fontSize.body,
		fontWeight: '600',
		color: colors.muted,
	},
	balloonMeta: {
		fontSize: fontSize.caption,
		color: colors.muted,
	},
	// Pontinha: triângulo feito com bordas. Aponta para baixo (balão acima do marcador) ou para cima.
	balloonPointerDown: {
		position: 'absolute',
		bottom: -8,
		borderLeftWidth: 8,
		borderRightWidth: 8,
		borderTopWidth: 8,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: colors.surface,
	},
	balloonPointerUp: {
		position: 'absolute',
		top: -8,
		borderLeftWidth: 8,
		borderRightWidth: 8,
		borderBottomWidth: 8,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: colors.surface,
	},
	zonePressMarker: {
		width: 44,
		height: 44,
		borderRadius: radius.pill,
		backgroundColor: 'rgba(255, 255, 255, 0.01)',
		zIndex: 0,
	},
})
