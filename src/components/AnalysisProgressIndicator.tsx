import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'

type AnalysisProgressIndicatorProps = {
	progress: number
	status?: RecordItem['status']
}

// Barra de progresso da análise no cartão do histórico. Concluída não mostra nada (o aviso
// de "Análise finalizada" já cobre); falha aparece como chip vermelho.
export function AnalysisProgressIndicator({
	progress,
	status,
}: AnalysisProgressIndicatorProps) {
	const { t } = useTranslation('records')

	if (status === 'completed') {
		return null
	}

	if (status === 'failed') {
		return (
			<View
				accessible
				accessibilityRole="alert"
				accessibilityLabel={t('analysis.failed')}
				style={appStyles.analysisFailedChip}
			>
				<Ionicons name="alert-circle" size={14} color={colors.dangerText} />
				<Text style={appStyles.analysisFailedText}>{t('analysis.failed')}</Text>
			</View>
		)
	}

	const percent = Math.min(Math.max(Math.round(progress), 0), 100)
	const isQueued = status === 'pending' && percent === 0
	const label = isQueued ? t('analysis.queued') : t('analysis.running', { percent })

	return (
		<View
			accessible
			accessibilityRole="progressbar"
			accessibilityLabel={isQueued ? t('analysis.queuedA11y') : t('analysis.runningA11y', { percent })}
			accessibilityValue={{ min: 0, max: 100, now: percent }}
			style={appStyles.analysisProgressWrap}
		>
			<View style={appStyles.analysisProgressTrack}>
				<View style={[appStyles.analysisProgressFill, { width: `${percent}%` }]} />
			</View>
			<Text style={appStyles.analysisProgressLabel}>{label}</Text>
		</View>
	)
}

export default AnalysisProgressIndicator
