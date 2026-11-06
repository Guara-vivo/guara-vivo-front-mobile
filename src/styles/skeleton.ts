import { StyleSheet } from 'react-native'
import { colors } from '../constants/theme'

export const skeletonStyles = StyleSheet.create<Record<string, any>>({
	skeleton: {
		backgroundColor: colors.border,
	},
})
