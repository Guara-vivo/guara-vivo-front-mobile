import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

// Botão "voltar" da faixa azul do Header (telas de perfil/configurações).
export function HeaderBackButton({ onPress }: { onPress: () => void }) {
	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel="Voltar"
			hitSlop={8}
			style={appStyles.headerActionButton}
		>
			<Ionicons name="chevron-back" size={24} color={colors.onColor} />
		</Pressable>
	)
}

export default HeaderBackButton
