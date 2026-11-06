import React from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import { RecordDetailHeader } from './RecordDetailHeader'

type Props = {
	onBack: () => void
	message: string
}

// Tela de estado: "Registro não encontrado.".
export function RecordDetailMessage({ onBack, message }: Props) {
	return (
		<View style={appStyles.recordDetailScreen}>
			<RecordDetailHeader onBack={onBack} />
			<View style={appStyles.recordDetailNotFoundWrap}>
				<Text style={appStyles.recordDetailEmptyText}>{message}</Text>
			</View>
		</View>
	)
}
