import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'

type Props = {
	isLoading: boolean
	loadError: boolean
}

// Lista vazia: carregando, erro de rede ou nenhum resultado para os filtros.
export function HistoryListEmpty({ isLoading, loadError }: Props) {
	const message = isLoading
		? 'Carregando registros...'
		: loadError
			? 'Não foi possível carregar os registros.'
			: 'Nenhum registro encontrado com os filtros atuais.'

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
