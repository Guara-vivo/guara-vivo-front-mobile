import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { behaviorLabel } from '../utils/behaviorLabel'
import { countLabel } from '../utils/countLabel'
import { isAnalysisInProgress } from '../utils/historyRecords'
import { formatTime } from '../utils/recordFormatters'
import AnalysisProgressIndicator from './AnalysisProgressIndicator'
import { Skeleton } from './Skeleton'
import { SkeletonImage } from './SkeletonImage'
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
	const { t } = useTranslation('history')
	const syncState = item.sync_state
	const behaviorTags = String(item.flock_size)
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean)
	const areaLabel = item.map_zones.length
		? item.map_zones.map((zone) => zone.name).join(' · ')
		: t('card.noArea')
	const photo = item.images?.[0]
	// Enquanto a IA analisa (ou o registro espera para ser enviado), a contagem 0 não vale: mostra
	// esqueleto no lugar.
	const analyzing = isAnalysisInProgress(item)
	const guaras = countLabel(item.ibis_quantity)
	const meta = `${formatTime(item.datetime)}${syncState ? '' : ` · #${item.id}`} · ${areaLabel}`

	const content = (
		<>
			{photo ? (
				<SkeletonImage
					uri={photo}
					style={appStyles.historyRecordThumb}
					accessibilityLabel={t('card.photo', { id: item.id })}
				/>
			) : (
				<View style={appStyles.historyRecordThumb}>
					<Ionicons name="image-outline" size={24} color={colors.muted} />
				</View>
			)}

			<View style={appStyles.historyRecordBody}>
				{syncState === 'failed' ? (
					<Text style={appStyles.historyRecordTitle}>{t('card.notSent')}</Text>
				) : analyzing || syncState ? (
					<Skeleton width={96} height={20} radius={6} style={appStyles.historyRecordTitleSkeleton} />
				) : (
					<Text style={appStyles.historyRecordTitle}>{guaras}</Text>
				)}
				<Text numberOfLines={1} style={appStyles.historyRecordMeta}>
					{meta}
				</Text>
				{item.author_name ? (
					<Text numberOfLines={1} style={appStyles.historyRecordMeta}>
						{t('card.sentBy', { name: item.author_name })}
					</Text>
				) : null}
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
							{syncState === 'failed' ? t('card.refused') : t('card.waitingToSend')}
						</Text>
					</View>
				) : (
					<>
						<View style={appStyles.historyTagRow}>
							{behaviorTags.map((tag) => (
								<View key={`${item.client_uuid ?? item.id}-${tag}`} style={appStyles.historyTagChip}>
									<Text style={appStyles.historyTagChipText}>{behaviorLabel(tag)}</Text>
								</View>
							))}
						</View>
						<AnalysisProgressIndicator progress={analysisProgress} status={item.status} />
					</>
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
					<Ionicons name="chevron-forward" size={18} color={colors.muted} />
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
						accessibilityLabel={t('card.discardA11y')}
						style={[appStyles.historyDetailButton, appStyles.historyDiscardButton]}
					>
						<Text style={appStyles.historyDetailButtonText}>{t('card.discard')}</Text>
					</Pressable>
				) : null}
			</View>
		)
	}

	return (
		<Pressable
			onPress={() => onOpenRecord(item.id)}
			accessibilityRole="button"
			accessibilityLabel={t('card.open', {
				id: item.id,
				state: syncState === 'failed' ? t('card.stateNotSent') : analyzing || syncState ? t('card.stateNoCount') : guaras,
				area: areaLabel,
			})}
			style={appStyles.historyRecordCard}
		>
			{content}
		</Pressable>
	)
}

// memo: a lista re-renderiza a cada tecla da busca; o cartão só muda se o registro mudar.
export const HistoryRecordCard = React.memo(HistoryRecordCardBase)

export default HistoryRecordCard
