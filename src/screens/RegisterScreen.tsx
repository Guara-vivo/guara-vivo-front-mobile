import React, { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import FeedbackModal from '../components/FeedbackModal'
import Header from '../components/Header'
import { ActionButton } from '../components/common'
import RegisterBehaviorList from '../components/RegisterBehaviorList'
import { colors } from '../constants/theme'
import { getToken } from '../services/authService'
import { invalidateRecordsCache } from '../services/recordsService'
import { uploadRecord } from '../services/recordsApi'
import { appStyles } from '../styles/appStyles'
import type { BirdBehavior, ReactNativeFile } from '../types/api'
import type { ScreenId } from '../types/navigation'

const behaviorApiMap: Partial<Record<string, BirdBehavior>> = {
	Alimentando: 'alimentando-se',
	Ninhando: 'ninhando',
	Voando: 'voando',
}

const pressFeedbackDelayMs = 80

type RegisterFeedback = {
	title: string
	message: string
	iconName: keyof typeof Ionicons.glyphMap
	iconColor: string
}

export function RegisterScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [selectedImages, setSelectedImages] = useState<ReactNativeFile[]>([])
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedAt, setSelectedAt] = useState(new Date())
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [showTimePicker, setShowTimePicker] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isDropZonePressed, setIsDropZonePressed] = useState(false)
	const [feedback, setFeedback] = useState<RegisterFeedback | null>(null)
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

	const showErrorFeedback = (title: string, message: string) => {
		setFeedback({
			title,
			message,
			iconName: 'alert-circle-outline',
			iconColor: colors.primary,
		})
	}

	const handlePickImages = async () => {
		if (isSaving) {
			return
		}

		setIsDropZonePressed(true)
		await new Promise((resolve) => setTimeout(resolve, pressFeedbackDelayMs))
		setIsDropZonePressed(false)

		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permission.granted) {
			showErrorFeedback(
				'Permissao necessaria',
				'Permita acesso as fotos para adicionar imagens.',
			)
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true,
			mediaTypes: ['images'],
			quality: 0.8,
			selectionLimit: 20,
		})

		if (result.canceled) {
			return
		}

		setSelectedImages(
			result.assets.slice(0, 20).map((asset, index) => {
				const fallbackName = `guara-vivo-${index + 1}.jpg`
				const uriName = asset.uri.split('/').pop()

				return {
					uri: asset.uri,
					name: asset.fileName ?? uriName ?? fallbackName,
					type: asset.mimeType ?? 'image/jpeg',
				}
			}),
		)
	}

	const handleRemoveImage = async (imageUri: string) => {
		if (isSaving) {
			return
		}

		setSelectedImages((current) =>
			current.filter((image) => image.uri !== imageUri),
		)
	}

	const handleSave = async () => {
		if (isSaving) {
			return
		}

		if (selectedImages.length === 0) {
			showErrorFeedback(
				'Imagem obrigatoria',
				'Adicione pelo menos uma imagem para salvar o registro.',
			)
			return
		}

		const apiBehaviors = behaviors
			.map((behavior) => behaviorApiMap[behavior])
			.filter((behavior): behavior is BirdBehavior => Boolean(behavior))

		if (apiBehaviors.length === 0) {
			showErrorFeedback(
				'Comportamento invalido',
				'Selecione um comportamento valido para enviar o registro.',
			)
			return
		}

		try {
			setIsSaving(true)

			const token = await getToken()

			if (!token) {
				showErrorFeedback('Sessao expirada', 'Entre novamente para enviar o registro.')
				return
			}

			const permission = await Location.requestForegroundPermissionsAsync()

			if (!permission.granted) {
				showErrorFeedback(
					'Permissao necessaria',
					'Permita acesso a localizacao para enviar o registro.',
				)
				return
			}

			const position = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			})

			await uploadRecord({
				behavior: apiBehaviors,
				dateTime: selectedAt,
				images: selectedImages,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				token,
			})
			invalidateRecordsCache()

			setSelectedImages([])
			setBehaviors([])
			setSelectedAt(new Date())
			setShowDatePicker(false)
			setShowTimePicker(false)
			setFeedback({
				title: 'Registro enviado',
				message: 'Registro enviado para processamento com sucesso.',
				iconName: 'checkmark-circle-outline',
				iconColor: colors.secondary,
			})
		} catch {
			showErrorFeedback(
				'Falha no envio',
				'Nao foi possivel enviar o registro. Tente novamente.',
			)
		} finally {
			setIsSaving(false)
		}
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
		if (isSaving) {
			return
		}

		setSelectedImages([])
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
							onPress={handlePickImages}
							disabled={isSaving}
							style={[
								appStyles.registerDropZone,
								isDropZonePressed && appStyles.registerDropZonePressed,
							]}
						>
							<View style={appStyles.registerDropZoneIconWrap}>
								<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
							</View>
							<Text style={appStyles.registerDropZoneTitle}>
								Clique para adicionar fotos
							</Text>
						</Pressable>

						{selectedImages.length > 0 ? (
							<View style={appStyles.registerImagePreviewGrid}>
								{selectedImages.map((image) => (
									<View key={image.uri} style={appStyles.registerImagePreviewWrap}>
										<Image
											source={{ uri: image.uri }}
											style={appStyles.registerImagePreview}
											resizeMode="cover"
										/>
										<Pressable
											onPress={() => handleRemoveImage(image.uri)}
											disabled={isSaving}
											hitSlop={8}
											style={({ pressed }) => [
												appStyles.registerImageRemoveButton,
												pressed && appStyles.registerImageRemoveButtonPressed,
											]}
										>
											<Ionicons name="close" size={14} color="#FFFFFF" />
										</Pressable>
									</View>
								))}
							</View>
						) : null}
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
								onPress={() => !isSaving && setShowDatePicker(true)}
								disabled={isSaving}
								style={appStyles.registerDateField}
							>
								<Text style={appStyles.registerDateFieldText}>
									{selectedDate}
								</Text>
								<Ionicons name="calendar-outline" size={16} color="#1A1A1A" />
							</Pressable>

							<Pressable
								onPress={() => !isSaving && setShowTimePicker(true)}
								disabled={isSaving}
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
							title={isSaving ? 'ENVIANDO...' : 'SALVAR REGISTRO'}
							onPress={handleSave}
							disabled={isSaving}
							fullWidth={false}
							containerStyle={appStyles.registerSaveButton}
							textStyle={appStyles.registerActionButtonLabel}
							leftIcon={
								isSaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : null
							}
						/>
						<ActionButton
							title="CANCELAR"
							onPress={handleCancel}
							disabled={isSaving}
							variant="secondary"
							fullWidth={false}
							containerStyle={appStyles.registerCancelButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
					</View>
				</View>
			</ScrollView>

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
