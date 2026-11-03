import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import type { FilterFieldSetter } from './FilterSection'
import { colors } from '../../../constants/theme'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
}

function DateInput({
	value,
	onChangeText,
	label,
}: {
	label: string
	value: string
	onChangeText: (value: string) => void
}) {
	return (
		<View style={appStyles.historyDateInputWrap}>
			<BottomSheetTextInput
				accessibilityLabel={label}
				value={value}
				onChangeText={onChangeText}
				placeholder="dd/mm/aaaa"
				placeholderTextColor={colors.placeholder}
				style={appStyles.historyDateInput}
			/>
			<Ionicons accessible={false} name="calendar-outline" size={14} color={colors.text} />
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
					label="Data inicial"
					value={draftFilters.fromDate}
					onChangeText={(value) => setField('fromDate', value)}
				/>
				<DateInput
					label="Data final"
					value={draftFilters.toDate}
					onChangeText={(value) => setField('toDate', value)}
				/>
			</View>
		</>
	)
}
