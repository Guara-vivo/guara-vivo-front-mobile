import { useEffect, useRef, useState } from 'react'
import type {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native'

// Estado do carrossel de imagens: índice ativo, largura medida e navegação por setas/swipe.
export function useImageCarousel(imageCount: number) {
	const [activeImageIndex, setActiveImageIndex] = useState(0)
	const [carouselWidth, setCarouselWidth] = useState(0)
	const carouselRef = useRef<FlatList<string | null>>(null)

	useEffect(() => {
		if (imageCount === 0) {
			setActiveImageIndex(0)
			return
		}

		setActiveImageIndex((current) => Math.min(current, imageCount - 1))
	}, [imageCount])

	const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (carouselWidth === 0 || imageCount === 0) {
			return
		}

		const nextIndex = Math.round(
			event.nativeEvent.contentOffset.x / carouselWidth,
		)
		setActiveImageIndex(Math.min(Math.max(nextIndex, 0), imageCount - 1))
	}

	const handleArrowPress = (nextIndex: number) => {
		if (carouselWidth === 0 || nextIndex < 0 || nextIndex >= imageCount) {
			return
		}

		setActiveImageIndex(nextIndex)
		carouselRef.current?.scrollToOffset({
			offset: nextIndex * carouselWidth,
			animated: true,
		})
	}

	return {
		activeImageIndex,
		carouselWidth,
		setCarouselWidth,
		carouselRef,
		handleScrollEnd,
		handleArrowPress,
	}
}
