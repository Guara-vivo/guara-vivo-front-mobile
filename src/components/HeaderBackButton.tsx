import React from 'react'
import { Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

// Botão "voltar" circular do Header (telas de perfil, configurações e detalhe).
export function HeaderBackButton({ onPress }: { onPress: () => void }) {
	const { t } = useTranslation('common')

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={t('back')}
			hitSlop={4}
			style={appStyles.headerActionButton}
		>
			<Ionicons name="chevron-back" size={22} color={colors.text} />
		</Pressable>
	)
}

export default HeaderBackButton
