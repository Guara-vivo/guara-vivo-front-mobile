import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import type { ReactNativeFile } from '../types/api'

const pressFeedbackDelayMs = 80
const MAX_IMAGES = 6
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

type Params = {
	isSaving: boolean
	onError: (title: string, message: string) => void
}

// Imagens do registro: abre a galeria, valida o tamanho e mantem a lista escolhida.
export function useRegisterImages({ isSaving, onError }: Params) {
	const [selectedImages, setSelectedImages] = useState<ReactNativeFile[]>([])
	const [isPickingImages, setIsPickingImages] = useState(false)
	const [isDropZonePressed, setIsDropZonePressed] = useState(false)

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
				onError(
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
				(asset) => asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES,
			)
			if (oversized.length > 0) {
				onError(
					'Imagem muito grande',
					'Cada imagem deve ter no máximo 5 MB.',
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
		} catch {
			onError(
				'Erro ao abrir galeria',
				'Não foi possível acessar a galeria. Tente novamente.',
			)
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

	const clearImages = () => setSelectedImages([])

	return {
		selectedImages,
		isPickingImages,
		isDropZonePressed,
		handlePickImages,
		handleRemoveImage,
		clearImages,
	}
}
