import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import { buildMonthGrid } from '../utils/monthGrid'
import {
	matchesShortcut,
	pickRangeDay,
	rangeCellKind,
	shortcutRange,
	type DateRange,
	type RangeShortcut,
} from '../utils/rangeSelection'
import { getMonthName } from '../utils/timeFormatters'
import { ActionButton } from './common'

type Props = {
	// Título da folha (padrão: "Período").
	title?: string
	start: Date | null
	end: Date | null
	onConfirm: (range: DateRange) => void
	onClose: () => void
}

const SHORTCUTS: RangeShortcut[] = ['last7', 'last30', 'thisMonth']

// Calendário de faixa numa folha inferior: toque no dia inicial e depois no final (a faixa fica pintada).
// Não deixa escolher dias futuros. Como o `DatePickerSheet`, deve ser montado só quando for aberto.
export function DateRangePickerSheet({ title, start, end, onConfirm, onClose }: Props) {
	const { t } = useTranslation(['dates', 'common'])
	const weekLabels = t('dates:weekLabels', { returnObjects: true }) as string[]
	const sheetRef = useRef<BottomSheetModal>(null)
	const today = new Date()
	const [range, setRange] = useState<DateRange>({ start, end })
	const [viewYear, setViewYear] = useState((start ?? today).getFullYear())
	const [viewMonth, setViewMonth] = useState((start ?? today).getMonth())

	useEffect(() => {
		sheetRef.current?.present()
	}, [])

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	)

	const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()
	const grid = buildMonthGrid(viewYear, viewMonth, today, null)
	const monthName = getMonthName(viewMonth)
	const hint = range.start === null ? t('dates:picker.pickStart') : range.end === null ? t('dates:picker.pickEnd') : ''

	const showMonthOf = (date: Date) => {
		setViewYear(date.getFullYear())
		setViewMonth(date.getMonth())
	}

	const shiftMonth = (delta: number) => {
		showMonthOf(new Date(viewYear, viewMonth + delta, 1))
	}

	const applyShortcut = (shortcut: RangeShortcut) => {
		const next = shortcutRange(shortcut, today)
		setRange(next)
		showMonthOf(next.end)
	}

	return (
		<BottomSheetModal
			ref={sheetRef}
			enableDynamicSizing
			enablePanDownToClose
			stackBehavior="push"
			backdropComponent={renderBackdrop}
			backgroundStyle={appStyles.historyBottomSheetBackground}
			handleIndicatorStyle={appStyles.historyBottomSheetIndicator}
			onChange={(index) => {
				if (index === -1) onClose()
			}}
		>
			<BottomSheetView style={appStyles.dateSheetContent} accessibilityViewIsModal>
				<Text style={appStyles.dateSheetTitle} accessibilityRole="header">
					{title ?? t('dates:picker.rangeTitle')}
				</Text>

				<View style={appStyles.dateShortcutRow}>
					{SHORTCUTS.map((shortcut) => {
						const active = matchesShortcut(range, shortcut, today)
						return (
							<Pressable
								key={shortcut}
								onPress={() => applyShortcut(shortcut)}
								accessibilityRole="button"
								accessibilityState={{ selected: active }}
								style={[appStyles.dateShortcut, active && appStyles.dateShortcutActive]}
							>
								<Text style={[appStyles.dateShortcutText, active && appStyles.dateShortcutTextActive]}>
									{t(`dates:shortcuts.${shortcut}`)}
								</Text>
							</Pressable>
						)
					})}
				</View>

				<Text style={appStyles.dateRangeHint} accessibilityLiveRegion="polite">
					{hint}
				</Text>

				<View style={appStyles.dateMonthRow}>
					<Pressable
						onPress={() => shiftMonth(-1)}
						accessibilityRole="button"
						accessibilityLabel={t('dates:picker.previousMonth')}
						style={appStyles.dateMonthButton}
					>
						<Ionicons name="chevron-back" size={22} color={colors.text} />
					</Pressable>
					<Text style={appStyles.dateMonthTitle} accessibilityRole="header">
						{t('dates:monthYear', {
							month: `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`,
							year: viewYear,
						})}
					</Text>
					<Pressable
						onPress={() => shiftMonth(1)}
						disabled={isCurrentMonth}
						accessibilityRole="button"
						accessibilityLabel={t('dates:picker.nextMonth')}
						accessibilityState={{ disabled: isCurrentMonth }}
						style={[appStyles.dateMonthButton, isCurrentMonth && appStyles.dateMonthButtonDisabled]}
					>
						<Ionicons name="chevron-forward" size={22} color={colors.text} />
					</Pressable>
				</View>

				<View style={appStyles.dateWeekRow} importantForAccessibility="no-hide-descendants">
					{weekLabels.map((label, index) => (
						<Text key={`${label}-${index}`} style={appStyles.dateWeekLabel}>
							{label}
						</Text>
					))}
				</View>

				<View style={appStyles.dateGrid}>
					{grid.map((cell, index) => {
						if (cell === null) return <View key={`empty-${index}`} style={appStyles.dateCell} />

						const date = new Date(viewYear, viewMonth, cell.day)
						const kind = rangeCellKind(range, date)
						const endpoint = kind === 'start' || kind === 'end' || kind === 'single'

						return (
							<View key={cell.day} style={appStyles.dateCell}>
								{kind === 'middle' || kind === 'start' || kind === 'end' ? (
									<View
										pointerEvents="none"
										style={[
											appStyles.dateRangeBand,
											kind === 'start' && appStyles.dateRangeBandStart,
											kind === 'end' && appStyles.dateRangeBandEnd,
										]}
									/>
								) : null}
								<Pressable
									onPress={() => setRange(pickRangeDay(range, date))}
									disabled={cell.disabled}
									accessibilityRole="button"
									accessibilityLabel={t('dates:dayMonthYear', { day: cell.day, month: monthName, year: viewYear })}
									accessibilityState={{ selected: kind !== null, disabled: cell.disabled }}
									style={[appStyles.dateDay, endpoint && appStyles.dateDaySelected]}
								>
									<Text
										style={[
											appStyles.dateDayText,
											endpoint && appStyles.dateDayTextSelected,
											cell.disabled && appStyles.dateDayTextDisabled,
										]}
									>
										{cell.day}
									</Text>
								</Pressable>
							</View>
						)
					})}
				</View>

				<View style={appStyles.dateSheetActions}>
					<ActionButton
						title={t('common:cancel')}
						variant="outline"
						fullWidth={false}
						containerStyle={appStyles.dateSheetAction}
						onPress={() => sheetRef.current?.dismiss()}
					/>
					<ActionButton
						title={t('dates:picker.confirm')}
						fullWidth={false}
						disabled={range.start === null}
						containerStyle={appStyles.dateSheetAction}
						onPress={() => {
							onConfirm(range)
							sheetRef.current?.dismiss()
						}}
					/>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	)
}

export default DateRangePickerSheet
