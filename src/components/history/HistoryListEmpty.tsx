import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'

type Props = {
	isLoading: boolean
	loadError: boolean
}

// Lista vazia: carregando, erro de rede ou nenhum resultado para os filtros.
export function HistoryListEmpty({ isLoading, loadError }: Props) {
	const { t } = useTranslation('history')
	const message = isLoading
		? t('empty.loading')
		: loadError
			? t('empty.error')
			: t('empty.none')

	return (
		<View style={appStyles.historyEmptyWrap}>
			{isLoading ? (
				<ActivityIndicator
					color={colors.muted}
					size="small"
					style={appStyles.historyLoadingIcon}
				/>
			) : null}
			<Text style={appStyles.historyEmptyText}>{message}</Text>
		</View>
	)
}
