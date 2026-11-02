import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import type { FilterFieldSetter } from './FilterSection'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
}

function DateInput({
	value,
	onChangeText,
}: {
	value: string
	onChangeText: (value: string) => void
}) {
	return (
		<View style={appStyles.historyDateInputWrap}>
			<BottomSheetTextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="dd/mm/aaaa"
				placeholderTextColor="#6B6B74"
				style={appStyles.historyDateInput}
			/>
			<Ionicons name="calendar-outline" size={14} color="#1A1A1A" />
		</View>
	)
}

// Conteúdo da seção PERÍODO: data inicial e final.
export function PeriodFilter({ draftFilters, setField }: Props) {
	return (
		<>
			<View style={appStyles.historyDateLabelsRow}>
				<Text style={appStyles.historySmallLabel}>De</Text>
				<Text style={appStyles.historySmallLabel}>Até</Text>
			</View>

			<View style={appStyles.historyDateRow}>
				<DateInput
					value={draftFilters.fromDate}
					onChangeText={(value) => setField('fromDate', value)}
				/>
				<DateInput
					value={draftFilters.toDate}
					onChangeText={(value) => setField('toDate', value)}
				/>
			</View>
		</>
	)
}
