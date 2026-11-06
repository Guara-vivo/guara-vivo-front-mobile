import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import { colors } from '../../constants/theme'
import { formatRelativeDay } from '../../utils/dayLabels'
import { formatTime } from '../../utils/recordFormatters'
import { DatePickerSheet } from '../DatePickerSheet'

type Props = {
	date: Date
	time: Date
	disabled: boolean
	onDateChange: (date: Date) => void
	onTimeChange: (time: Date) => void
}

// Data (calendário em pt-BR) e hora (seletor nativo) do avistamento; já vêm preenchidas com o momento atual.
export function RegisterDateTimeFields({
	date,
	time,
	disabled,
	onDateChange,
	onTimeChange,
}: Props) {
	const [showDateSheet, setShowDateSheet] = useState(false)
	const [showTimePicker, setShowTimePicker] = useState(false)

	const dateLabel = formatRelativeDay(date.toISOString(), new Date())
	const timeLabel = formatTime(time.toISOString())

	const handleTimeChange = (event: DateTimePickerEvent, value?: Date) => {
		setShowTimePicker(false)
		if (event.type !== 'set' || !value) {
			return
		}

		onTimeChange(value)
	}

	return (
		<>
			<View style={appStyles.registerDateRow}>
				<Pressable
					onPress={() => setShowDateSheet(true)}
					accessibilityRole="button"
					accessibilityLabel={`Data do avistamento: ${dateLabel}. Alterar`}
					accessibilityState={{ disabled }}
					disabled={disabled}
					style={appStyles.registerDateField}
				>
					<Ionicons name="calendar-outline" size={20} color={colors.secondary} />
					<Text style={appStyles.registerDateFieldText}>{dateLabel}</Text>
				</Pressable>

				<Pressable
					onPress={() => setShowTimePicker(true)}
					accessibilityRole="button"
					accessibilityLabel={`Hora do avistamento: ${timeLabel}. Alterar`}
					accessibilityState={{ disabled }}
					disabled={disabled}
					style={appStyles.registerDateField}
				>
					<Ionicons name="time-outline" size={20} color={colors.secondary} />
					<Text style={appStyles.registerDateFieldText}>{timeLabel}</Text>
				</Pressable>
			</View>

			{showDateSheet ? (
				<DatePickerSheet
					value={date}
					onConfirm={onDateChange}
					onClose={() => setShowDateSheet(false)}
				/>
			) : null}

			{showTimePicker ? (
				<DateTimePicker mode="time" value={time} is24Hour onChange={handleTimeChange} />
			) : null}
		</>
	)
}
