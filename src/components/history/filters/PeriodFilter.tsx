import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'
import { formatInputDate, parseInputDate } from '../../../utils/inputDate'
import { formatDate } from '../../../utils/recordFormatters'
import { DateRangePickerSheet } from '../../DateRangePickerSheet'
import type { FilterFieldSetter } from './FilterSection'
import { colors } from '../../../constants/theme'

type Props = {
	draftFilters: HistoryFilterState
	setField: FilterFieldSetter
}

// Conteúdo da seção Período: um campo que abre o calendário de faixa (toque no início e no fim).
// O valor guardado continua sendo dd/mm/aaaa em `fromDate` e `toDate`.
export function PeriodFilter({ draftFilters, setField }: Props) {
	const { t } = useTranslation('history')
	const [isPickerOpen, setIsPickerOpen] = useState(false)

	const start = parseInputDate(draftFilters.fromDate)
	const end = parseInputDate(draftFilters.toDate)
	const label = t('filters.period')
	const hasValue = start !== null || end !== null

	let shown = ''
	if (start && end) {
		shown = t('filters.periodBetween', {
			start: formatDate(start.toISOString()),
			end: formatDate(end.toISOString()),
		})
	} else if (start || end) {
		shown = t('filters.periodFrom', { date: formatDate((start ?? end)!.toISOString()) })
	}

	return (
		<>
			<View style={appStyles.filterField}>
				<Pressable
					onPress={() => setIsPickerOpen(true)}
					accessibilityRole="button"
					accessibilityLabel={
						hasValue ? t('filters.changeDate', { label, value: shown }) : t('filters.pickDate', { label })
					}
					style={appStyles.filterFieldPressable}
				>
					<Text style={[appStyles.filterFieldText, !hasValue && appStyles.filterFieldPlaceholder]}>
						{hasValue ? shown : t('filters.select')}
					</Text>
				</Pressable>
				{hasValue ? (
					<Pressable
						onPress={() => {
							setField('fromDate', '')
							setField('toDate', '')
						}}
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

			{isPickerOpen ? (
				<DateRangePickerSheet
					title={label}
					start={start}
					end={end}
					onConfirm={(range) => {
						setField('fromDate', range.start ? formatInputDate(range.start) : '')
						setField('toDate', range.end ? formatInputDate(range.end) : '')
					}}
					onClose={() => setIsPickerOpen(false)}
				/>
			) : null}
		</>
	)
}
