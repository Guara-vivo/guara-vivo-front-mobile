import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { DetectionItem } from '../../types/records'
import {
	BBOX_COLORS,
	formatPercent,
	getLifeStageLabel,
	getPlumageLabel,
} from '../../utils/detectionFormatters'

const ACCURACY_ITEMS = [
	{ label: 'Ave', key: 'deteccao_yolo' },
	{ label: 'Guará', key: 'classificacao_guara' },
	{ label: 'Cor', key: 'classificacao_cor' },
	{ label: 'Fase', key: 'classificacao_fase_vida' },
] as const

type Props = {
	detection: DetectionItem
	index: number
}

// Um guará detectado: cor da caixa, plumagem, fase da vida e acuracias individuais.
export function DetectionCard({ detection, index }: Props) {
	const color = BBOX_COLORS[index % BBOX_COLORS.length]
	const acuracia = detection.raw_detection?.acuracia

	return (
		<View
			style={[
				appStyles.recordImageModalIbisItemExpanded,
				{ borderLeftColor: color, borderLeftWidth: 4 },
			]}
		>
			<View style={appStyles.recordImageModalIbisHeader}>
				<View
					style={[
						appStyles.recordImageModalIbisColorBadge,
						{ backgroundColor: color },
					]}
				>
					<Ionicons name="ellipse" size={14} color="#FFFFFF" />
				</View>
				<View style={appStyles.recordImageModalIbisInfo}>
					<Text style={appStyles.recordImageModalIbisIndex}>Guará {index + 1}</Text>
				</View>
			</View>

			<View style={appStyles.recordImageModalIbisDetails}>
				<View style={appStyles.recordImageModalDetailRow}>
					<Text style={appStyles.recordImageModalDetailLabel}>Plumagem:</Text>
					<Text style={appStyles.recordImageModalDetailValue}>
						{getPlumageLabel(detection.color)}
					</Text>
				</View>

				<View style={appStyles.recordImageModalDetailRow}>
					<Text style={appStyles.recordImageModalDetailLabel}>Fase da Vida:</Text>
					<Text style={appStyles.recordImageModalDetailValue}>
						{getLifeStageLabel(detection.age_group)}
					</Text>
				</View>

				{acuracia && (
					<View style={appStyles.recordImageModalAccuraciesContainer}>
						{ACCURACY_ITEMS.map((item) => (
							<View key={item.key} style={appStyles.recordImageModalAccuracySmall}>
								<Text style={appStyles.recordImageModalAccuracySmallLabel}>
									{item.label}
								</Text>
								<Text style={appStyles.recordImageModalAccuracySmallValue}>
									{formatPercent(acuracia[item.key])}
								</Text>
							</View>
						))}
					</View>
				)}
			</View>
		</View>
	)
}
