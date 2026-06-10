import React, { useRef, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import DateTimePicker, {
	type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Image, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import FeedbackModal from '../components/FeedbackModal'
import Header from '../components/Header'
import { RegisterBehaviorList } from '../components/RegisterBehaviorList'
import { ActionButton } from '../components/common'
import { colors } from '../constants/theme'
import { behaviorOptions } from '../constants/behaviors'
import { getToken } from '../services/authService'
import { invalidateRecordsCache } from '../services/recordsService'
import { uploadRecord } from '../services/recordsApi'
import { appStyles } from '../styles/appStyles'
import type { BirdBehavior, ReactNativeFile } from '../types/api'
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

const pressFeedbackDelayMs = 80
const MAX_IMAGES = 6
const MAX_TOTAL_BYTES = 10 * 1024 * 1024

type RegisterFeedback = {
	title: string
	message: string
	iconName: keyof typeof Ionicons.glyphMap
	iconColor: string
}


export function RegisterScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [selectedImages, setSelectedImages] = useState<ReactNativeFile[]>([])
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<Date | null>(null)
	const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [showTimePicker, setShowTimePicker] = useState(false)
	const [showLocationPicker, setShowLocationPicker] = useState(false)
	const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(null)
	const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isPickingImages, setIsPickingImages] = useState(false)
	const [isDropZonePressed, setIsDropZonePressed] = useState(false)
	const [feedback, setFeedback] = useState<RegisterFeedback | null>(null)
	const locationFetchedRef = useRef(false)

	const selectedDateLabel = selectedDate?.toLocaleDateString('pt-BR')
	const selectedTimeLabel = selectedTime?.toLocaleTimeString('pt-BR', {
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
		if (isSaving || isPickingImages) {
			return
		}

		setIsPickingImages(true)
		setIsDropZonePressed(true)
		try {
			await new Promise((resolve) => setTimeout(resolve, pressFeedbackDelayMs))
			setIsDropZonePressed(false)

			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

			if (!permission.granted) {
				showErrorFeedback(
					'Permissão necessária',
					'Permita acesso às fotos para adicionar imagens.',
				)
				return
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				allowsMultipleSelection: true,
				mediaTypes: ['images'],
				quality: 0.8,
				selectionLimit: MAX_IMAGES,
			})
			if (result.canceled) {
				return
			}

			const oversized = result.assets.filter(
				(asset) => asset.fileSize && asset.fileSize > MAX_TOTAL_BYTES,
			)
			if (oversized.length > 0) {
				showErrorFeedback(
					'Imagem muito grande',
					'Cada imagem deve ter no máximo 10 MB.',
				)
				return
			}

			const newImages = result.assets.map((asset, index) => {
				const fallbackName = `guara-vivo-${index + 1}.jpg`
				const uriName = asset.uri.split('/').pop()

				return {
					uri: asset.uri,
					name: asset.fileName ?? uriName ?? fallbackName,
					type: asset.mimeType ?? 'image/jpeg',
				}
			})

			setSelectedImages((current) => {
				const existingUris = new Set(current.map((img) => img.uri))
				const uniqueNewImages = newImages.filter((img) => !existingUris.has(img.uri))

				return [...current, ...uniqueNewImages].slice(0, MAX_IMAGES)
			})
		} finally {
			setIsDropZonePressed(false)
			setIsPickingImages(false)
		}
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

			const token = await getToken()

			if (!token) {
				showErrorFeedback('Sessão expirada', 'Entre novamente para enviar o registro.')
				return
			}

			let latitude: number
			let longitude: number

			if (selectedLocation) {
				latitude = selectedLocation.latitude
				longitude = selectedLocation.longitude
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

				const position = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				})
				latitude = position.coords.latitude
				longitude = position.coords.longitude
			}

			const recordDateTime = composeRecordDateTime(selectedDate, selectedTime)

			await uploadRecord({
				behavior: apiBehaviors,
				dateTime: recordDateTime,
				images: selectedImages,
				latitude,
				longitude,
				token,
			})
			invalidateRecordsCache()

			setSelectedImages([])
			setBehaviors([])
			setSelectedDate(null)
			setSelectedTime(null)
			setSelectedLocation(null)
			setTempLocation(null)
			setShowDatePicker(false)
			setShowTimePicker(false)
			setShowLocationPicker(false)
			setFeedback({
				title: 'Registro enviado',
				message: 'Registro enviado para processamento com sucesso.',
				iconName: 'checkmark-circle-outline',
				iconColor: colors.secondary,
			})
		} catch {
			showErrorFeedback(
				'Falha no envio',
				'Não foi possível enviar o registro. Tente novamente.',
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

		setSelectedDate(date)
	}

	const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
		setShowTimePicker(false)
		if (event.type !== 'set' || !date) {
			return
		}

		setSelectedTime(date)
	}

	const openLocationPicker = async () => {
		if (isSaving) {
			return
		}

		setShowLocationPicker(true)

		if (!locationFetchedRef.current) {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync()
				if (status === 'granted') {
					const position = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced,
					})
					setUserLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					})
					locationFetchedRef.current = true
				}
			} catch {
				// location permission denied or unavailable, map uses default region
			}
		}
	}

	const closeLocationPicker = () => {
		setShowLocationPicker(false)
	}

	const confirmLocationPicker = () => {
		if (!tempLocation) {
			return
		}

		setSelectedLocation(tempLocation)
		setShowLocationPicker(false)
	}

	const clearSelectedLocation = () => {
		setSelectedLocation(null)
		setTempLocation(null)
	}

	const handleCancel = () => {
		if (isSaving) {
			return
		}

		setSelectedImages([])
		setBehaviors([])
		setSelectedDate(null)
		setSelectedTime(null)
		clearSelectedLocation()
		setShowLocationPicker(false)
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

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="camera-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								IMAGENS DO AVISTAMENTO
							</Text>
						</View>

						<Pressable
							onPress={handlePickImages}
							disabled={isSaving || isPickingImages}
							style={[
								appStyles.registerDropZone,
								isDropZonePressed && appStyles.registerDropZonePressed,
							]}
						>
							<View style={appStyles.registerDropZoneIconWrap}>
								{isPickingImages ? (
									<ActivityIndicator size="large" color="#125ED0" />
								) : (
									<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
								)}
							</View>
							<Text style={appStyles.registerDropZoneTitle}>
								{isPickingImages ? 'Preparando imagens...' : 'Clique para adicionar fotos'}
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
							behaviorOrder={behaviorOptions}
							behaviors={behaviors}
							toggleBehavior={toggleBehavior}
						/>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="location-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								LOCALIZAÇÃO DO AVISTAMENTO
							</Text>
						</View>

						<View style={appStyles.registerDateRow}>
							<View style={appStyles.registerDateField}>
								<Pressable
									onPress={openLocationPicker}
									disabled={isSaving}
									style={styles.locationFieldContent}
								>
									<Text
										style={[
											appStyles.registerDateFieldText,
											!selectedLocation && appStyles.registerDateFieldPlaceholder,
										]}
									>
										{selectedLocation ? 'Localização selecionada' : 'Localização atual do dispositivo'}
									</Text>
								</Pressable>
								{!selectedLocation && <Ionicons name="map-outline" size={16} color="#125ED0" />}
								{selectedLocation && (
									<Pressable
										onPress={clearSelectedLocation}
										disabled={isSaving}
										style={styles.locationClearButton}
									>
										<Ionicons name="close-circle" size={20} color={colors.primary} />
									</Pressable>
								)}
							</View>
						</View>
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
								<Text
									style={[
										appStyles.registerDateFieldText,
										!selectedDateLabel && appStyles.registerDateFieldPlaceholder,
									]}
								>
									{selectedDateLabel ?? 'Insira a data...'}
								</Text>
								<Ionicons name="calendar-outline" size={16} color="#125ED0" />
							</Pressable>

							<Pressable
								onPress={() => !isSaving && setShowTimePicker(true)}
								disabled={isSaving}
								style={appStyles.registerDateField}
							>
								<Text
									style={[
										appStyles.registerDateFieldText,
										!selectedTimeLabel && appStyles.registerDateFieldPlaceholder,
									]}
								>
									{selectedTimeLabel ?? 'Insira a hora...'}
								</Text>
								<Ionicons name="time-outline" size={16} color="#125ED0" />
							</Pressable>
						</View>

						{showDatePicker ? (
							<DateTimePicker
								mode="date"
								value={selectedDate ?? new Date()}
								onChange={handleDateChange}
							/>
						) : null}

						{showTimePicker ? (
							<DateTimePicker
								mode="time"
								value={selectedTime ?? new Date()}
								onChange={handleTimeChange}
							/>
						) : null}
					</View>

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
               	setTempLocation(null)
                }
              }
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

			{showLocationPicker && (
				<View style={styles.locationPickerOverlay}>
					<MapView
						style={styles.pickerMap}
						initialRegion={userLocation ? {
							latitude: userLocation.latitude,
							longitude: userLocation.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						} : {
							latitude: -24.4959,
							longitude: -47.8431,
							latitudeDelta: 0.05,
							longitudeDelta: 0.05,
						}}
						onPress={(e) => setTempLocation(e.nativeEvent.coordinate)}
					>
						{userLocation && (
							<Marker
								coordinate={userLocation}
								anchor={{ x: 0.5, y: 0.5 }}
							>
								<View style={styles.userMarkerContainer}>
									<View style={styles.userMarkerCircle}>
										<Ionicons name="navigate" size={16} color="#FFFFFF" />
									</View>
								</View>
							</Marker>
						)}
						{tempLocation && (
							<Marker coordinate={tempLocation} />
						)}
					</MapView>
					<View style={styles.pickerHeader}>
						<Pressable
							onPress={closeLocationPicker}
							style={styles.pickerButton}
						>
							<Ionicons name="arrow-back" size={24} color={colors.text} />
							<Text style={styles.pickerButtonText}>Voltar</Text>
						</Pressable>
						<Pressable
							onPress={confirmLocationPicker}
							disabled={!tempLocation}
							style={[
								styles.pickerButton,
								!tempLocation && { opacity: 0.5 },
							]}
						>
							<Text style={styles.pickerButtonConfirmText}>Confirmar Localização</Text>
						</Pressable>
					</View>
				</View>
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

const styles = StyleSheet.create({
	locationFieldContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 6,
	},
	locationClearButton: {
		paddingLeft: 8,
	},
	locationPickerOverlay: {
		...StyleSheet.absoluteFillObject,
		zIndex: 1000,
		backgroundColor: colors.background,
	},
	pickerMap: {
		...StyleSheet.absoluteFillObject,
	},
	pickerHeader: {
		position: 'absolute',
		top: 50,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		zIndex: 1001,
	},
	pickerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		gap: 4,
		borderWidth: 1,
		borderColor: colors.border,
	},
	pickerButtonText: {
		color: colors.text,
		fontSize: 14,
		fontWeight: '600',
	},
	pickerButtonConfirmText: {
		color: colors.secondary,
		fontSize: 14,
		fontWeight: '700',
	},
	userMarkerContainer: {
		width: 54,
		height: 54,
	},
	userMarkerCircle: {
		width: 24,
		height: 24,
		borderRadius: 22,
		backgroundColor: colors.secondary,
		borderWidth: 1,
		borderColor: colors.surface,
		alignItems: 'center',
		padding: 3,
		justifyContent: 'center',
		shadowColor: colors.secondary,
		shadowOpacity: 0.4,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
	},
})

export default RegisterScreen
