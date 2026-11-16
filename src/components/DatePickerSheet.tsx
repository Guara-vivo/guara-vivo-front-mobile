import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
	type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import { useTranslation } from 'react-i18next'
import { buildMonthGrid } from '../utils/monthGrid'
import { getMonthName } from '../utils/timeFormatters'
import { ActionButton } from './common'

type Props = {
	// Título da folha (padrão: data do avistamento).
	title?: string
	value: Date | null
	onConfirm: (date: Date) => void
	onClose: () => void
}

function sameDay(a: Date, b: Date) {
	return a.toDateString() === b.toDateString()
}

// Calendário no idioma ativo numa folha inferior; não deixa escolher dias futuros. Deve ser montado só
// quando for aberto (abre ao montar e avisa por onClose ao fechar), como o modal de filtros.
export function DatePickerSheet({ title, value, onConfirm, onClose }: Props) {
	const { t } = useTranslation(['dates', 'common'])
	const weekLabels = t('dates:weekLabels', { returnObjects: true }) as string[]
	const sheetRef = useRef<BottomSheetModal>(null)
	const today = new Date()
	const [draft, setDraft] = useState<Date>(value ?? today)
	const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
	const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())

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
	const grid = buildMonthGrid(viewYear, viewMonth, today, draft)
	const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

	const pickDate = (date: Date) => {
		setDraft(date)
		setViewYear(date.getFullYear())
		setViewMonth(date.getMonth())
	}

	const shiftMonth = (delta: number) => {
		const next = new Date(viewYear, viewMonth + delta, 1)
		setViewYear(next.getFullYear())
		setViewMonth(next.getMonth())
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
					{title ?? t('dates:picker.title')}
				</Text>

				<View style={appStyles.dateShortcutRow}>
					{[
						{ label: t('dates:today'), date: today },
						{ label: t('dates:yesterday'), date: yesterday },
					].map(({ label, date }) => {
						const active = sameDay(draft, date)
						return (
							<Pressable
								key={label}
								onPress={() => pickDate(date)}
								accessibilityRole="button"
								accessibilityState={{ selected: active }}
								style={[appStyles.dateShortcut, active && appStyles.dateShortcutActive]}
							>
								<Text
									style={[
										appStyles.dateShortcutText,
										active && appStyles.dateShortcutTextActive,
									]}
								>
									{label}
								</Text>
							</Pressable>
						)
					})}
				</View>

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
							month: `${getMonthName(viewMonth).charAt(0).toUpperCase()}${getMonthName(viewMonth).slice(1)}`,
							year: viewYear,
						})}
					</Text>
					<Pressable
						onPress={() => shiftMonth(1)}
						disabled={isCurrentMonth}
						accessibilityRole="button"
						accessibilityLabel={t('dates:picker.nextMonth')}
						accessibilityState={{ disabled: isCurrentMonth }}
						style={[
							appStyles.dateMonthButton,
							isCurrentMonth && appStyles.dateMonthButtonDisabled,
						]}
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
					{grid.map((cell, index) =>
						cell === null ? (
							<View key={`empty-${index}`} style={appStyles.dateCell} />
						) : (
							<View key={cell.day} style={appStyles.dateCell}>
								<Pressable
									onPress={() => pickDate(new Date(viewYear, viewMonth, cell.day))}
									disabled={cell.disabled}
									accessibilityRole="button"
									accessibilityLabel={t('dates:dayMonthYear', { day: cell.day, month: getMonthName(viewMonth), year: viewYear })}
									accessibilityState={{ selected: cell.selected, disabled: cell.disabled }}
									style={[appStyles.dateDay, cell.selected && appStyles.dateDaySelected]}
								>
									<Text
										style={[
											appStyles.dateDayText,
											cell.selected && appStyles.dateDayTextSelected,
											cell.disabled && appStyles.dateDayTextDisabled,
										]}
									>
										{cell.day}
									</Text>
								</Pressable>
							</View>
						),
					)}
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
						containerStyle={appStyles.dateSheetAction}
						onPress={() => {
							onConfirm(draft)
							sheetRef.current?.dismiss()
						}}
					/>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	)
}

export default DatePickerSheet
