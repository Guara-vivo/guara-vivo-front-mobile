import React, { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors } from '../../constants/theme'
import { Skeleton } from '../Skeleton'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import { averageScore, getConfidenceLevel, type ConfidenceLevel } from '../../utils/confidence'
import { getDetectionScore } from '../recordImage/DetectionCard'

const LEVEL_BADGE: Record<ConfidenceLevel, { labelKey: 'high' | 'medium' | 'low'; box: object; text: object }> = {
	alta: {
		labelKey: 'high',
		box: appStyles.recordDetailBadgeHigh,
		text: appStyles.recordDetailBadgeTextHigh,
	},
	media: {
		labelKey: 'medium',
		box: appStyles.recordDetailBadgeMedium,
		text: appStyles.recordDetailBadgeTextMedium,
	},
	baixa: {
		labelKey: 'low',
		box: appStyles.recordDetailBadgeLow,
		text: appStyles.recordDetailBadgeTextLow,
	},
}

type Props = {
	record: RecordDetailItem
	onOpen: () => void
	// O detalhe completo (com as análises) ainda está chegando.
	loading?: boolean
}

// Cartão "Análise por IA": selo com a confiança média das detecções; toque abre a análise da primeira foto.
export function AiAnalysisCard({ record, onOpen, loading = false }: Props) {
	const { t } = useTranslation('detail')
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
	const stateLabel = badge
		? t(`ai.${badge.labelKey}`)
		: waiting
			? t('ai.waiting')
			: t('ai.none')
	const summary = analyzed
		? t('ai.summaryDone')
		: waiting
			? t('ai.summaryWaiting')
			: t('ai.summaryNone')

	if (loading) {
		return (
			<View style={appStyles.recordDetailCard} accessibilityLabel={t('ai.loading')} accessibilityLiveRegion="polite">
				<View style={appStyles.recordDetailCardHeader}>
					<View style={appStyles.recordDetailCardIcon}>
						<Ionicons name="sparkles-outline" size={20} color={colors.secondary} />
					</View>
					<View style={appStyles.recordDetailCardTitleWrap}>
						<Text style={appStyles.recordDetailCardTitle}>{t('ai.title')}</Text>
						<Skeleton width="80%" height={14} />
					</View>
				</View>
				<Skeleton width={110} height={24} radius={999} style={appStyles.recordDetailSkeletonBadge} />
			</View>
		)
	}

	return (
		<Pressable
			onPress={onOpen}
			disabled={!hasImages}
			accessibilityRole="button"
			accessibilityLabel={t('ai.a11y', { state: stateLabel })}
			style={appStyles.recordDetailCard}
		>
			<View style={appStyles.recordDetailCardHeader}>
				<View style={appStyles.recordDetailCardIcon}>
					<Ionicons name="sparkles-outline" size={20} color={colors.secondary} />
				</View>
				<View style={appStyles.recordDetailCardTitleWrap}>
					<Text style={appStyles.recordDetailCardTitle}>{t('ai.title')}</Text>
					<Text style={appStyles.recordDetailCardText}>{summary}</Text>
				</View>
				{hasImages ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null}
			</View>
			<View style={[appStyles.recordDetailBadge, badge ? badge.box : appStyles.recordDetailBadgeNeutral]}>
				<Text style={[appStyles.recordDetailBadgeText, badge ? badge.text : null]}>
					{stateLabel}
				</Text>
			</View>
		</Pressable>
	)
}
