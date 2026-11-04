import React from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import { formatDate, formatTime } from '../../utils/recordFormatters'

// Título do registro: quantidade de guarás, comportamentos (chips) e linha "Registro #id · data e hora".
export function RecordInfoCard({ record }: { record: RecordDetailItem }) {
	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'guará' : 'guarás'}`
	const behaviors = String(record.flock_size)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

	return (
		<View style={appStyles.recordDetailTitleBlock}>
			<Text style={appStyles.recordDetailTitle} accessibilityRole="header">
				{quantityLabel}
			</Text>
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
