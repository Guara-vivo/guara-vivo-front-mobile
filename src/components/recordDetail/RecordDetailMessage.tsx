import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import { RecordDetailHeader } from './RecordDetailHeader'

type Props = {
	onBack: () => void
	message: string
	loading?: boolean
}

// Tela de estado: "Carregando registro..." ou "Registro não encontrado.".
export function RecordDetailMessage({ onBack, message, loading }: Props) {
	return (
		<View style={appStyles.recordDetailScreen}>
			<RecordDetailHeader onBack={onBack} />
			<View style={appStyles.recordDetailNotFoundWrap}>
				{loading && (
					<ActivityIndicator
						color={colors.muted}
						size="small"
						style={appStyles.recordDetailLoadingIcon}
					/>
				)}
				<Text style={appStyles.recordDetailEmptyText}>{message}</Text>
			</View>
		</View>
	)
}
