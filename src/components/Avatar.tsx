import React from 'react'
import { Text, View } from 'react-native'
import { colors, radius } from '../constants/theme'
import { getInitials } from '../utils/initials'

// Círculo com as iniciais do nome (vermelho sobre fundo rosado).
export function Avatar({ name, size }: { name: string; size: number }) {
	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={{
				width: size,
				height: size,
				borderRadius: radius.pill,
				backgroundColor: colors.redSoft,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text
				style={{
					color: colors.dangerText,
					fontSize: size * 0.38,
					fontWeight: '700',
				}}
			>
				{getInitials(name)}
			</Text>
		</View>
	)
}

export default Avatar
