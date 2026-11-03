import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import FeedbackModal from '../components/FeedbackModal'
import Header from '../components/Header'
import { LocationPickerModal } from '../components/register/LocationPickerModal'
import { RegisterDateTimeFields } from '../components/register/RegisterDateTimeFields'
import { RegisterImagePicker } from '../components/register/RegisterImagePicker'
import { RegisterLocationField } from '../components/register/RegisterLocationField'
import { RegisterSubsection } from '../components/register/RegisterSubsection'
import { RegisterBehaviorList } from '../components/RegisterBehaviorList'
import { ActionButton } from '../components/common'
import { behaviorOptions } from '../constants/behaviors'
import { useRegisterFeedback } from '../hooks/useRegisterFeedback'
import { useRegisterImages } from '../hooks/useRegisterImages'
import { useRegisterLocation } from '../hooks/useRegisterLocation'
import { useRegisterSave } from '../hooks/useRegisterSave'
import { appStyles } from '../styles/appStyles'
import type { MainTabParamList } from '../types/navigation'
import { colors } from '../constants/theme'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

export function RegisterScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<Date | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const { feedback, setFeedback, showErrorFeedback, clearFeedback } =
		useRegisterFeedback()

	const toggleBehavior = (behavior: string) => {
		setBehaviors((current) =>
			current.includes(behavior)
				? current.filter((item) => item !== behavior)
				: [...current, behavior],
		)
	}

	const resetFormFields = () => {
		setBehaviors([])
		setSelectedDate(null)
		setSelectedTime(null)
	}

	const images = useRegisterImages({ isSaving, onError: showErrorFeedback })
	const location = useRegisterLocation({ isSaving })

	const handleSave = useRegisterSave({
		behaviors,
		selectedDate,
		selectedTime,
		isSaving,
		setIsSaving,
		images,
		location,
		showErrorFeedback,
		setFeedback,
		onSaved: resetFormFields,
	})

	const handleCancel = () => {
		if (isSaving) {
			return
		}

		images.clearImages()
		resetFormFields()
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
				</View>
			</ScrollView>

			{/* Ações fixas: salvar/cancelar ficam sempre à vista, sem rolar o formulário. */}
			<View style={appStyles.registerFooter}>
				<ActionButton
					title="CANCELAR"
					variant="outline"
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
						isSaving ? <ActivityIndicator size="small" color={colors.onColor} /> : null
					}
				/>
			</View>

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
					onConfirm={clearFeedback}
				/>
			) : null}
		</View>
	)
}

export default RegisterScreen
