import { StyleSheet } from 'react-native'
import { colors } from '../../constants/theme'

export const registerStyles = StyleSheet.create({
	locationFieldContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 6,
	},
	locationClearButton: {
		paddingLeft: 8,
	},
	locationPickerOverlay: {
		...StyleSheet.absoluteFillObject,
		zIndex: 1000,
		backgroundColor: colors.background,
	},
	pickerMap: {
		...StyleSheet.absoluteFillObject,
	},
	pickerHeader: {
		position: 'absolute',
		top: 50,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		zIndex: 1001,
	},
	pickerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		gap: 4,
		borderWidth: 1,
		borderColor: colors.border,
	},
	pickerButtonText: {
		color: colors.text,
		fontSize: 14,
		fontWeight: '600',
	},
	pickerButtonConfirmText: {
		color: colors.secondary,
		fontSize: 14,
		fontWeight: '700',
	},
})
