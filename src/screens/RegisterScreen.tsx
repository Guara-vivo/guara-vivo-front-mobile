import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import FeedbackModal from '../components/FeedbackModal'
import { LocationPickerModal } from '../components/register/LocationPickerModal'
import { RegisterDateTimeFields } from '../components/register/RegisterDateTimeFields'
import { RegisterImagePicker } from '../components/register/RegisterImagePicker'
import { RegisterLocationField } from '../components/register/RegisterLocationField'
import { RegisterStepHeader } from '../components/register/RegisterStepHeader'
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
import { composeRecordDateTime } from '../utils/registerDateTime'
import { canAdvance, type RegisterStep } from '../utils/registerSteps'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

const STEP_COPY: Record<RegisterStep, { title: string; hint: string }> = {
	1: { title: 'Fotos do avistamento', hint: 'Adicione pelo menos uma foto.' },
	2: { title: 'O que os guarás estavam fazendo?', hint: 'Escolha um ou mais comportamentos.' },
	3: { title: 'Onde e quando?', hint: 'Já preenchemos com o local e a hora de agora.' },
}

export function RegisterScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [step, setStep] = useState<RegisterStep>(1)
	const [behaviors, setBehaviors] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
	const [selectedTime, setSelectedTime] = useState<Date>(() => new Date())
	const [isSaving, setIsSaving] = useState(false)
	const [justSaved, setJustSaved] = useState(false)
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
		setSelectedDate(new Date())
		setSelectedTime(new Date())
		setStep(1)
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
		onSaved: () => {
			setJustSaved(true)
			resetFormFields()
		},
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

	const handleFeedbackConfirm = () => {
		clearFeedback()
		if (justSaved) {
			setJustSaved(false)
			navigation.navigate('History')
		}
	}

	// Sem local escolhido no mapa, o registro usa o local do aparelho (pedido ao salvar).
	const dateTimeValid = composeRecordDateTime(selectedDate, selectedTime).getTime() <= Date.now()
	const ready = canAdvance(step, {
		imageCount: images.selectedImages.length,
		behaviors,
		hasLocation: true,
		dateTimeValid,
	})
	const copy = STEP_COPY[step]

	return (
		<View style={appStyles.registerScreen}>
			<RegisterStepHeader
				step={step}
				title={copy.title}
				hint={copy.hint}
				onBack={() => (step === 1 ? handleCancel() : setStep((step - 1) as RegisterStep))}
			/>

			<ScrollView
				contentContainerStyle={appStyles.registerContent}
				style={appStyles.registerScroll}
				keyboardShouldPersistTaps="handled"
			>
				{step === 1 ? (
					<RegisterImagePicker
						images={images.selectedImages}
						isPicking={images.isPickingImages}
						isPressed={images.isDropZonePressed}
						disabled={isSaving}
						onPick={images.handlePickImages}
						onRemove={images.handleRemoveImage}
					/>
				) : null}

				{step === 2 ? (
					<RegisterBehaviorList
						behaviorOrder={behaviorOptions}
						behaviors={behaviors}
						toggleBehavior={toggleBehavior}
					/>
				) : null}

				{step === 3 ? (
					<>
						<RegisterSubsection icon="location-outline" title="Local do avistamento">
							<RegisterLocationField
								hasSelectedLocation={Boolean(location.selectedLocation)}
								disabled={isSaving}
								onOpen={location.openLocationPicker}
								onClear={location.clearSelectedLocation}
							/>
						</RegisterSubsection>

						<RegisterSubsection icon="calendar-outline" title="Data e hora">
							<RegisterDateTimeFields
								date={selectedDate}
								time={selectedTime}
								disabled={isSaving}
								onDateChange={setSelectedDate}
								onTimeChange={setSelectedTime}
							/>
							{dateTimeValid ? null : (
								<Text style={appStyles.registerFieldError} accessibilityRole="alert">
									A data e a hora não podem estar no futuro.
								</Text>
							)}
						</RegisterSubsection>
					</>
				) : null}
			</ScrollView>

			{/* Ações fixas: voltar/continuar ficam sempre à vista, sem rolar o formulário. */}
			<View style={appStyles.registerFooter}>
				{step > 1 ? (
					<ActionButton
						title="Voltar"
						variant="outline"
						onPress={() => setStep((step - 1) as RegisterStep)}
						disabled={isSaving}
						fullWidth={false}
						containerStyle={appStyles.registerCancelButton}
						textStyle={appStyles.registerActionButtonLabel}
					/>
				) : null}
				<ActionButton
					title={step < 3 ? 'Continuar' : isSaving ? 'Enviando...' : 'Salvar registro'}
					onPress={() => {
						if (step < 3) {
							setStep((step + 1) as RegisterStep)
							return
						}

						handleSave()
						location.setTempLocation(null)
					}}
					disabled={isSaving || !ready}
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
					onConfirm={handleFeedbackConfirm}
				/>
			) : null}
		</View>
	)
}

export default RegisterScreen
