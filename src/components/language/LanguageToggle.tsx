import React from 'react'
import { Pressable, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { currentLanguage, otherLanguage } from '../../i18n'
import { setLanguage } from '../../i18n/storage'
import { appStyles } from '../../styles/appStyles'
import { Flag } from './Flag'

// Bandeirinha das telas de entrada (boas-vindas e login). Mostra o idioma atual; o toque
// troca para o outro. O rótulo de acessibilidade diz para qual idioma vai trocar.
export function LanguageToggle() {
	const { t } = useTranslation()
	const current = currentLanguage()
	const next = otherLanguage(current)
	const label = t('common:language.switchTo', { language: t(`common:language.names.${next}`) })

	return (
		<Pressable
			onPress={() => void setLanguage(next)}
			accessibilityRole="button"
			accessibilityLabel={label}
			hitSlop={8}
			style={appStyles.languageToggle}
		>
			<Flag language={current} />
			<Text style={appStyles.languageToggleText}>{current === 'pt-BR' ? 'PT' : 'EN'}</Text>
		</Pressable>
	)
}
