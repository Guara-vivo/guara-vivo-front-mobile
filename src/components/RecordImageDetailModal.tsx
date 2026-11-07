import React, { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { RecordDetailItem } from '../types/records'
import { averageScore, getConfidenceLevel } from '../utils/confidence'
import type { Size } from '../utils/detectionFormatters'
import { SkeletonImage } from './SkeletonImage'
import { ConfidenceBanner } from './recordImage/ConfidenceBanner'
import { getDetectionScore } from './recordImage/DetectionCard'
import { DetectionOverlay } from './recordImage/DetectionOverlay'
import { DetectionsSection } from './recordImage/DetectionsSection'
import { colors, spacing } from '../constants/theme'

interface RecordImageDetailModalProps {
	visible: boolean
	imageIndex: number
	imageUri: string
	totalImages: number
	onClose: () => void
	onImageChange?: (nextIndex: number) => void
	record: RecordDetailItem
}

export function RecordImageDetailModal({
	visible,
	imageIndex,
	imageUri,
	totalImages,
	onClose,
	onImageChange,
	record,
}: RecordImageDetailModalProps) {
	const insets = useSafeAreaInsets()
	// Tamanho original vem do onLoad da própria imagem exibida (sem baixar a foto duas vezes).
	// O tamanho fica amarrado à foto que o gerou: ao trocar de foto, as caixas novas não aparecem
	// por um quadro sobre a foto anterior (o estado antigo ainda existe no render da troca).
	const [loadedImage, setLoadedImage] = useState<{ uri: string; size: Size } | null>(null)
	const imageSize = loadedImage?.uri === imageUri ? loadedImage.size : null
	const [containerSize, setContainerSize] = useState<Size | null>(null)

	const imageAnalysis = record.image_analyses?.[imageIndex]
	const detections = imageAnalysis?.detections
	// A API informa o tamanho da foto original (base do bbox). O `onLoad` só serve de reserva para
	// análises antigas: no Android ele reporta a imagem já reduzida e deixa a caixa torta em fotos grandes.
	// As caixas só aparecem depois que a foto carrega (`imageSize`), para não piscar sobre a foto anterior.
	const overlaySize = imageAnalysis?.image_size ?? imageSize
	const canGoPrevious = imageIndex > 0
	const canGoNext = imageIndex < totalImages - 1

	const level = useMemo(() => {
		const score = averageScore((detections ?? []).map(getDetectionScore))
		return score === null ? null : getConfidenceLevel(score)
	}, [detections])

	const handleImageChange = (nextIndex: number) => {
		if (nextIndex < 0 || nextIndex >= totalImages) {
			return
		}

		onImageChange?.(nextIndex)
	}

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<View style={appStyles.recordImageModalScreen} accessibilityViewIsModal>
				<View style={[appStyles.recordImageModalTopBar, { paddingTop: insets.top }]}>
					<Text style={appStyles.recordImageModalTitle} accessibilityRole="header">
						Análise da imagem
					</Text>
					<Pressable
						onPress={onClose}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel="Fechar análise"
						style={appStyles.headerActionButton}
					>
						<Ionicons name="close" size={22} color={colors.text} />
					</Pressable>
				</View>

				<ScrollView
					contentContainerStyle={[
						appStyles.recordImageModalContent,
						{ paddingBottom: insets.bottom + spacing.xl },
					]}
				>
					<View
						style={appStyles.recordImageModalImageContainer}
						onLayout={(e) => {
							const { width, height } = e.nativeEvent.layout
							setContainerSize({ width, height })
						}}
					>
						{imageUri ? (
							<>
								<SkeletonImage
									uri={imageUri}
									style={appStyles.recordImageModalImage}
									contentFit="contain"
									recycle={false}
									transition={0}
									accessibilityLabel={`Foto ${imageIndex + 1} de ${totalImages}`}
									onLoad={(event) =>
										setLoadedImage({
											uri: imageUri,
											size: { width: event.source.width, height: event.source.height },
										})
									}
								/>
								{imageSize && overlaySize && containerSize && detections && (
									<DetectionOverlay
										detections={detections}
										containerSize={containerSize}
										imageSize={overlaySize}
									/>
								)}
							</>
						) : (
							<View style={appStyles.recordImageModalImagePlaceholder}>
								<Ionicons name="camera-outline" size={48} color={colors.onColor} />
							</View>
						)}

						{totalImages > 1 && canGoPrevious && onImageChange && (
							<Pressable
								onPress={() => handleImageChange(imageIndex - 1)}
								accessibilityRole="button"
								accessibilityLabel="Imagem anterior"
								style={[appStyles.recordImageModalArrow, appStyles.recordImageModalArrowLeft]}
							>
								<Ionicons name="chevron-back" size={24} color={colors.onColor} />
							</Pressable>
						)}

						{totalImages > 1 && canGoNext && onImageChange && (
							<Pressable
								onPress={() => handleImageChange(imageIndex + 1)}
								accessibilityRole="button"
								accessibilityLabel="Próxima imagem"
								style={[appStyles.recordImageModalArrow, appStyles.recordImageModalArrowRight]}
							>
								<Ionicons name="chevron-forward" size={24} color={colors.onColor} />
							</Pressable>
						)}

						<View style={appStyles.recordImageModalIndexBadge}>
							<Text style={appStyles.recordImageModalIndexText}>
								{`${imageIndex + 1} de ${totalImages}`}
							</Text>
						</View>
					</View>

					{imageAnalysis ? (
						<>
							<ConfidenceBanner
								level={level}
								detectionCount={imageAnalysis.detections.length}
								status={imageAnalysis.status_analise}
								avisos={imageAnalysis.avisos}
							/>
							<DetectionsSection analysis={imageAnalysis} />
						</>
					) : (
						<View style={appStyles.recordImageEmpty}>
							<Text style={appStyles.recordImageEmptyText}>
								Aguardando análise desta imagem...
							</Text>
						</View>
					)}
				</ScrollView>
			</View>
		</Modal>
	)
}

export default RecordImageDetailModal
