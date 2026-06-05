import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	FlatList,
	Image,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import {
	formatDate,
	formatLocationLabel,
	formatTime,
} from '../utils/recordFormatters'
import { Header } from '../components/Header'
import {
	fetchRecordDetail,
	getCachedRecordDetailSnapshot,
	isRecordDetailCacheFresh,
	type RecordDetailItem,
} from '../services/recordsService'
import RecordImageDetailModal from '../components/RecordImageDetailModal'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export function RecordDetailScreen() {
	const navigation = useNavigation<NavigationProp>()
	const route = useRoute<{ params: { recordId: number } }>()
	const recordId = route.params?.recordId

	const cachedRecord = recordId
		? getCachedRecordDetailSnapshot(recordId)
		: undefined
	const [record, setRecord] = useState<RecordDetailItem | undefined>(cachedRecord)
	const [isLoading, setIsLoading] = useState(!cachedRecord)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
	const [activeImageIndex, setActiveImageIndex] = useState(0)
	const [carouselWidth, setCarouselWidth] = useState(0)
	const carouselRef = useRef<FlatList<string | null>>(null)
	const imageCount = record?.images?.length ?? 0

	useEffect(() => {
		if (imageCount === 0) {
			setActiveImageIndex(0)
			return
		}

		setActiveImageIndex((current) => Math.min(current, imageCount - 1))
	}, [imageCount])

	const handleCarouselScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		if (carouselWidth === 0 || imageCount === 0) {
			return
		}

		const nextIndex = Math.round(
			event.nativeEvent.contentOffset.x / carouselWidth,
		)
		setActiveImageIndex(Math.min(Math.max(nextIndex, 0), imageCount - 1))
	}

	const handleCarouselArrowPress = (nextIndex: number) => {
		if (carouselWidth === 0 || nextIndex < 0 || nextIndex >= imageCount) {
			return
		}

		setActiveImageIndex(nextIndex)
		carouselRef.current?.scrollToOffset({
			offset: nextIndex * carouselWidth,
			animated: true,
		})
	}

	useEffect(() => {
		const controller = new AbortController()
		let mounted = true

		if (!recordId) {
			setRecord(undefined)
			setIsLoading(false)
			return () => {
				mounted = false
				controller.abort()
			}
		}

		const cached = getCachedRecordDetailSnapshot(recordId)
		const hasCachedRecord = Boolean(cached)

		if (cached) {
			setRecord(cached)
		}

		if (hasCachedRecord && isRecordDetailCacheFresh(recordId)) {
			setIsLoading(false)
			return () => {
				mounted = false
				controller.abort()
			}
		}

		setIsLoading(!hasCachedRecord)
		fetchRecordDetail(recordId, { force: hasCachedRecord }, controller.signal)
			.then((item) => {
				if (mounted) {
					setRecord(item)
				}
			})
			.catch((error) => {
				if (mounted && error.name !== 'AbortError') {
					setRecord(cached)
				}
			})
			.finally(() => {
				if (mounted && !hasCachedRecord) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
			controller.abort()
		}
	}, [recordId])

	const handleRefresh = async () => {
		if (!recordId) {
			return
		}

		setIsRefreshing(true)

		try {
			const item = await fetchRecordDetail(recordId, { force: true })
			setRecord(item)
		} catch {
			setRecord((current: RecordDetailItem | undefined) => current)
		} finally {
			setIsRefreshing(false)
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<View style={appStyles.recordDetailScreen}>
				<Header
					title="Detalhes do Registro"
					leftIcon={
						<Pressable
							onPress={() => navigation.goBack()}
							hitSlop={8}
							style={appStyles.headerActionButton}
						>
							<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
						</Pressable>
					}
				/>
				<View style={appStyles.recordDetailNotFoundWrap}>
					<ActivityIndicator
						color={colors.muted}
						size="small"
						style={appStyles.recordDetailLoadingIcon}
					/>
					<Text style={appStyles.recordDetailEmptyText}>
						Carregando registro...
					</Text>
				</View>
			</View>
		)
	}

	if (!record) {
		return (
			<View style={appStyles.recordDetailScreen}>
				<Header
					title="Detalhes do Registro"
					leftIcon={
						<Pressable
							onPress={() => navigation.goBack()}
							hitSlop={8}
							style={appStyles.headerActionButton}
						>
							<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
						</Pressable>
					}
				/>
				<View style={appStyles.recordDetailNotFoundWrap}>
					<Text style={appStyles.recordDetailEmptyText}>
						Registro nao encontrado.
					</Text>
				</View>
			</View>
		)
	}

	const behaviorTags = String(record.flock_size)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
	const imageUris = record.images ?? []
	const imageSlots = imageUris.length
	const carouselImages: (string | null)[] = imageSlots > 0 ? imageUris : [null]

	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'guará' : 'guarás'}`
	const idLabel = `#${String(record.id).padStart(3, '0')}`
	const locationLabel = formatLocationLabel(record.latitude, record.longitude)
	const areaLabel = record.map_zones.length
		? record.map_zones.map((zone) => zone.name).join(' · ')
		: 'Sem área'

	return (
		<View style={appStyles.recordDetailScreen}>
			<Header
				title="Detalhes do Registro"
				leftIcon={
					<Pressable
						onPress={() => navigation.goBack()}
						hitSlop={8}
						style={appStyles.headerActionButton}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
				}
			/>

			<View style={appStyles.screen}>
				<ScrollView
					style={appStyles.screen}
					contentContainerStyle={appStyles.recordDetailContent}
					alwaysBounceVertical
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
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
							onMomentumScrollEnd={handleCarouselScrollEnd}
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
											onPress={() => setSelectedImageIndex(index)}
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
												Nenhuma imagem disponivel.
											</Text>
										</View>
									)}
								</View>
							)}
						/>

						{imageSlots > 1 && activeImageIndex > 0 && (
							<Pressable
								onPress={() => handleCarouselArrowPress(activeImageIndex - 1)}
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
								onPress={() => handleCarouselArrowPress(activeImageIndex + 1)}
								accessibilityRole="button"
								accessibilityLabel="Proxima imagem"
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

				<View style={appStyles.recordDetailCard}>
					<View style={appStyles.recordDetailHeaderRow}>
						<Text
							style={[
								appStyles.recordDetailSectionTitle,
								appStyles.recordDetailInfoHeaderTitle,
							]}
						>
							INFORMACOES GERAIS
						</Text>
						<View style={appStyles.recordDetailIdBadge}>
							<Text style={appStyles.recordDetailIdText}>{idLabel}</Text>
						</View>
					</View>

					<View style={appStyles.recordDetailInfoList}>
						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="calendar-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>DATA E HORA</Text>
								<Text style={appStyles.recordDetailValue}>
									{formatDate(record.datetime)} às {formatTime(record.datetime)}
								</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="location-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>LOCALIZACAO</Text>
								<Text style={appStyles.recordDetailValue}>{locationLabel}</Text>
								<Text style={appStyles.recordDetailCoordinates}>
									Lat: {record.latitude.toFixed(4)} / Lng:{' '}
									{record.longitude.toFixed(4)}
								</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="map-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>ÁREAS</Text>
								<Text style={appStyles.recordDetailValue}>{areaLabel}</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="people-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>QUANTIDADE</Text>
								<Text style={appStyles.recordDetailValue}>{quantityLabel}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<View style={appStyles.recordDetailSectionTitleRow}>
						<Ionicons name="pulse-outline" size={16} color="#125ED0" />
						<Text style={appStyles.recordDetailSectionTitle}>
							COMPORTAMENTOS OBSERVADOS
						</Text>
					</View>

					<View style={appStyles.recordDetailChipRow}>
						{behaviorTags.map((behavior: string) => (
							<View key={behavior} style={appStyles.recordDetailChip}>
								<Text style={appStyles.recordDetailChipText}>
									{behavior.toUpperCase()}
								</Text>
							</View>
						))}
					</View>
				</View>

				</ScrollView>
			</View>

			{selectedImageIndex !== null && record && (
				<RecordImageDetailModal
					visible={true}
					imageIndex={selectedImageIndex}
					imageUri={record.images?.[selectedImageIndex] ?? ''}
					totalImages={imageSlots}
					onClose={() => setSelectedImageIndex(null)}
					onImageChange={setSelectedImageIndex}
					record={record}
				/>
			)}
		</View>
	)
}

export default RecordDetailScreen
