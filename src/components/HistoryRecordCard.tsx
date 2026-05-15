import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
	formatDate,
	formatLocationLabel,
	formatTime,
} from '../data/mockRecords'
import { appStyles } from '../styles/appStyles'

export function HistoryRecordCard({
	item,
	onOpenRecord,
}: {
	item: any
	onOpenRecord: (id: number) => void
}) {
	const behaviorTags = String(item.flock_size)
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)

	return (
		<View style={appStyles.historyRecordCard}>
			<View style={appStyles.historyRecordTopRow}>
				<View style={appStyles.historyRecordIdBadge}>
					<Text style={appStyles.historyRecordIdText}>
						#{String(item.id).padStart(3, '0')}
					</Text>
				</View>

				<View style={appStyles.historyRecordDateRow}>
					<Ionicons name="calendar-outline" size={14} color="#5C8BD6" />
					<Text style={appStyles.historyRecordDateText}>
						{formatDate(item.datetime)}
					</Text>
					<Text style={appStyles.historyRecordDateDot}>•</Text>
					<Text style={appStyles.historyRecordDateText}>
						{formatTime(item.datetime)}
					</Text>
				</View>
			</View>

			<View style={appStyles.historyRecordInfoRow}>
				<Ionicons name="location-outline" size={14} color="#F2201F" />
				<Text style={appStyles.historyRecordInfoText}>
					{formatLocationLabel(item.latitude, item.longitude)}
				</Text>
			</View>

			<View style={appStyles.historyRecordInfoRow}>
				<Ionicons name="eye-outline" size={14} color="#F2201F" />
				<Text style={appStyles.historyRecordInfoText}>
					Tamanho do grupo: {item.ibis_quantity}
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
