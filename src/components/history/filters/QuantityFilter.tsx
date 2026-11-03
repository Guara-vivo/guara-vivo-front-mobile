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

// Conteúdo da seção QUANTIDADE DE INDIVÍDUOS: mínimo e máximo.
export function QuantityFilter({ draftFilters, setField }: Props) {
	return (
		<>
			<View style={appStyles.historyDateLabelsRow}>
				<Text style={appStyles.historySmallLabel}>Mínimo</Text>
				<Text style={appStyles.historySmallLabel}>Máximo</Text>
			</View>

			<View style={appStyles.historyDateRow}>
				<BottomSheetTextInput
					value={draftFilters.minQuantity}
					onChangeText={(value) => setField('minQuantity', value)}
					placeholder="Min"
					accessibilityLabel="Quantidade mínima"
					placeholderTextColor={colors.placeholder}
					keyboardType="numeric"
					style={appStyles.historyHalfInput}
				/>

				<BottomSheetTextInput
					value={draftFilters.maxQuantity}
					onChangeText={(value) => setField('maxQuantity', value)}
					placeholder="Max"
					accessibilityLabel="Quantidade máxima"
					placeholderTextColor={colors.placeholder}
					keyboardType="numeric"
					style={appStyles.historyHalfInput}
				/>
			</View>
		</>
	)
}
