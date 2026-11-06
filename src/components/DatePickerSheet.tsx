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
import { buildMonthGrid } from '../utils/monthGrid'
import { MONTHS } from '../utils/timeFormatters'
import { ActionButton } from './common'

const WEEK_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type Props = {
	visible: boolean
	value: Date | null
	onConfirm: (date: Date) => void
	onClose: () => void
}

function sameDay(a: Date, b: Date) {
	return a.toDateString() === b.toDateString()
}

// Calendário em pt-BR numa folha inferior; não deixa escolher dias futuros.
export function DatePickerSheet({ visible, value, onConfirm, onClose }: Props) {
	const sheetRef = useRef<BottomSheetModal>(null)
	const today = new Date()
	const [draft, setDraft] = useState<Date>(value ?? today)
	const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
	const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())

	useEffect(() => {
		if (!visible) {
			sheetRef.current?.dismiss()
			return
		}

		// Reabre sempre a partir do valor atual.
		const start = value ?? new Date()
		setDraft(start)
		setViewYear(start.getFullYear())
		setViewMonth(start.getMonth())
		sheetRef.current?.present()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible])

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
					Data do avistamento
				</Text>

				<View style={appStyles.dateShortcutRow}>
					{[
						{ label: 'Hoje', date: today },
						{ label: 'Ontem', date: yesterday },
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
						accessibilityLabel="Mês anterior"
						style={appStyles.dateMonthButton}
					>
						<Ionicons name="chevron-back" size={22} color={colors.text} />
					</Pressable>
					<Text style={appStyles.dateMonthTitle} accessibilityRole="header">
						{`${MONTHS[viewMonth].charAt(0).toUpperCase()}${MONTHS[viewMonth].slice(1)} de ${viewYear}`}
					</Text>
					<Pressable
						onPress={() => shiftMonth(1)}
						disabled={isCurrentMonth}
						accessibilityRole="button"
						accessibilityLabel="Próximo mês"
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
					{WEEK_LABELS.map((label, index) => (
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
									accessibilityLabel={`${cell.day} de ${MONTHS[viewMonth]} de ${viewYear}`}
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
						title="Cancelar"
						variant="outline"
						fullWidth={false}
						containerStyle={appStyles.dateSheetAction}
						onPress={() => sheetRef.current?.dismiss()}
					/>
					<ActionButton
						title="Confirmar"
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
