import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getDevicePosition, LocationUnavailableError } from '../utils/deviceLocation'
import * as Location from 'expo-location'
import FeedbackModal from '../components/FeedbackModal'
import Header from '../components/Header'
import { LocationPickerModal } from '../components/register/LocationPickerModal'
import { RegisterDateTimeFields } from '../components/register/RegisterDateTimeFields'
import { RegisterImagePicker } from '../components/register/RegisterImagePicker'
import { RegisterLocationField } from '../components/register/RegisterLocationField'
import { RegisterSubsection } from '../components/register/RegisterSubsection'
import { RegisterBehaviorList } from '../components/RegisterBehaviorList'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { behaviorOptions } from '../constants/behaviors'
import { useRegisterImages } from '../hooks/useRegisterImages'
import { useRegisterLocation } from '../hooks/useRegisterLocation'
import {
	discardPendingRecord,
	enqueueRecord,
	flushPendingRecords,
	UploadLimitError,
} from '../services/offlineQueue'
import { appStyles } from '../styles/appStyles'
import type { BirdBehavior } from '../types/api'
import type { MainTabParamList } from '../types/navigation'
import { composeRecordDateTime } from '../utils/registerDateTime'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

const behaviorApiMap: Partial<Record<string, BirdBehavior>> = {
	Alimentando: 'alimentando-se',
	Ninhando: 'ninhando',
	Voando: 'voando',
	Vocalizando: 'vocalizando',
}

type RegisterFeedback = {
	title: string
	message: string
	iconName: keyof typeof Ionicons.glyphMap
	iconColor: string
}

export function RegisterScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<Date | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [feedback, setFeedback] = useState<RegisterFeedback | null>(null)

	const toggleBehavior = (behavior: string) => {
		setBehaviors((current) =>
			current.includes(behavior)
				? current.filter((item) => item !== behavior)
				: [...current, behavior],
		)
	}

	const showErrorFeedback = (title: string, message: string) => {
		setFeedback({
			title,
			message,
			iconName: 'alert-circle-outline',
			iconColor: colors.primary,
		})
	}

	const images = useRegisterImages({ isSaving, onError: showErrorFeedback })
	const location = useRegisterLocation({ isSaving })

	const handleSave = async () => {
		if (isSaving) {
			return
		}

		if (images.selectedImages.length === 0) {
			showErrorFeedback(
				'Imagem obrigatória',
				'Adicione pelo menos uma imagem para salvar o registro.',
			)
			return
		}

		const apiBehaviors = behaviors
			.map((behavior) => behaviorApiMap[behavior])
			.filter((behavior): behavior is BirdBehavior => Boolean(behavior))

		if (apiBehaviors.length === 0) {
			showErrorFeedback(
				'Comportamento inválido',
				'Selecione um comportamento válido para enviar o registro.',
			)
			return
		}

		try {
			setIsSaving(true)

			let latitude: number
			let longitude: number

			if (location.selectedLocation) {
				latitude = location.selectedLocation.latitude
				longitude = location.selectedLocation.longitude
			} else {
				const permission = await Location.requestForegroundPermissionsAsync()

				if (!permission.granted) {
					showErrorFeedback(
						'Permissão necessária',
						'Permita acesso à localização para enviar o registro.',
					)
					setIsSaving(false)
					return
				}

				const position = await getDevicePosition()
				latitude = position.latitude
				longitude = position.longitude
			}

			const recordDateTime = composeRecordDateTime(selectedDate, selectedTime)

			// Guarda no aparelho e tenta enviar; sem conexao, o envio fica para depois.
			const pending = await enqueueRecord({
				behavior: apiBehaviors,
				dateTime: recordDateTime,
				images: images.selectedImages,
				latitude,
				longitude,
			})
			const flush = await flushPendingRecords()
			const outcome = flush.outcomes[pending.clientUuid]

			if (outcome === 'rejected') {
				// Usuário ainda na tela: mostra o erro em vez de guardar um registro inválido.
				await discardPendingRecord(pending.clientUuid)
				throw new Error('Registro recusado pela API')
			}

			const wasSent = outcome === 'sent'

			images.clearImages()
			setBehaviors([])
			setSelectedDate(null)
			setSelectedTime(null)
			location.resetLocation()
			setFeedback({
				title: wasSent ? 'Registro enviado' : 'Registro salvo',
				message: wasSent
					? 'Registro enviado para processamento com sucesso.'
					: 'Não foi possível enviar agora. O registro foi salvo no aparelho e será enviado automaticamente.',
				iconName: 'checkmark-circle-outline',
				iconColor: colors.secondary,
			})
		} catch (error) {
			if (error instanceof UploadLimitError) {
				showErrorFeedback(
					'Imagens muito grandes',
					error.kind === 'image'
						? 'Cada imagem deve ter no máximo 5 MB.'
						: 'As imagens somam mais de 10 MB. Remova alguma.',
				)
				return
			}

			if (error instanceof LocationUnavailableError) {
				showErrorFeedback(
					'Localização indisponível',
					'Não foi possível obter a localização do aparelho. Escolha o local no mapa ou tente de novo em um lugar com sinal de GPS.',
				)
				return
			}

			showErrorFeedback(
				'Falha no envio',
				'Não foi possível enviar o registro. Tente novamente.',
			)
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		if (isSaving) {
			return
		}

		images.clearImages()
		setBehaviors([])
		setSelectedDate(null)
		setSelectedTime(null)
		location.clearSelectedLocation()
		location.closeLocationPicker()
		navigation.navigate('Home')
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

					<RegisterSubsection icon="camera-outline" title="IMAGENS DO AVISTAMENTO">
						<RegisterImagePicker
							images={images.selectedImages}
							isPicking={images.isPickingImages}
							isPressed={images.isDropZonePressed}
							disabled={isSaving}
							onPick={images.handlePickImages}
							onRemove={images.handleRemoveImage}
						/>
					</RegisterSubsection>

					<RegisterSubsection icon="pulse-outline" title="COMPORTAMENTO OBSERVADO">
						<RegisterBehaviorList
							behaviorOrder={behaviorOptions}
							behaviors={behaviors}
							toggleBehavior={toggleBehavior}
						/>
					</RegisterSubsection>

					<RegisterSubsection icon="location-outline" title="LOCALIZAÇÃO DO AVISTAMENTO">
						<RegisterLocationField
							hasSelectedLocation={Boolean(location.selectedLocation)}
							disabled={isSaving}
							onOpen={location.openLocationPicker}
							onClear={location.clearSelectedLocation}
						/>
					</RegisterSubsection>

					<RegisterSubsection icon="calendar-outline" title="DATA E HORA DO AVISTAMENTO">
						<RegisterDateTimeFields
							date={selectedDate}
							time={selectedTime}
							disabled={isSaving}
							onDateChange={setSelectedDate}
							onTimeChange={setSelectedTime}
						/>
					</RegisterSubsection>

					<View style={appStyles.registerActionsRow}>
						<ActionButton
							title="CANCELAR"
							onPress={handleCancel}
							disabled={isSaving}
							fullWidth={false}
							containerStyle={appStyles.registerCancelButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
						<ActionButton
							title={isSaving ? 'ENVIANDO...' : 'SALVAR REGISTRO'}
							onPress={() => {
								handleSave()
								location.setTempLocation(null)
							}}
							disabled={isSaving}
							fullWidth={false}
							containerStyle={appStyles.registerSaveButton}
							textStyle={appStyles.registerActionButtonLabel}
							leftIcon={
								isSaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : null
							}
						/>
					</View>
				</View>
			</ScrollView>

			{location.showLocationPicker && (
				<LocationPickerModal
					userLocation={location.userLocation}
					tempLocation={location.tempLocation}
					onSelect={location.setTempLocation}
					onBack={location.closeLocationPicker}
					onConfirm={location.confirmLocationPicker}
				/>
			)}

			{feedback ? (
				<FeedbackModal
					visible
					title={feedback.title}
					message={feedback.message}
					buttonLabel="OK"
					iconName={feedback.iconName}
					iconColor={feedback.iconColor}
					onConfirm={() => setFeedback(null)}
				/>
			) : null}
		</View>
	)
}

export default RegisterScreen
