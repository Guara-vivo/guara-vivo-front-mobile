import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import { formatPercent, type AccuracySummary } from '../../utils/detectionFormatters'
import { colors } from '../../constants/theme'

const SUMMARY_ITEMS = [
	{ label: 'Ave Detectada', key: 'deteccao_yolo' },
	{ label: 'Guará-vermelho', key: 'classificacao_guara' },
	{ label: 'Plumagem', key: 'classificacao_cor' },
	{ label: 'Fase da Vida', key: 'classificacao_fase_vida' },
] as const

export function AccuracySummarySection({ summary }: { summary: AccuracySummary }) {
	return (
		<View style={appStyles.recordImageModalSection}>
			<View style={appStyles.recordImageModalSectionTitleRow}>
				<Ionicons name="bar-chart-outline" size={16} color={colors.secondary} />
				<Text style={appStyles.recordImageModalSectionTitle}>RESUMO TÉCNICO</Text>
			</View>

			<View style={appStyles.recordImageModalSummaryGrid}>
				{SUMMARY_ITEMS.map((item) => (
					<View key={item.key} style={appStyles.recordImageModalAccuracyItem}>
						<Text style={appStyles.recordImageModalAccuracyLabel}>{item.label}</Text>
						<Text style={appStyles.recordImageModalAccuracyValue}>
							{formatPercent(summary[item.key])}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}
