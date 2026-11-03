import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'

type Props = {
	date: Date | null
	time: Date | null
	disabled: boolean
	onDateChange: (date: Date) => void
	onTimeChange: (time: Date) => void
}

// Campos de data e hora do avistamento; o seletor nativo abre ao tocar no campo.
export function RegisterDateTimeFields({
	date,
	time,
	disabled,
	onDateChange,
	onTimeChange,
}: Props) {
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [showTimePicker, setShowTimePicker] = useState(false)

	const dateLabel = date?.toLocaleDateString('pt-BR')
	const timeLabel = time?.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	})

	const handleDateChange = (event: DateTimePickerEvent, value?: Date) => {
		setShowDatePicker(false)
		if (event.type !== 'set' || !value) {
			return
		}

		onDateChange(value)
	}

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
					onPress={() => !disabled && setShowDatePicker(true)}
					accessibilityRole="button"
					accessibilityLabel={`Data do avistamento: ${dateLabel ?? "não informada"}`}
					accessibilityState={{ disabled: !!disabled }}
					disabled={disabled}
					style={appStyles.registerDateField}
				>
					<Text
						style={[
							appStyles.registerDateFieldText,
							!dateLabel && appStyles.registerDateFieldPlaceholder,
						]}
					>
						{dateLabel ?? 'Insira a data...'}
					</Text>
					<Ionicons name="calendar-outline" size={16} color="#125ED0" />
				</Pressable>

				<Pressable
					onPress={() => !disabled && setShowTimePicker(true)}
					accessibilityRole="button"
					accessibilityLabel={`Hora do avistamento: ${timeLabel ?? "não informada"}`}
					accessibilityState={{ disabled: !!disabled }}
					disabled={disabled}
					style={appStyles.registerDateField}
				>
					<Text
						style={[
							appStyles.registerDateFieldText,
							!timeLabel && appStyles.registerDateFieldPlaceholder,
						]}
					>
						{timeLabel ?? 'Insira a hora...'}
					</Text>
					<Ionicons name="time-outline" size={16} color="#125ED0" />
				</Pressable>
			</View>

			{showDatePicker ? (
				<DateTimePicker
					mode="date"
					value={date ?? new Date()}
					onChange={handleDateChange}
				/>
			) : null}

			{showTimePicker ? (
				<DateTimePicker
					mode="time"
					value={time ?? new Date()}
					onChange={handleTimeChange}
				/>
			) : null}
		</>
	)
}
