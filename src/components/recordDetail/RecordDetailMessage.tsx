import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { ActionButton } from '../common'
import { appStyles } from '../../styles/appStyles'
import { RecordDetailHeader } from './RecordDetailHeader'

type Props = {
	onBack: () => void
	message: string
	// Com isto, mostra o botão "Tentar de novo" (falha de carregamento, não registro inexistente).
	onRetry?: () => void
}

// Tela de estado: "Registro não encontrado." ou falha ao carregar (com tentar de novo).
export function RecordDetailMessage({ onBack, message, onRetry }: Props) {
	return (
		<View style={appStyles.recordDetailScreen}>
			<RecordDetailHeader onBack={onBack} />
			<View style={appStyles.recordDetailNotFoundWrap}>
				<View style={appStyles.recordDetailStateIcon}>
					<Ionicons
						name={onRetry ? 'cloud-offline-outline' : 'search-outline'}
						size={32}
						color={colors.secondary}
					/>
				</View>
				<Text style={appStyles.recordDetailEmptyText}>{message}</Text>
				{onRetry ? (
					<ActionButton
						title="Tentar de novo"
						fullWidth={false}
						leftIcon={<Ionicons name="refresh" size={20} color={colors.onColor} />}
						containerStyle={appStyles.recordDetailRetryButton}
						onPress={onRetry}
					/>
				) : null}
			</View>
		</View>
	)
}
