import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../constants/theme'
import { Picker } from '@react-native-picker/picker'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import type { MapZoneRead } from '../../../types/api'
import type { FilterFieldSetter } from './FilterSection'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
	zones: MapZoneRead[]
	// Não foi possível carregar as áreas (ex.: sem internet).
	zonesFailed?: boolean
}

// Conteúdo da seção Localização: seletor de área do mapa.
export function LocationFilter({ draftFilters, setField, zones, zonesFailed = false }: Props) {
	return (
		<View style={appStyles.filterColumn}>
			<View style={appStyles.filterPicker}>
			<Picker
				selectedValue={draftFilters.location}
				onValueChange={(value) => setField('location', value)}
				style={appStyles.filterPickerInput}
			>
				<Picker.Item label="Todas as áreas" value="" />
				{zones.map((zone) => (
					<Picker.Item key={zone.id} label={zone.name} value={zone.name} />
				))}
			</Picker>
			</View>
			{zonesFailed && zones.length === 0 ? (
				<View style={appStyles.filterNotice} accessibilityRole="alert" accessibilityLiveRegion="polite">
					<Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
					<Text style={appStyles.filterNoticeText}>
						Não foi possível carregar as áreas. Verifique a internet para filtrar por local.
					</Text>
				</View>
			) : null}
		</View>
	)
}
