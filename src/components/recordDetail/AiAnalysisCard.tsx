import React, { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import { averageScore, getConfidenceLevel, type ConfidenceLevel } from '../../utils/confidence'
import { getDetectionScore } from '../recordImage/DetectionCard'

const LEVEL_BADGE: Record<ConfidenceLevel, { label: string; box: object; text: object }> = {
	alta: {
		label: 'Alta confiança',
		box: appStyles.recordDetailBadgeHigh,
		text: appStyles.recordDetailBadgeTextHigh,
	},
	media: {
		label: 'Confiança média',
		box: appStyles.recordDetailBadgeMedium,
		text: appStyles.recordDetailBadgeTextMedium,
	},
	baixa: {
		label: 'Baixa confiança',
		box: appStyles.recordDetailBadgeLow,
		text: appStyles.recordDetailBadgeTextLow,
	},
}

type Props = {
	record: RecordDetailItem
	onOpen: () => void
}

// Cartão "Análise por IA": selo com a confiança média das detecções; toque abre a análise da primeira foto.
export function AiAnalysisCard({ record, onOpen }: Props) {
	const level = useMemo(() => {
		const scores = (record.image_analyses ?? []).flatMap((analysis) =>
			analysis.detections.map(getDetectionScore),
		)
		const score = averageScore(scores)
		return score === null ? null : getConfidenceLevel(score)
	}, [record.image_analyses])
	const analyzed = (record.image_analyses?.length ?? 0) > 0
	const hasImages = (record.images?.length ?? 0) > 0
	const badge = level ? LEVEL_BADGE[level] : null
	const waiting = !analyzed && (record.status === 'pending' || record.status === 'processing')
	const summary = analyzed
		? 'Veja as caixas, as notas e a confiança de cada guará detectado.'
		: waiting
			? 'A análise ainda está em andamento.'
			: 'Este registro não tem análise.'

	return (
		<Pressable
			onPress={onOpen}
			disabled={!hasImages}
			accessibilityRole="button"
			accessibilityLabel={`Análise por IA. ${badge ? badge.label : waiting ? 'Em análise' : 'Sem análise'}. Abrir`}
			style={appStyles.recordDetailCard}
		>
			<View style={appStyles.recordDetailCardHeader}>
				<View style={appStyles.recordDetailCardIcon}>
					<Ionicons name="sparkles-outline" size={20} color={colors.secondary} />
				</View>
				<View style={appStyles.recordDetailCardTitleWrap}>
					<Text style={appStyles.recordDetailCardTitle}>Análise por IA</Text>
					<Text style={appStyles.recordDetailCardText}>{summary}</Text>
				</View>
				{hasImages ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null}
			</View>
			<View style={[appStyles.recordDetailBadge, badge ? badge.box : appStyles.recordDetailBadgeNeutral]}>
				<Text style={[appStyles.recordDetailBadgeText, badge ? badge.text : null]}>
					{badge ? badge.label : waiting ? 'Em análise' : 'Sem análise'}
				</Text>
			</View>
		</Pressable>
	)
}
