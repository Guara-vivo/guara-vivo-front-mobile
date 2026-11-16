import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import { formatInputDate, parseInputDate } from '../../../utils/inputDate'
import { formatDate } from '../../../utils/recordFormatters'
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
	const { t } = useTranslation('history')
	const hasValue = value.trim() !== ''
	// O valor guardado é dd/mm/aaaa; na tela aparece no formato do idioma.
	const parsed = parseInputDate(value)
	const shown = parsed ? formatDate(parsed.toISOString()) : value

	return (
		<View style={appStyles.filterColumn}>
			<Text style={appStyles.filterLabel}>{title}</Text>
			<View style={appStyles.filterField}>
				<Pressable
					onPress={onPress}
					accessibilityRole="button"
					accessibilityLabel={hasValue ? t('filters.changeDate', { label, value: shown }) : t('filters.pickDate', { label })}
					style={appStyles.filterFieldPressable}
				>
					<Text style={[appStyles.filterFieldText, !hasValue && appStyles.filterFieldPlaceholder]}>
						{hasValue ? shown : t('filters.select')}
					</Text>
				</Pressable>
				{hasValue ? (
					<Pressable
						onPress={onClear}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel={t('filters.clearDate', { label: label.toLowerCase() })}
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
	const { t } = useTranslation('history')
	const [editing, setEditing] = useState<DateField | null>(null)

	return (
		<>
			<View style={appStyles.filterRow}>
				<DateButton
					title={t('filters.from')}
					label={t('filters.startDate')}
					value={draftFilters.fromDate}
					onPress={() => setEditing('fromDate')}
					onClear={() => setField('fromDate', '')}
				/>
				<DateButton
					title={t('filters.to')}
					label={t('filters.endDate')}
					value={draftFilters.toDate}
					onPress={() => setEditing('toDate')}
					onClear={() => setField('toDate', '')}
				/>
			</View>

			{editing ? (
				<DatePickerSheet
					title={editing === 'fromDate' ? t('filters.startDate') : t('filters.endDate')}
					value={parseInputDate(draftFilters[editing])}
					onConfirm={(date) => setField(editing, formatInputDate(date))}
					onClose={() => setEditing(null)}
				/>
			) : null}
		</>
	)
}
