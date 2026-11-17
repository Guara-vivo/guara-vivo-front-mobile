import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../../styles/appStyles'
import { colors } from '../../constants/theme'

// Aviso para o admin que abre o registro de outra pessoa: de quem é.
export function AdminViewBanner({ authorName }: { authorName?: string | null }) {
	const { t } = useTranslation('detail')
	const author = authorName?.trim() || t('adminView.unknownAuthor')

	return (
		<View style={appStyles.recordDetailAdminBanner} accessibilityRole="summary">
			<Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} />
			<Text style={appStyles.recordDetailAdminBannerText}>
				<Text style={appStyles.recordDetailAdminBannerTitle}>{t('adminView.title')}. </Text>
				{t('adminView.body', { author })}
			</Text>
		</View>
	)
}
