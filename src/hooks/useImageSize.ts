import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import type { Size } from '../utils/detectionFormatters'

// Tamanho original (em pixels) da imagem; null enquanto carrega ou se falhar.
export function useImageSize(imageUri: string) {
	const [imageSize, setImageSize] = useState<Size | null>(null)

	useEffect(() => {
		let mounted = true
		setImageSize(null)

		if (imageUri) {
			Image.getSize(
				imageUri,
				(width, height) => {
					if (mounted) {
						setImageSize({ width, height })
					}
				},
				() => {
					if (mounted) {
						setImageSize(null)
					}
				},
			)
		}

		return () => {
			mounted = false
		}
	}, [imageUri])

	return imageSize
}
