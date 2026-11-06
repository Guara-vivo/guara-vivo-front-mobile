import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import { formatInputDate, parseInputDate } from '../../../utils/inputDate'
import { DatePickerSheet } from '../../DatePickerSheet'
import type { FilterFieldSetter } from './FilterSection'
import { colors } from '../../../constants/theme'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
}

type DateField = 'fromDate' | 'toDate'

function DateButton({
	title,
	label,
	value,
	onPress,
	onClear,
}: {
	title: string
	label: string
	value: string
	onPress: () => void
	onClear: () => void
}) {
	const hasValue = value.trim() !== ''

	return (
		<View style={appStyles.filterColumn}>
			<Text style={appStyles.filterLabel}>{title}</Text>
			<View style={appStyles.filterField}>
				<Pressable
					onPress={onPress}
					accessibilityRole="button"
					accessibilityLabel={hasValue ? `${label}: ${value}. Alterar` : `${label}. Escolher no calendário`}
					style={appStyles.filterFieldPressable}
				>
					<Text style={[appStyles.filterFieldText, !hasValue && appStyles.filterFieldPlaceholder]}>
						{hasValue ? value : 'Selecionar'}
					</Text>
				</Pressable>
				{hasValue ? (
					<Pressable
						onPress={onClear}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel={`Limpar ${label.toLowerCase()}`}
					>
						<Ionicons name="close-circle" size={20} color={colors.muted} />
					</Pressable>
				) : (
					<Ionicons accessible={false} name="calendar-outline" size={18} color={colors.muted} />
				)}
			</View>
		</View>
	)
}

// Conteúdo da seção Período: data inicial e final escolhidas no calendário (sem digitar).
export function PeriodFilter({ draftFilters, setField }: Props) {
	const [editing, setEditing] = useState<DateField | null>(null)

	return (
		<>
			<View style={appStyles.filterRow}>
				<DateButton
					title="De"
					label="Data inicial"
					value={draftFilters.fromDate}
					onPress={() => setEditing('fromDate')}
					onClear={() => setField('fromDate', '')}
				/>
				<DateButton
					title="Até"
					label="Data final"
					value={draftFilters.toDate}
					onPress={() => setEditing('toDate')}
					onClear={() => setField('toDate', '')}
				/>
			</View>

			{editing ? (
				<DatePickerSheet
					title={editing === 'fromDate' ? 'Data inicial' : 'Data final'}
					value={parseInputDate(draftFilters[editing])}
					onConfirm={(date) => setField(editing, formatInputDate(date))}
					onClose={() => setEditing(null)}
				/>
			) : null}
		</>
	)
}
