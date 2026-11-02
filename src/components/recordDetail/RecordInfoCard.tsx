import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { RecordDetailItem } from '../../services/recordsService'
import {
	formatDate,
	formatLocationLabel,
	formatTime,
} from '../../utils/recordFormatters'

type RowProps = {
	icon: React.ComponentProps<typeof Ionicons>['name']
	label: string
	children: React.ReactNode
}

function InfoRow({ icon, label, children }: RowProps) {
	return (
		<View style={appStyles.recordDetailInfoRow}>
			<Ionicons name={icon} size={18} color="#F2201F" />
			<View style={appStyles.recordDetailInfoTextWrap}>
				<Text style={appStyles.recordDetailInfoLabel}>{label}</Text>
				{children}
			</View>
		</View>
	)
}

// Card "INFORMAÇÕES GERAIS": data, localização, áreas e quantidade.
export function RecordInfoCard({ record }: { record: RecordDetailItem }) {
	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'guará' : 'guarás'}`
	const idLabel = `#${String(record.id).padStart(3, '0')}`
	const locationLabel = formatLocationLabel(record.latitude, record.longitude)
	const areaLabel = record.map_zones.length
		? record.map_zones.map((zone) => zone.name).join(' · ')
		: 'Sem área'

	return (
		<View style={appStyles.recordDetailCard}>
			<View style={appStyles.recordDetailHeaderRow}>
				<Text
					style={[
						appStyles.recordDetailSectionTitle,
						appStyles.recordDetailInfoHeaderTitle,
					]}
				>
					INFORMAÇÕES GERAIS
				</Text>
				<View style={appStyles.recordDetailIdBadge}>
					<Text style={appStyles.recordDetailIdText}>{idLabel}</Text>
				</View>
			</View>

			<View style={appStyles.recordDetailInfoList}>
				<InfoRow icon="calendar-outline" label="DATA E HORA">
					<Text style={appStyles.recordDetailValue}>
						{formatDate(record.datetime)} às {formatTime(record.datetime)}
					</Text>
				</InfoRow>

				<InfoRow icon="location-outline" label="LOCALIZAÇÃO">
					<Text style={appStyles.recordDetailValue}>{locationLabel}</Text>
					<Text style={appStyles.recordDetailCoordinates}>
						Lat: {record.latitude.toFixed(4)} / Lng:{' '}
						{record.longitude.toFixed(4)}
					</Text>
				</InfoRow>

				<InfoRow icon="map-outline" label="ÁREAS">
					<Text style={appStyles.recordDetailValue}>{areaLabel}</Text>
				</InfoRow>

				<InfoRow icon="people-outline" label="QUANTIDADE">
					<Text style={appStyles.recordDetailValue}>{quantityLabel}</Text>
				</InfoRow>
			</View>
		</View>
	)
}
