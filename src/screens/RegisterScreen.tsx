import React, { useState } from 'react'
import { Alert } from 'react-native'
import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Header from '../components/Header'
import { ActionButton } from '../components/common'
import RegisterBehaviorList from '../components/RegisterBehaviorList'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function RegisterScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [, setPhotos] = useState(0)
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedAt, setSelectedAt] = useState(new Date())
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [showTimePicker, setShowTimePicker] = useState(false)
	const behaviorOrder = [
		'Em cio',
		'Ninhando',
		'Alimentando',
		'Voando',
		'Pousado',
	]

	const selectedDate = selectedAt.toLocaleDateString('pt-BR')
	const selectedTime = selectedAt.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	})

	const toggleBehavior = (behavior: string) => {
		setBehaviors((current) =>
			current.includes(behavior)
				? current.filter((item) => item !== behavior)
				: [...current, behavior],
		)
	}

	const handleSave = () => {
		Alert.alert('Sucesso', 'Registro salvo no prototipo nativo.')
		onNavigate('home')
	}

	const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
		setShowDatePicker(false)
		if (event.type !== 'set' || !date) {
			return
		}

		setSelectedAt((current) => {
			const next = new Date(current)
			next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
			return next
		})
	}

	const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
		setShowTimePicker(false)
		if (event.type !== 'set' || !date) {
			return
		}

		setSelectedAt((current) => {
			const next = new Date(current)
			next.setHours(date.getHours(), date.getMinutes(), 0, 0)
			return next
		})
	}

	const handleCancel = () => {
		setPhotos(0)
		setBehaviors([])
		onNavigate('home')
	}

	return (
		<View style={appStyles.registerScreen}>
			<Header title="Novo Registro" />
			<ScrollView
				contentContainerStyle={appStyles.registerContent}
				style={appStyles.registerScroll}
			>
				<View style={appStyles.registerCard}>
					<View style={appStyles.registerSectionTitleRow}>
						<Ionicons name="camera-outline" size={22} color="#125ED0" />
						<Text style={appStyles.registerSectionTitleTextBlue}>
							INFORMAÇÕES DO AVISTAMENTO
						</Text>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="camera-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								IMAGENS DO AVISTAMENTO
							</Text>
						</View>

						<Pressable
							onPress={() => setPhotos((value) => value + 1)}
							style={appStyles.registerDropZone}
						>
							<View style={appStyles.registerDropZoneIconWrap}>
								<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
							</View>
							<Text style={appStyles.registerDropZoneTitle}>
								Clique para adicionar fotos
							</Text>
							<Text style={appStyles.registerDropZoneText}>
								ou arraste e solte aqui
							</Text>
						</Pressable>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="pulse-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								COMPORTAMENTO OBSERVADO
							</Text>
						</View>

						<RegisterBehaviorList
							behaviorOrder={behaviorOrder}
							behaviors={behaviors}
							toggleBehavior={toggleBehavior}
						/>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="calendar-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								DATA E HORA DO AVISTAMENTO
							</Text>
						</View>

						<View style={appStyles.registerDateRow}>
							<Pressable
								onPress={() => setShowDatePicker(true)}
								style={appStyles.registerDateField}
							>
								<Text style={appStyles.registerDateFieldText}>
									{selectedDate}
								</Text>
								<Ionicons name="calendar-outline" size={16} color="#1A1A1A" />
							</Pressable>

							<Pressable
								onPress={() => setShowTimePicker(true)}
								style={appStyles.registerDateField}
							>
								<Text style={appStyles.registerDateFieldText}>
									{selectedTime}
								</Text>
								<Ionicons name="time-outline" size={16} color="#1A1A1A" />
							</Pressable>
						</View>

						{showDatePicker ? (
							<DateTimePicker
								mode="date"
								value={selectedAt}
								onChange={handleDateChange}
							/>
						) : null}

						{showTimePicker ? (
							<DateTimePicker
								mode="time"
								value={selectedAt}
								onChange={handleTimeChange}
							/>
						) : null}
					</View>

					<View style={appStyles.registerActionsRow}>
						<ActionButton
							title="SALVAR REGISTRO"
							onPress={handleSave}
							fullWidth={false}
							containerStyle={appStyles.registerSaveButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
						<ActionButton
							title="CANCELAR"
							onPress={handleCancel}
							variant="secondary"
							fullWidth={false}
							containerStyle={appStyles.registerCancelButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default RegisterScreen
