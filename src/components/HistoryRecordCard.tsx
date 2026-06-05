import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
	formatDate,
	formatTime,
} from '../utils/recordFormatters'
import AnalysisProgressIndicator from './AnalysisProgressIndicator'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'

export function HistoryRecordCard({
	item,
	analysisProgress,
	onOpenRecord,
}: {
	item: RecordItem
	analysisProgress: number
	onOpenRecord: (id: number) => void
}) {
	const behaviorTags = String(item.flock_size)
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
	const areaLabel = item.map_zones.length
		? item.map_zones.map((zone) => zone.name).join(' · ')
		: 'Sem área'

	return (
		<View style={appStyles.historyRecordCard}>
			<View style={appStyles.historyRecordTopRow}>
				<View style={appStyles.historyRecordTopInfo}>
					<View style={appStyles.historyRecordIdBadge}>
						<Text style={appStyles.historyRecordIdText}>
							#{String(item.id).padStart(3, '0')}
						</Text>
					</View>

					<View style={appStyles.historyRecordDateRow}>
						<Ionicons name="calendar-outline" size={18} color="#5C8BD6" />
						<Text style={appStyles.historyRecordDateText}>
							{formatDate(item.datetime)}
						</Text>
						<Text style={appStyles.historyRecordDateDot}>•</Text>
						<Text style={appStyles.historyRecordDateText}>
							{formatTime(item.datetime)}
						</Text>
					</View>
				</View>

				<AnalysisProgressIndicator
					progress={analysisProgress}
					status={item.status}
				/>
			</View>

			<View style={appStyles.historyRecordInfoRow}>
				<Ionicons name="map-outline" size={18} color="#F2201F" />
				<Text style={appStyles.historyRecordInfoText}>{areaLabel}</Text>
			</View>

			<View style={appStyles.historyRecordInfoRow}>
				<Ionicons name="eye-outline" size={18} color="#F2201F" />
				<Text style={appStyles.historyRecordInfoText}>
					{item.ibis_quantity} {item.ibis_quantity === 1 ? 'Guará' : 'Guarás'}
				</Text>
			</View>

			<View style={appStyles.historyTagRow}>
				{behaviorTags.map((tag) => (
					<View key={`${item.id}-${tag}`} style={appStyles.historyTagChip}>
						<Text style={appStyles.historyTagChipText}>{tag}</Text>
					</View>
				))}
			</View>

			<Pressable
				onPress={() => onOpenRecord(item.id)}
				style={appStyles.historyDetailButton}
			>
				<Text style={appStyles.historyDetailButtonText}>VER DETALHES</Text>
			</Pressable>
		</View>
	)
}

export default HistoryRecordCard
