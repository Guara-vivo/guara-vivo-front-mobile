import React from 'react'
import { View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { colors } from '../../../constants/theme'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import type { MapZoneRead } from '../../../types/api'
import type { FilterFieldSetter } from './FilterSection'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
	zones: MapZoneRead[]
}

// Conteúdo da seção LOCALIZAÇÃO: seletor de área do mapa.
export function LocationFilter({ draftFilters, setField, zones }: Props) {
	return (
		<View style={appStyles.zoneSelectContainer}>
			<View
				style={[appStyles.zonePickerContainer, { backgroundColor: colors.surface }]}
			>
				<Picker
					selectedValue={draftFilters.location}
					onValueChange={(value) => setField('location', value)}
					style={appStyles.zonePicker}
				>
					<Picker.Item label="Todas as áreas" value="" />
					{zones.map((zone) => (
						<Picker.Item key={zone.id} label={zone.name} value={zone.name} />
					))}
				</Picker>
			</View>
		</View>
	)
}
