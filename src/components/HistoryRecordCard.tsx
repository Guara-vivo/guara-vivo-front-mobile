import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { formatTime } from '../utils/recordFormatters'
import AnalysisProgressIndicator from './AnalysisProgressIndicator'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'
import { colors } from '../constants/theme'

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
	const photo = item.images?.[0]
	const guaras = `${item.ibis_quantity} ${item.ibis_quantity === 1 ? 'guará' : 'guarás'}`
	const meta = `${formatTime(item.datetime)}${syncState ? '' : ` · #${item.id}`} · ${areaLabel}`

	const content = (
		<>
			{photo ? (
				<Image
					source={{ uri: photo }}
					style={appStyles.historyRecordThumb}
					contentFit="cover"
					accessibilityLabel={`Foto do registro ${item.id}`}
				/>
			) : (
				<View style={appStyles.historyRecordThumb}>
					<Ionicons name="image-outline" size={24} color={colors.muted} />
				</View>
			)}

			<View style={appStyles.historyRecordBody}>
				<Text style={appStyles.historyRecordTitle}>{guaras}</Text>
				<Text numberOfLines={1} style={appStyles.historyRecordMeta}>
					{meta}
				</Text>
				{syncState ? (
					<View
						style={[
							appStyles.historySyncChip,
							syncState === 'failed' && appStyles.historySyncChipFailed,
						]}
					>
						<Text
							style={[
								appStyles.historySyncChipText,
								syncState === 'failed' && appStyles.historySyncChipTextFailed,
							]}
						>
							{syncState === 'failed' ? 'Recusado' : 'Aguardando envio'}
						</Text>
					</View>
				) : (
					<View style={appStyles.historyTagRow}>
						{behaviorTags.map((tag) => (
							<View key={`${item.client_uuid ?? item.id}-${tag}`} style={appStyles.historyTagChip}>
								<Text style={appStyles.historyTagChipText}>{tag}</Text>
							</View>
						))}
					</View>
				)}
			</View>

			<View style={appStyles.historyRecordSide}>
				{syncState ? (
					<Ionicons
						name={syncState === 'failed' ? 'alert-circle' : 'cloud-upload-outline'}
						size={24}
						color={syncState === 'failed' ? colors.dangerText : colors.warning}
					/>
				) : (
					<>
						<AnalysisProgressIndicator progress={analysisProgress} status={item.status} />
						<Ionicons name="chevron-forward" size={18} color={colors.muted} />
					</>
				)}
			</View>
		</>
	)

	if (syncState) {
		return (
			<View>
				<View style={appStyles.historyRecordCard}>{content}</View>
				{syncState === 'failed' && item.client_uuid && onDiscard ? (
					<Pressable
						onPress={() => onDiscard(item.client_uuid as string)}
						accessibilityRole="button"
						hitSlop={4}
						accessibilityLabel="Descartar registro recusado"
						style={[appStyles.historyDetailButton, appStyles.historyDiscardButton]}
					>
						<Text style={appStyles.historyDetailButtonText}>Descartar registro</Text>
					</Pressable>
				) : null}
			</View>
		)
	}

	return (
		<Pressable
			onPress={() => onOpenRecord(item.id)}
			accessibilityRole="button"
			accessibilityLabel={`Ver detalhes do registro ${item.id}: ${guaras}, ${areaLabel}`}
			style={appStyles.historyRecordCard}
		>
			{content}
		</Pressable>
	)
}

// memo: a lista re-renderiza a cada tecla da busca; o cartão só muda se o registro mudar.
export const HistoryRecordCard = React.memo(HistoryRecordCardBase)

export default HistoryRecordCard
