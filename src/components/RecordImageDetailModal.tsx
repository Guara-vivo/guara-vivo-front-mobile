import React from 'react'
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
	Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { DetectionItem, RecordDetailItem } from '../types/records'

interface RecordImageDetailModalProps {
	visible: boolean
	imageIndex: number
	imageUri: string
	totalImages: number
	onClose: () => void
	record: RecordDetailItem
}

type AccuracySummary = {
	deteccao_yolo: number
	classificacao_guara: number
	classificacao_cor: number
	classificacao_fase_vida: number
	estimativa_distancia: number
}

export function RecordImageDetailModal({
	visible,
	imageIndex,
	imageUri,
	totalImages,
	onClose,
	record,
}: RecordImageDetailModalProps) {
	const imageAnalysis = record.image_analyses?.[imageIndex]
	
	const statusLabels: Record<string, string> = {
		pending: 'Pendente',
		processing: 'Em análise',
		completed: 'Concluída',
		failed: 'Falhou',
	}

	const statusColors: Record<string, string> = {
		pending: '#F2A71B',
		processing: '#125ED0',
		completed: '#00A651',
		failed: '#F2201F',
	}

	const getStatusColor = (status?: string) => {
		if (!status) return colors.border
		return statusColors[status] ?? colors.border
	}

	// Calculate accuracy summary for all detections in this image
	const calculateSummary = (): AccuracySummary | null => {
		if (!imageAnalysis?.detections || imageAnalysis.detections.length === 0) {
			return null
		}

		const detections = imageAnalysis.detections
		let yolo = 0,
			guara = 0,
			cor = 0,
			fase = 0,
			distancia = 0
		let count = 0

		for (const detection of detections) {
			if (detection.raw_detection?.acuracia) {
				const acc = detection.raw_detection.acuracia
				yolo += acc.deteccao_yolo || 0
				guara += acc.classificacao_guara || 0
				cor += acc.classificacao_cor || 0
				fase += acc.classificacao_fase_vida || 0
				distancia += acc.estimativa_distancia || 0
				count++
			}
		}

		if (count === 0) return null

		return {
			deteccao_yolo: yolo / count,
			classificacao_guara: guara / count,
			classificacao_cor: cor / count,
			classificacao_fase_vida: fase / count,
			estimativa_distancia: distancia / count,
		}
	}

	const summary = calculateSummary()

	const formatPercent = (value: number | undefined): string => {
		if (typeof value !== 'number') return 'N/A'
		return `${(value * 100).toFixed(1)}%`
	}

	const getPlumageLabel = (color: string): string => {
		const colorMap: Record<string, string> = {
			vermelho: 'Vermelho',
			cinza: 'Cinza',
			red: 'Vermelho',
			gray: 'Cinza',
		}
		return colorMap[color.toLowerCase()] || color
	}

	const getLifeStageLabel = (stage: string): string => {
		const stageMap: Record<string, string> = {
			adulto: 'Adulto',
			filhote: 'Filhote',
			adult: 'Adulto',
			chick: 'Filhote',
		}
		return stageMap[stage.toLowerCase()] || stage
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
						<Pressable onPress={onClose} hitSlop={8}>
							<Ionicons name="close" size={24} color="#1A1A1A" />
						</Pressable>
					</View>

					<ScrollView
						contentContainerStyle={appStyles.recordImageModalContent}
					>
						{/* Image Preview */}
						<View style={appStyles.recordImageModalImageContainer}>
							{imageUri ? (
								<Image
									source={{ uri: imageUri }}
									style={appStyles.recordImageModalImage}
									resizeMode="contain"
								/>
							) : (
								<View style={appStyles.recordImageModalImagePlaceholder}>
									<Ionicons
										name="camera-outline"
										size={48}
										color="#8FB0F4"
									/>
								</View>
							)}
						</View>

						{/* Image Index Label */}
						<View style={appStyles.recordImageModalIndexBadge}>
							<Text style={appStyles.recordImageModalIndexText}>
								Imagem {imageIndex + 1} de {totalImages}
							</Text>
						</View>

						{/* Analysis Status */}
						<View style={appStyles.recordImageModalSection}>
							<View style={appStyles.recordImageModalSectionTitleRow}>
								<Ionicons
									name="pulse-outline"
									size={16}
									color={getStatusColor(record.status)}
								/>
								<Text style={appStyles.recordImageModalSectionTitle}>
									STATUS DA ANÁLISE
								</Text>
							</View>

							<View
								style={[
									appStyles.recordImageModalStatusBadge,
									{
										backgroundColor:
											getStatusColor(record.status) + '20',
										borderColor: getStatusColor(record.status),
									},
								]}
							>
								<Text
									style={[
										appStyles.recordImageModalStatusText,
										{
											color: getStatusColor(record.status),
										},
									]}
								>
									{statusLabels[record.status ?? 'pending'] ??
										record.status ??
										'N/A'}
								</Text>
							</View>
						</View>

						{/* Summary of Detections */}
						{imageAnalysis && summary && (
							<View style={appStyles.recordImageModalSection}>
								<View
									style={appStyles.recordImageModalSectionTitleRow}
								>
									<Ionicons
										name="bar-chart-outline"
										size={16}
										color="#125ED0"
									/>
									<Text
										style={
											appStyles.recordImageModalSectionTitle
										}
									>
										RESUMO TÉCNICO
									</Text>
								</View>

								<View
									style={
										appStyles.recordImageModalSummaryGrid
									}
								>
									<View
										style={
											appStyles.recordImageModalAccuracyItem
										}
									>
										<Text
											style={
												appStyles.recordImageModalAccuracyLabel
											}
										>
											Ave Detectada
										</Text>
										<Text
											style={
												appStyles.recordImageModalAccuracyValue
											}
										>
											{formatPercent(
												summary.deteccao_yolo
											)}
										</Text>
									</View>

									<View
										style={
											appStyles.recordImageModalAccuracyItem
										}
									>
										<Text
											style={
												appStyles.recordImageModalAccuracyLabel
											}
										>
											Guará-vermelho
										</Text>
										<Text
											style={
												appStyles.recordImageModalAccuracyValue
											}
										>
											{formatPercent(
												summary.classificacao_guara
											)}
										</Text>
									</View>

									<View
										style={
											appStyles.recordImageModalAccuracyItem
										}
									>
										<Text
											style={
												appStyles.recordImageModalAccuracyLabel
											}
										>
											Plumagem
										</Text>
										<Text
											style={
												appStyles.recordImageModalAccuracyValue
											}
										>
											{formatPercent(summary.classificacao_cor)}
										</Text>
									</View>

									<View
										style={
											appStyles.recordImageModalAccuracyItem
										}
									>
										<Text
											style={
												appStyles.recordImageModalAccuracyLabel
											}
										>
											Fase da Vida
										</Text>
										<Text
											style={
												appStyles.recordImageModalAccuracyValue
											}
										>
											{formatPercent(
												summary.classificacao_fase_vida
											)}
										</Text>
									</View>
								</View>
							</View>
						)}

						{/* Per-Individual Detections */}
						{imageAnalysis ? (
							<View style={appStyles.recordImageModalSection}>
								<View
									style={appStyles.recordImageModalSectionTitleRow}
								>
									<Ionicons
										name="search-outline"
										size={16}
										color="#125ED0"
									/>
									<Text
										style={
											appStyles.recordImageModalSectionTitle
										}
									>
										DETECÇÕES (
										{imageAnalysis.ibis_quantity})
									</Text>
								</View>

								{imageAnalysis.ibis_quantity === 0 ? (
									<View
										style={
											appStyles.recordImageModalEmptyState
										}
									>
										<Text
											style={
												appStyles.recordImageModalEmptyText
											}
										>
											Nenhuma detecção nesta imagem.
										</Text>
									</View>
								) : (
									<View
										style={
											appStyles.recordImageModalIbisList
										}
									>
										{imageAnalysis.detections.map(
											(detection: DetectionItem, idx: number) => (
												<View
													key={detection.id}
													style={
														appStyles.recordImageModalIbisItemExpanded
													}
												>
													<View
														style={
															appStyles.recordImageModalIbisHeader
														}
													>
														<View
															style={
																appStyles.recordImageModalIbisColorBadge
															}
														>
															<Ionicons
																name="ellipse"
																size={14}
																color="#FFFFFF"
															/>
														</View>
														<View
															style={
																appStyles.recordImageModalIbisInfo
															}
														>
															<Text
																style={
																	appStyles.recordImageModalIbisIndex
																}
															>
																Indivíduo{' '}
																{idx + 1}
															</Text>
														</View>
													</View>

													<View
														style={
															appStyles.recordImageModalIbisDetails
														}
													>
														<View
															style={
																appStyles.recordImageModalDetailRow
															}
														>
															<Text
																style={
																	appStyles.recordImageModalDetailLabel
																}
															>
																Plumagem:
															</Text>
															<Text
																style={
																	appStyles.recordImageModalDetailValue
																}
															>
																{getPlumageLabel(
																	detection.color
																)}
															</Text>
														</View>

														<View
															style={
																appStyles.recordImageModalDetailRow
															}
														>
															<Text
																style={
																	appStyles.recordImageModalDetailLabel
																}
															>
																Fase da Vida:
															</Text>
															<Text
																style={
																	appStyles.recordImageModalDetailValue
																}
															>
																{getLifeStageLabel(
																	detection.age_group
																)}
															</Text>
														</View>

														{detection.raw_detection?.acuracia && (
															<View
																style={
																	appStyles.recordImageModalAccuraciesContainer
																}
															>
																<View
																	style={
																		appStyles.recordImageModalAccuracySmall
																	}
																>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallLabel
																		}
																	>
																		Ave
																	</Text>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallValue
																		}
																	>
																		{formatPercent(
																			detection
																				.raw_detection
																				.acuracia
																				.deteccao_yolo
																		)}
																	</Text>
																</View>

																<View
																	style={
																		appStyles.recordImageModalAccuracySmall
																	}
																>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallLabel
																		}
																	>
																		Guará
																	</Text>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallValue
																		}
																	>
																		{formatPercent(
																			detection
																				.raw_detection
																				.acuracia
																				.classificacao_guara
																		)}
																	</Text>
																</View>

																<View
																	style={
																		appStyles.recordImageModalAccuracySmall
																	}
																>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallLabel
																		}
																	>
																		Cor
																	</Text>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallValue
																		}
																	>
																		{formatPercent(
																			detection
																				.raw_detection
																				.acuracia
																				.classificacao_cor
																		)}
																	</Text>
																</View>

																<View
																	style={
																		appStyles.recordImageModalAccuracySmall
																	}
																>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallLabel
																		}
																	>
																		Fase
																	</Text>
																	<Text
																		style={
																			appStyles.recordImageModalAccuracySmallValue
																		}
																	>
																		{formatPercent(
																			detection
																				.raw_detection
																				.acuracia
																				.classificacao_fase_vida
																		)}
																	</Text>
																</View>
															</View>
														)}
													</View>
												</View>
											)
										)}
									</View>
								)}
							</View>
						) : (
							<View style={appStyles.recordImageModalSection}>
								<View
									style={
										appStyles.recordImageModalEmptyState
									}
								>
									<Text
										style={
											appStyles.recordImageModalEmptyText
										}
									>
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
