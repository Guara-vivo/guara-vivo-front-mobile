import React from 'react'
import { Text, View } from 'react-native'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import type { FilterFieldSetter } from './FilterSection'
import { colors } from '../../../constants/theme'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
}

function QuantityInput({
	title,
	label,
	placeholder,
	value,
	onChangeText,
}: {
	title: string
	label: string
	placeholder: string
	value: string
	onChangeText: (value: string) => void
}) {
	return (
		<View style={appStyles.filterColumn}>
			<Text style={appStyles.filterLabel}>{title}</Text>
			<View style={appStyles.filterField}>
				<BottomSheetTextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					accessibilityLabel={label}
					placeholderTextColor={colors.placeholder}
					keyboardType="numeric"
					style={appStyles.filterFieldInput}
				/>
			</View>
		</View>
	)
}

// Conteúdo da seção Quantidade de guarás: mínimo e máximo.
export function QuantityFilter({ draftFilters, setField }: Props) {
	return (
		<View style={appStyles.filterRow}>
			<QuantityInput
				title="Mínimo"
				label="Quantidade mínima"
				placeholder="0"
				value={draftFilters.minQuantity}
				onChangeText={(value) => setField('minQuantity', value)}
			/>
			<QuantityInput
				title="Máximo"
				label="Quantidade máxima"
				placeholder="Sem limite"
				value={draftFilters.maxQuantity}
				onChangeText={(value) => setField('maxQuantity', value)}
			/>
		</View>
	)
}
