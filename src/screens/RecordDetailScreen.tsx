import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import {
	formatDate,
	formatLocationLabel,
	formatTime,
} from '../utils/recordFormatters'
import type { ScreenId } from '../types/navigation'
import { Header } from '../components/Header'
import {
	fetchRecordDetail,
	type RecordDetailItem,
} from '../services/recordsService'

export function RecordDetailScreen({
	onNavigate,
	recordId = 0,
}: {
	onNavigate: (screen: ScreenId) => void
	recordId?: number
}) {
	const [record, setRecord] = useState<RecordDetailItem | undefined>()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let mounted = true

		if (!recordId) {
			setRecord(undefined)
			setIsLoading(false)
			return () => {
				mounted = false
			}
		}

		setIsLoading(true)
		fetchRecordDetail(recordId)
			.then((item) => {
				if (mounted) {
					setRecord(item)
				}
			})
			.catch(() => {
				if (mounted) {
					setRecord(undefined)
				}
			})
			.finally(() => {
				if (mounted) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
		}
	}, [recordId])

	if (isLoading) {
		return (
			<View style={appStyles.recordDetailScreen}>
				<Header
					title="Detalhes do Registro"
					leftIcon={
						<Pressable
							onPress={() => onNavigate('history')}
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
							onPress={() => onNavigate('history')}
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

	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'individuo' : 'individuos'}`
	const idLabel = `#${String(record.id).padStart(3, '0')}`
	const locationLabel = formatLocationLabel(record.latitude, record.longitude)

	return (
		<View style={appStyles.recordDetailScreen}>
			<Header
				title="Detalhes do Registro"
				leftIcon={
					<Pressable
						onPress={() => onNavigate('history')}
						hitSlop={8}
						style={appStyles.headerActionButton}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
				}
			/>

			<ScrollView
				style={appStyles.screen}
				contentContainerStyle={appStyles.recordDetailContent}
			>
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
							<Ionicons name="people-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>QUANTIDADE</Text>
								<Text style={appStyles.recordDetailValue}>{quantityLabel}</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="eye-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>
									STATUS
								</Text>
								<Text style={appStyles.recordDetailValue}>{record.status}</Text>
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

				<View style={appStyles.recordDetailCard}>
					<View style={appStyles.recordDetailSectionTitleRow}>
						<Ionicons name="camera-outline" size={16} color="#125ED0" />
						<Text style={appStyles.recordDetailSectionTitle}>
							IMAGENS ({imageSlots})
						</Text>
					</View>

					<View style={appStyles.recordDetailImageGrid}>
						{Array.from({ length: imageSlots }).map((_, index) => {
							const imageUri = imageUris[index]

							return imageUri ? (
								<Image
									key={imageUri}
									source={{ uri: imageUri }}
									style={appStyles.recordDetailImagePlaceholder}
									resizeMode="cover"
								/>
							) : (
								<View
									key={`img-${index}`}
									style={appStyles.recordDetailImagePlaceholder}
								>
									<Ionicons name="camera-outline" size={26} color="#8FB0F4" />
								</View>
							)
						})}
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<Text style={appStyles.recordDetailSectionTitle}>OBSERVACOES</Text>
					<Text style={appStyles.recordDetailObservationText}>
						{record.status
							? `Status do processamento: ${record.status}.`
							: 'Sem observacoes da API.'}
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default RecordDetailScreen
