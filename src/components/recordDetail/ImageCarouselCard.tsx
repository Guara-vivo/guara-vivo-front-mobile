import { FlatList, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useImageCarousel } from '../../hooks/useImageCarousel'
import { appStyles } from '../../styles/appStyles'
import { colors } from '../../constants/theme'
import { HeaderBackButton } from '../HeaderBackButton'
import { SkeletonImage } from '../SkeletonImage'

type Props = {
	imageUris: string[]
	onImagePress: (index: number) => void
	onBack: () => void
}

// Foto em largura total no topo: voltar, contador e setas por cima; tocar abre a análise.
export function ImageCarouselCard({ imageUris, onImagePress, onBack }: Props) {
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
		<View
			style={appStyles.recordDetailHero}
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
						style={[appStyles.recordDetailCarouselSlide, { width: carouselWidth || 1 }]}
					>
						{imageUri ? (
							<Pressable
								onPress={() => onImagePress(index)}
								accessibilityRole="button"
								accessibilityLabel={`Abrir análise da imagem ${index + 1}`}
								style={appStyles.recordDetailCarouselImagePressable}
							>
								<SkeletonImage uri={imageUri} style={appStyles.recordDetailCarouselImage} />
							</Pressable>
						) : (
							<View style={appStyles.recordDetailCarouselPlaceholder}>
								<Ionicons name="camera-outline" size={44} color={colors.muted} />
								<Text style={appStyles.recordDetailEmptyText}>Nenhuma imagem disponível.</Text>
							</View>
						)}
					</View>
				)}
			/>

			<View style={appStyles.recordDetailHeroBack}>
				<HeaderBackButton onPress={onBack} />
			</View>

			{imageSlots > 0 && (
				<View style={appStyles.recordDetailHeroCounter}>
					<Text style={appStyles.recordDetailHeroCounterText}>
						{`${activeImageIndex + 1} de ${imageSlots}`}
					</Text>
				</View>
			)}

			{imageSlots > 1 && activeImageIndex > 0 && (
				<Pressable
					onPress={() => handleArrowPress(activeImageIndex - 1)}
					accessibilityRole="button"
					accessibilityLabel="Imagem anterior"
					style={[appStyles.recordDetailCarouselArrow, appStyles.recordDetailCarouselArrowLeft]}
				>
					<Ionicons name="chevron-back" size={24} color={colors.onColor} />
				</Pressable>
			)}

			{imageSlots > 1 && activeImageIndex < imageSlots - 1 && (
				<Pressable
					onPress={() => handleArrowPress(activeImageIndex + 1)}
					accessibilityRole="button"
					accessibilityLabel="Próxima imagem"
					style={[appStyles.recordDetailCarouselArrow, appStyles.recordDetailCarouselArrowRight]}
				>
					<Ionicons name="chevron-forward" size={24} color={colors.onColor} />
				</Pressable>
			)}
		</View>
	)
}
