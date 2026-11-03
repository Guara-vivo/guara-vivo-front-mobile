import React, { useState } from 'react'
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useImageSize } from '../hooks/useImageSize'
import { appStyles } from '../styles/appStyles'
import type { RecordDetailItem } from '../types/records'
import { calculateAccuracySummary, type Size } from '../utils/detectionFormatters'
import { AccuracySummarySection } from './recordImage/AccuracySummarySection'
import { DetectionOverlay } from './recordImage/DetectionOverlay'
import { DetectionsSection } from './recordImage/DetectionsSection'

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
	const imageSize = useImageSize(imageUri)
	const [containerSize, setContainerSize] = useState<Size | null>(null)

	const imageAnalysis = record.image_analyses?.[imageIndex]
	const canGoPrevious = imageIndex > 0
	const canGoNext = imageIndex < totalImages - 1
	const summary = calculateAccuracySummary(imageAnalysis?.detections)

	const handleImageChange = (nextIndex: number) => {
		if (nextIndex < 0 || nextIndex >= totalImages) {
			return
		}

		onImageChange?.(nextIndex)
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={appStyles.recordImageModalBackdrop}>
				<View style={appStyles.recordImageModalCard}>
					<View style={appStyles.recordImageModalHeader}>
						<Text style={appStyles.recordImageModalTitle}>
							DETALHES DA IMAGEM
						</Text>
						<Pressable
							onPress={onClose}
							hitSlop={8}
							accessibilityRole="button"
							accessibilityLabel="Fechar"
						>
							<Ionicons name="close" size={24} color="#1A1A1A" />
						</Pressable>
					</View>

					<ScrollView
						contentContainerStyle={appStyles.recordImageModalContent}
					>
						{/* Image Preview */}
						<View
							style={appStyles.recordImageModalImageContainer}
							onLayout={(e) => {
								const { width, height } = e.nativeEvent.layout
								setContainerSize({ width, height })
							}}
						>
							{imageUri ? (
								<>
									<Image
										source={{ uri: imageUri }}
										style={appStyles.recordImageModalImage}
										contentFit="contain"
										cachePolicy="memory-disk"
										transition={150}
									/>
									{imageSize && containerSize && imageAnalysis?.detections && (
										<DetectionOverlay
											detections={imageAnalysis.detections}
											containerSize={containerSize}
											imageSize={imageSize}
										/>
									)}
								</>
							) : (
								<View style={appStyles.recordImageModalImagePlaceholder}>
									<Ionicons
										name="camera-outline"
										size={48}
										color="#8FB0F4"
									/>
								</View>
							)}

							{totalImages > 1 && canGoPrevious && onImageChange && (
								<Pressable
									onPress={() => handleImageChange(imageIndex - 1)}
									accessibilityRole="button"
									accessibilityLabel="Imagem anterior"
									style={[
										appStyles.recordImageModalArrow,
										appStyles.recordImageModalArrowLeft,
									]}
								>
									<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
								</Pressable>
							)}

							{totalImages > 1 && canGoNext && onImageChange && (
								<Pressable
									onPress={() => handleImageChange(imageIndex + 1)}
									accessibilityRole="button"
									accessibilityLabel="Próxima imagem"
									style={[
										appStyles.recordImageModalArrow,
										appStyles.recordImageModalArrowRight,
									]}
								>
									<Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
								</Pressable>
							)}
						</View>

						{/* Image Index Label */}
						<View style={appStyles.recordImageModalIndexBadge}>
							<Text style={appStyles.recordImageModalIndexText}>
								Imagem {imageIndex + 1} de {totalImages}
							</Text>
						</View>

						{/* Summary of Detections */}
						{imageAnalysis && summary && <AccuracySummarySection summary={summary} />}

						{/* Per-Individual Detections */}
						{imageAnalysis ? (
							<DetectionsSection analysis={imageAnalysis} />
						) : (
							<View style={appStyles.recordImageModalSection}>
								<View style={appStyles.recordImageModalEmptyState}>
									<Text style={appStyles.recordImageModalEmptyText}>
										Aguardando análise desta imagem...
									</Text>
								</View>
							</View>
						)}
					</ScrollView>

					<View style={appStyles.recordImageModalActions}>
						<Pressable
							onPress={onClose}
							style={appStyles.recordImageModalCloseButton}
						>
							<Text style={appStyles.recordImageModalCloseButtonText}>
								FECHAR
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default RecordImageDetailModal
