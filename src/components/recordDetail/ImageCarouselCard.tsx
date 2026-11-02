import React from 'react'
import { FlatList, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useImageCarousel } from '../../hooks/useImageCarousel'
import { appStyles } from '../../styles/appStyles'

type Props = {
	imageUris: string[]
	onImagePress: (index: number) => void
}

// Card "IMAGENS (n)": carrossel horizontal com setas e contador.
export function ImageCarouselCard({ imageUris, onImagePress }: Props) {
	const imageSlots = imageUris.length
	const carouselImages: (string | null)[] = imageSlots > 0 ? imageUris : [null]
	const {
		activeImageIndex,
		carouselWidth,
		setCarouselWidth,
		carouselRef,
		handleScrollEnd,
		handleArrowPress,
	} = useImageCarousel(imageSlots)

	return (
		<View style={appStyles.recordDetailCard}>
			<View style={appStyles.recordDetailSectionTitleRow}>
				<Ionicons name="camera-outline" size={16} color="#125ED0" />
				<Text style={appStyles.recordDetailSectionTitle}>
					IMAGENS ({imageSlots})
				</Text>
			</View>

			<View
				style={appStyles.recordDetailImageCarousel}
				onLayout={(event) => {
					setCarouselWidth(event.nativeEvent.layout.width)
				}}
			>
				<FlatList
					ref={carouselRef}
					data={carouselImages}
					style={appStyles.recordDetailCarouselList}
					horizontal
					pagingEnabled
					initialNumToRender={1}
					showsHorizontalScrollIndicator={false}
					bounces={imageSlots > 1}
					onMomentumScrollEnd={handleScrollEnd}
					keyExtractor={(imageUri, index) => `${imageUri ?? 'img'}-${index}`}
					renderItem={({ item: imageUri, index }) => (
						<View
							style={[
								appStyles.recordDetailCarouselSlide,
								{ width: carouselWidth || 1 },
							]}
						>
							{imageUri ? (
								<Pressable
									onPress={() => onImagePress(index)}
									style={appStyles.recordDetailCarouselImagePressable}
								>
									<Image
										source={{ uri: imageUri }}
										style={appStyles.recordDetailCarouselImage}
										resizeMode="cover"
									/>
								</Pressable>
							) : (
								<View style={appStyles.recordDetailCarouselPlaceholder}>
									<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
									<Text style={appStyles.recordDetailEmptyText}>
										Nenhuma imagem disponível.
									</Text>
								</View>
							)}
						</View>
					)}
				/>

				{imageSlots > 1 && activeImageIndex > 0 && (
					<Pressable
						onPress={() => handleArrowPress(activeImageIndex - 1)}
						accessibilityRole="button"
						accessibilityLabel="Imagem anterior"
						style={[
							appStyles.recordDetailCarouselArrow,
							appStyles.recordDetailCarouselArrowLeft,
						]}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
				)}

				{imageSlots > 1 && activeImageIndex < imageSlots - 1 && (
					<Pressable
						onPress={() => handleArrowPress(activeImageIndex + 1)}
						accessibilityRole="button"
						accessibilityLabel="Próxima imagem"
						style={[
							appStyles.recordDetailCarouselArrow,
							appStyles.recordDetailCarouselArrowRight,
						]}
					>
						<Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
					</Pressable>
				)}
			</View>

			{imageSlots > 0 && (
				<Text style={appStyles.recordDetailCarouselCounter}>
					Imagem {activeImageIndex + 1} de {imageSlots}
				</Text>
			)}
		</View>
	)
}
