import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { DetectionItem } from '../../types/records'
import { averageScore, formatPercent, isLowScore } from '../../utils/confidence'
import {
	BBOX_COLORS,
	getLifeStageLabel,
	getPlumageLabel,
} from '../../utils/detectionFormatters'
import { colors } from '../../constants/theme'

const ACCURACY_ITEMS = [
	{ label: 'Ave detectada', key: 'deteccao_yolo' },
	{ label: 'Guará-vermelho', key: 'classificacao_guara' },
	{ label: 'Cor da plumagem', key: 'classificacao_cor' },
	{ label: 'Fase da vida', key: 'classificacao_fase_vida' },
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
	const known = typeof value === 'number' && Number.isFinite(value)
	const low = known && isLowScore(value)
	const width = known ? `${Math.max(0, Math.min(1, value)) * 100}%` : '0%'

	return (
		<View
			style={appStyles.recordImageBarRow}
			accessible
			accessibilityLabel={`${label}: ${formatPercent(value)}${low ? ', nota baixa' : ''}`}
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

	return (
		<View style={appStyles.recordImageDetection}>
			<Pressable
				onPress={() => setExpanded((current) => !current)}
				accessibilityRole="button"
				accessibilityLabel={`Guará ${index + 1}, nota geral ${formatPercent(score)}`}
				accessibilityState={{ expanded }}
				style={appStyles.recordImageDetectionHeader}
			>
				<View style={[appStyles.recordImageDetectionSwatch, { backgroundColor: color }]} />
				<View style={appStyles.recordImageDetectionInfo}>
					<Text style={appStyles.recordImageDetectionName}>Guará {index + 1}</Text>
					<Text style={appStyles.recordImageDetectionMeta}>
						{getPlumageLabel(detection.color)} · {getLifeStageLabel(detection.age_group)}
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
							<ScoreBar key={item.key} label={item.label} value={acuracia[item.key]} />
						))
					) : (
						<Text style={appStyles.recordImageDetectionMeta}>
							Esta detecção não trouxe notas detalhadas.
						</Text>
					)}
					{hasLowScore ? (
						<Text style={appStyles.recordImageLowNotice} accessibilityRole="alert">
							Alguma nota está abaixo de 70%. Confira este guará na foto.
						</Text>
					) : null}
				</View>
			) : null}
		</View>
	)
}
