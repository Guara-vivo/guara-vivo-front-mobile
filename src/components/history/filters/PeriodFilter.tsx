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
	title,
}: {
	label: string
	title: string
	value: string
	onChangeText: (value: string) => void
}) {
	return (
		<View style={appStyles.filterColumn}>
			<Text style={appStyles.filterLabel}>{title}</Text>
			<View style={appStyles.filterField}>
				<BottomSheetTextInput
					accessibilityLabel={label}
					value={value}
					onChangeText={onChangeText}
					placeholder="dd/mm/aaaa"
					placeholderTextColor={colors.placeholder}
					style={appStyles.filterFieldInput}
				/>
				<Ionicons accessible={false} name="calendar-outline" size={18} color={colors.muted} />
			</View>
		</View>
	)
}

// Conteúdo da seção Período: data inicial e final.
export function PeriodFilter({ draftFilters, setField }: Props) {
	return (
		<View style={appStyles.filterRow}>
			<DateInput
				title="De"
				label="Data inicial"
				value={draftFilters.fromDate}
				onChangeText={(value) => setField('fromDate', value)}
			/>
			<DateInput
				title="Até"
				label="Data final"
				value={draftFilters.toDate}
				onChangeText={(value) => setField('toDate', value)}
			/>
		</View>
	)
}
