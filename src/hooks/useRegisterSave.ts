import * as Location from 'expo-location'
import {
	discardPendingRecord,
	enqueueRecord,
	flushPendingRecords,
} from '../services/offlineQueue'
import { getDevicePosition } from '../utils/deviceLocation'
import { composeRecordDateTime } from '../utils/registerDateTime'
import {
	saveErrorFeedback,
	savedFeedback,
	toApiBehaviors,
	type RegisterFeedback,
} from '../utils/registerFeedback'
import type { useRegisterImages } from './useRegisterImages'
import type { useRegisterLocation } from './useRegisterLocation'

type Params = {
	behaviors: string[]
	selectedDate: Date | null
	selectedTime: Date | null
	isSaving: boolean
	setIsSaving: (value: boolean) => void
	images: ReturnType<typeof useRegisterImages>
	location: ReturnType<typeof useRegisterLocation>
	showErrorFeedback: (title: string, message: string) => void
	setFeedback: (feedback: RegisterFeedback) => void
	// Limpa o formulário depois que o registro foi guardado ou enviado.
	onSaved: () => void
}

// Valida o formulário, guarda o registro no aparelho e tenta enviá-lo à API.
export function useRegisterSave({
	behaviors,
	selectedDate,
	selectedTime,
	isSaving,
	setIsSaving,
	images,
	location,
	showErrorFeedback,
	setFeedback,
	onSaved,
}: Params) {
	return async function handleSave() {
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

		const apiBehaviors = toApiBehaviors(behaviors)

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

			images.clearImages()
			location.resetLocation()
			onSaved()
			setFeedback(savedFeedback(outcome === 'sent'))
		} catch (error) {
			setFeedback(saveErrorFeedback(error))
		} finally {
			setIsSaving(false)
		}
	}
}
