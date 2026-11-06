import React from 'react'
import { Text, View } from 'react-native'
import { Skeleton } from '../Skeleton'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import { formatDate, formatTime } from '../../utils/recordFormatters'

// Título do registro: quantidade de guarás, comportamentos (chips) e linha "Registro #id · data e hora".
// Com `loading`, a quantidade (que o resumo ainda pode trazer desatualizada) vira um esqueleto.
export function RecordInfoCard({ record, loading = false }: { record: RecordDetailItem; loading?: boolean }) {
	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'guará' : 'guarás'}`
	const behaviors = String(record.flock_size)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

	return (
		<View style={appStyles.recordDetailTitleBlock}>
			{loading ? (
				<Skeleton width={160} height={38} radius={8} style={appStyles.recordDetailSkeletonTitle} />
			) : (
				<Text style={appStyles.recordDetailTitle} accessibilityRole="header">
					{quantityLabel}
				</Text>
			)}
			{behaviors.length > 0 ? (
				<View style={appStyles.recordDetailChipRow}>
					{behaviors.map((behavior) => (
						<View key={behavior} style={appStyles.recordDetailChip}>
							<Text style={appStyles.recordDetailChipText}>{behavior}</Text>
						</View>
					))}
				</View>
			) : null}
			<Text style={appStyles.recordDetailMeta}>
				{`Registro #${record.id} · ${formatDate(record.datetime)} às ${formatTime(record.datetime)}`}
			</Text>
		</View>
	)
}
