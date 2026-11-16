import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../../styles/appStyles'
import type { DetectionItem } from '../../types/records'
import { averageScore, formatPercent, isLowScore } from '../../utils/confidence'
import { getWarningMessages } from '../../utils/analysisWarnings'
import {
	BBOX_COLORS,
	getLifeStageLabel,
	getPlumageLabel,
} from '../../utils/detectionFormatters'
import { colors } from '../../constants/theme'

const ACCURACY_ITEMS = [
	{ key: 'deteccao_yolo' },
	{ key: 'classificacao_guara' },
	{ key: 'classificacao_cor' },
	{ key: 'classificacao_fase_vida' },
] as const

type Props = {
	detection: DetectionItem
	index: number
}

export function getDetectionScore(detection: DetectionItem): number | null {
	const acuracia = detection.raw_detection?.acuracia
	if (!acuracia) return null
	return averageScore(ACCURACY_ITEMS.map((item) => acuracia[item.key]))
}

function ScoreBar({ label, value }: { label: string; value: number | undefined }) {
	const { t } = useTranslation('detail')
	const known = typeof value === 'number' && Number.isFinite(value)
	const low = known && isLowScore(value)
	const width = known ? `${Math.max(0, Math.min(1, value)) * 100}%` : '0%'

	return (
		<View
			style={appStyles.recordImageBarRow}
			accessible
			accessibilityLabel={t(low ? 'detection.barA11yLow' : 'detection.barA11y', { label, value: formatPercent(value) })}
		>
			<View style={appStyles.recordImageBarLabelRow}>
				<Text style={appStyles.recordImageBarLabel}>{label}</Text>
				<Text style={appStyles.recordImageBarValue}>{formatPercent(value)}</Text>
			</View>
			<View style={appStyles.recordImageBarTrack}>
				<View
					style={[
						appStyles.recordImageBarFill,
						low && appStyles.recordImageBarFillLow,
						{ width: width as `${number}%` },
					]}
				/>
			</View>
		</View>
	)
}

// Um guará detectado: cor da caixa, nota geral e, ao tocar, barras por critério.
export function DetectionCard({ detection, index }: Props) {
	const { t } = useTranslation('detail')
	const [expanded, setExpanded] = useState(false)
	const color = BBOX_COLORS[index % BBOX_COLORS.length]
	const acuracia = detection.raw_detection?.acuracia
	const score = getDetectionScore(detection)
	const hasLowScore =
		acuracia !== undefined &&
		ACCURACY_ITEMS.some((item) => {
			const value = acuracia[item.key]
			return typeof value === 'number' && Number.isFinite(value) && isLowScore(value)
		})

	const warningMessages = getWarningMessages(detection.raw_detection?.avisos)
	const hasWarning = warningMessages.length > 0

	return (
		<View style={appStyles.recordImageDetection}>
			<Pressable
				onPress={() => setExpanded((current) => !current)}
				accessibilityRole="button"
				accessibilityLabel={t(hasWarning ? 'detection.a11yWarning' : 'detection.a11y', { n: index + 1, score: formatPercent(score) })}
				accessibilityState={{ expanded }}
				style={appStyles.recordImageDetectionHeader}
			>
				<View style={[appStyles.recordImageDetectionSwatch, { backgroundColor: color }]} />
				<View style={appStyles.recordImageDetectionInfo}>
					<Text style={appStyles.recordImageDetectionName}>{t('detection.name', { n: index + 1 })}</Text>
					<Text style={appStyles.recordImageDetectionMeta}>
						{getPlumageLabel(detection.color)} · {getLifeStageLabel(detection.age_group)}
						{hasWarning ? t('detection.withWarning') : ''}
					</Text>
				</View>
				<Text
					style={[
						appStyles.recordImageDetectionScore,
						score !== null && isLowScore(score) && appStyles.recordImageDetectionScoreLow,
					]}
				>
					{formatPercent(score)}
				</Text>
				<Ionicons
					name={expanded ? 'chevron-up' : 'chevron-down'}
					size={20}
					color={colors.muted}
				/>
			</Pressable>

			{expanded ? (
				<View style={appStyles.recordImageDetectionBody}>
					{acuracia ? (
						ACCURACY_ITEMS.map((item) => (
							<ScoreBar key={item.key} label={t(`detection.criteria.${item.key}`)} value={acuracia[item.key]} />
						))
					) : (
						<Text style={appStyles.recordImageDetectionMeta}>
							{t('detection.noScores')}
						</Text>
					)}
					{warningMessages.map((message) => (
						<Text key={message} style={appStyles.recordImageLowNotice} accessibilityRole="alert">
							{message}
						</Text>
					))}
					{hasLowScore ? (
						<Text style={appStyles.recordImageLowNotice} accessibilityRole="alert">
							{t('detection.lowNotice')}
						</Text>
					) : null}
				</View>
			) : null}
		</View>
	)
}
