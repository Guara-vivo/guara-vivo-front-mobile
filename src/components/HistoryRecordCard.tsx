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

function HistoryRecordCardBase({
	item,
	analysisProgress,
	onOpenRecord,
	onDiscard,
}: {
	item: RecordItem
	analysisProgress: number
	onOpenRecord: (id: number) => void
	onDiscard?: (clientUuid: string) => void
}) {
	const syncState = item.sync_state
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
							{syncState === 'failed'
								? 'RECUSADO'
								: syncState
									? 'AGUARDANDO ENVIO'
									: `#${String(item.id).padStart(3, '0')}`}
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

				{syncState ? (
					<Ionicons
						name={syncState === 'failed' ? 'alert-circle' : 'cloud-upload-outline'}
						size={26}
						color={syncState === 'failed' ? '#F2201F' : '#5C8BD6'}
					/>
				) : (
					<AnalysisProgressIndicator
						progress={analysisProgress}
						status={item.status}
					/>
				)}
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
					<View key={`${item.client_uuid ?? item.id}-${tag}`} style={appStyles.historyTagChip}>
						<Text style={appStyles.historyTagChipText}>{tag}</Text>
					</View>
				))}
			</View>

			{syncState === 'failed' && item.client_uuid && onDiscard ? (
				<Pressable
					onPress={() => onDiscard(item.client_uuid as string)}
						accessibilityRole="button"
						accessibilityLabel="Descartar registro recusado"
					style={appStyles.historyDetailButton}
				>
					<Text style={appStyles.historyDetailButtonText}>DESCARTAR REGISTRO</Text>
				</Pressable>
			) : null}

			{!syncState ? (
				<Pressable
					onPress={() => onOpenRecord(item.id)}
						accessibilityRole="button"
						accessibilityLabel={`Ver detalhes do registro ${item.id}`}
					style={appStyles.historyDetailButton}
				>
					<Text style={appStyles.historyDetailButtonText}>VER DETALHES</Text>
				</Pressable>
			) : null}
		</View>
	)
}

// memo: a lista re-renderiza a cada tecla da busca; o cartão só muda se o registro mudar.
export const HistoryRecordCard = React.memo(HistoryRecordCardBase)

export default HistoryRecordCard
