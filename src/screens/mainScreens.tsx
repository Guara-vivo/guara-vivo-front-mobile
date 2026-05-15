import React, { useMemo, useState } from 'react'
import {
	Alert,
	FlatList,
	Image,
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
	behaviorOptions,
	formatDate,
	formatLocationLabel,
	formatTime,
	mockRecords,
} from '../data/mockRecords'
import { ActionButton, ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { appStyles } from '../styles/appStyles'
import { MAP_RECORDS } from '../config/map'
import type { ScreenId } from '../types/navigation'

const homeLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function HomeScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	return (
		<ScrollView
			contentContainerStyle={appStyles.homeContent}
			style={appStyles.homeScreen}
		>
			<View style={appStyles.homeHeader}>
				<Image
					source={homeLogo}
					style={appStyles.homeLogo}
					resizeMode="contain"
				/>
				<Text style={appStyles.homeKicker}>SISTEMA DE MONITORAMENTO</Text>
				<Text style={appStyles.homeSubtitle}>
					Auxílio ao monitoramento e proteção do Guará na ARIE
				</Text>
			</View>

			<ActionButton
				title="NOVO REGISTRO"
				onPress={() => onNavigate('register')}
				containerStyle={appStyles.homePrimaryButton}
				textStyle={appStyles.homePrimaryButtonLabel}
				leftIcon={
					<Ionicons name="location-outline" size={26} color="#F1F1F1" />
				}
				rightIcon={<Ionicons name="arrow-forward" size={24} color="#F1F1F1" />}
			/>

			<View style={appStyles.homeShortcutRow}>
				<Pressable
					onPress={() => onNavigate('maps')}
					style={appStyles.homeShortcutCard}
				>
					<View style={appStyles.homeShortcutIconBox}>
						<Ionicons name="map-outline" size={30} color="#125ED0" />
					</View>
					<Text style={appStyles.homeShortcutLabel}>VER MAPAS</Text>
				</Pressable>

				<Pressable
					onPress={() => onNavigate('history')}
					style={appStyles.homeShortcutCard}
				>
					<View style={appStyles.homeShortcutIconBox}>
						<Ionicons name="list-outline" size={30} color="#125ED0" />
					</View>
					<Text style={appStyles.homeShortcutLabel}>HISTÓRICO</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}

export function RegisterScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [, setPhotos] = useState(0)
	const [behaviors, setBehaviors] = useState<string[]>([])
	const behaviorOrder = [
		'Em cio',
		'Ninhando',
		'Alimentando',
		'Voando',
		'Pousado',
	]
	const selectedDate = '13/05/2026'
	const selectedTime = '19:50'

	const toggleBehavior = (behavior: string) => {
		setBehaviors((current) =>
			current.includes(behavior)
				? current.filter((item) => item !== behavior)
				: [...current, behavior],
		)
	}

	const handleSave = () => {
		Alert.alert('Sucesso', 'Registro salvo no prototipo nativo.')
		onNavigate('home')
	}

	const handleCancel = () => {
		setPhotos(0)
		setBehaviors([])
		onNavigate('home')
	}

	return (
		<View style={appStyles.registerScreen}>
			<ScrollView
				contentContainerStyle={appStyles.registerContent}
				style={appStyles.registerScroll}
			>
				<View style={appStyles.registerCard}>
					<View style={appStyles.registerSectionTitleRow}>
						<Ionicons name="camera-outline" size={22} color="#125ED0" />
						<Text style={appStyles.registerSectionTitleTextBlue}>
							INFORMAÇÕES DO AVISTAMENTO
						</Text>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="camera-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								IMAGENS DO AVISTAMENTO
							</Text>
						</View>

						<Pressable
							onPress={() => setPhotos((value) => value + 1)}
							style={appStyles.registerDropZone}
						>
							<View style={appStyles.registerDropZoneIconWrap}>
								<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
							</View>
							<Text style={appStyles.registerDropZoneTitle}>
								Clique para adicionar fotos
							</Text>
							<Text style={appStyles.registerDropZoneText}>
								ou arraste e solte aqui
							</Text>
						</Pressable>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="pulse-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								COMPORTAMENTO OBSERVADO
							</Text>
						</View>

						<View style={appStyles.registerBehaviorList}>
							{behaviorOrder.map((behavior) => {
								const active = behaviors.includes(behavior)
								return (
									<Pressable
										key={behavior}
										onPress={() => toggleBehavior(behavior)}
										style={appStyles.registerBehaviorItem}
									>
										<View
											style={[
												appStyles.registerCheckbox,
												active && appStyles.registerCheckboxActive,
											]}
										>
											{active ? (
												<Ionicons name="checkmark" size={12} color="#FFFFFF" />
											) : null}
										</View>
										<Text style={appStyles.registerBehaviorLabel}>
											{behavior}
										</Text>
									</Pressable>
								)
							})}
						</View>
					</View>

					<View style={appStyles.registerSubsection}>
						<View style={appStyles.registerSubTitleRow}>
							<Ionicons name="calendar-outline" size={18} color="#F2201F" />
							<Text style={appStyles.registerSubTitleText}>
								DATA E HORA DO AVISTAMENTO
							</Text>
						</View>

						<View style={appStyles.registerDateRow}>
							<View style={appStyles.registerDateField}>
								<Text style={appStyles.registerDateFieldText}>
									{selectedDate}
								</Text>
								<Ionicons name="calendar-outline" size={16} color="#1A1A1A" />
							</View>

							<View style={appStyles.registerDateField}>
								<Text style={appStyles.registerDateFieldText}>
									{selectedTime}
								</Text>
								<Ionicons name="time-outline" size={16} color="#1A1A1A" />
							</View>
						</View>
					</View>

					<View style={appStyles.registerActionsRow}>
						<ActionButton
							title="SALVAR REGISTRO"
							onPress={handleSave}
							fullWidth={false}
							containerStyle={appStyles.registerSaveButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
						<ActionButton
							title="CANCELAR"
							onPress={handleCancel}
							variant="secondary"
							fullWidth={false}
							containerStyle={appStyles.registerCancelButton}
							textStyle={appStyles.registerActionButtonLabel}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export function MapsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [selectedLayer, setSelectedLayer] = useState<
		'all' | 'feeding' | 'nests'
	>('all')

	const layerButtons = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' as const },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'dot' as const },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' as const },
	]

	return (
		<View style={appStyles.mapsScreen}>
			<ScrollView
				contentContainerStyle={appStyles.mapsContent}
				style={appStyles.screen}
			>
				<ScreenCard style={appStyles.mapsFilterCard}>
					<View style={appStyles.mapsFilterTitleRow}>
						<Ionicons name="layers-outline" size={18} color="#125ED0" />
						<Text style={appStyles.sectionTitle}>CAMADA</Text>
					</View>

					<View style={appStyles.mapsFilterRow}>
						{layerButtons.map((item) => {
							const active = selectedLayer === item.id

							return (
								<Pressable
									key={item.id}
									onPress={() => setSelectedLayer(item.id)}
									style={[
										appStyles.mapsFilterButton,
										active && appStyles.mapsFilterButtonActive,
									]}
								>
									{item.id === 'feeding' ? (
										<View
											style={[
												appStyles.mapsFilterButtonIcon,
												{
													width: 9,
													height: 9,
													borderRadius: 9,
													backgroundColor: active ? '#FFFFFF' : '#E53935',
												},
											]}
										/>
									) : (
										<Ionicons
											name={item.icon}
											size={15}
											color={active ? '#FFFFFF' : '#2F6FE4'}
											style={appStyles.mapsFilterButtonIcon}
										/>
									)}
									<Text
										style={[
											appStyles.mapsFilterButtonLabel,
											active && appStyles.mapsFilterButtonLabelActive,
										]}
									>
										{item.label}
									</Text>
								</Pressable>
							)
						})}
					</View>
				</ScreenCard>

				<ScreenCard style={appStyles.mapsMapCard}>
					<MapLibreMapView
						selectedLayer={selectedLayer}
						records={MAP_RECORDS}
					/>
				</ScreenCard>
			</ScrollView>
		</View>
	)
}

export function HistoryScreen({
	onNavigate,
	onOpenRecord,
}: {
	onNavigate: (screen: ScreenId) => void
	onOpenRecord: (recordId: number) => void
}) {
	type HistoryFilters = {
		fromDate: string
		toDate: string
		location: string
		minQuantity: string
		maxQuantity: string
		behaviors: string[]
	}

	const defaultFilters: HistoryFilters = {
		fromDate: '',
		toDate: '',
		location: '',
		minQuantity: '',
		maxQuantity: '',
		behaviors: [],
	}

	const [searchTerm, setSearchTerm] = useState('')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [appliedFilters, setAppliedFilters] =
		useState<HistoryFilters>(defaultFilters)
	const [draftFilters, setDraftFilters] =
		useState<HistoryFilters>(defaultFilters)

	const parseInputDate = (value: string) => {
		const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

		if (!match) {
			return null
		}

		const day = Number(match[1])
		const month = Number(match[2])
		const year = Number(match[3])
		const parsed = new Date(year, month - 1, day, 0, 0, 0, 0)

		if (Number.isNaN(parsed.getTime())) {
			return null
		}

		return parsed
	}

	const parseBehaviorTags = (value: string) =>
		value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean)

	const toggleBehaviorFilter = (behavior: string) => {
		setDraftFilters((current) => ({
			...current,
			behaviors: current.behaviors.includes(behavior)
				? current.behaviors.filter((item) => item !== behavior)
				: [...current.behaviors, behavior],
		}))
	}

	const openFilters = () => {
		setDraftFilters(appliedFilters)
		setIsFilterOpen(true)
	}

	const applyFilters = () => {
		setAppliedFilters(draftFilters)
		setIsFilterOpen(false)
	}

	const clearFilters = () => {
		setDraftFilters(defaultFilters)
		setAppliedFilters(defaultFilters)
		setIsFilterOpen(false)
	}

	const filteredRecords = useMemo(() => {
		const query = searchTerm.trim().toLowerCase()
		const fromDate = parseInputDate(appliedFilters.fromDate)
		const toDate = parseInputDate(appliedFilters.toDate)
		const locationQuery = appliedFilters.location.trim().toLowerCase()
		const minQuantity = Number(appliedFilters.minQuantity)
		const maxQuantity = Number(appliedFilters.maxQuantity)
		const hasMinQuantity =
			appliedFilters.minQuantity.trim() !== '' && !Number.isNaN(minQuantity)
		const hasMaxQuantity =
			appliedFilters.maxQuantity.trim() !== '' && !Number.isNaN(maxQuantity)
		const selectedBehaviors = appliedFilters.behaviors.map((behavior) =>
			behavior.toLowerCase(),
		)

		return mockRecords.filter((record) => {
			const recordDate = new Date(record.datetime)
			const recordDateOnly = new Date(
				recordDate.getFullYear(),
				recordDate.getMonth(),
				recordDate.getDate(),
			)
			const locationLabel = formatLocationLabel(
				record.latitude,
				record.longitude,
			).toLowerCase()
			const behaviorTags = parseBehaviorTags(record.flock_size).map((tag) =>
				tag.toLowerCase(),
			)

			if (query) {
				const searchableContent = [
					`#${String(record.id).padStart(3, '0')}`,
					formatDate(record.datetime),
					formatTime(record.datetime),
					locationLabel,
					record.flock_size,
					String(record.ibis_quantity),
				]
					.join(' ')
					.toLowerCase()

				if (!searchableContent.includes(query)) {
					return false
				}
			}

			if (fromDate && recordDateOnly < fromDate) {
				return false
			}

			if (toDate) {
				const endOfDay = new Date(toDate)
				endOfDay.setHours(23, 59, 59, 999)

				if (recordDate > endOfDay) {
					return false
				}
			}

			if (locationQuery && !locationLabel.includes(locationQuery)) {
				return false
			}

			if (hasMinQuantity && record.ibis_quantity < minQuantity) {
				return false
			}

			if (hasMaxQuantity && record.ibis_quantity > maxQuantity) {
				return false
			}

			if (
				selectedBehaviors.length > 0 &&
				!behaviorTags.some((tag) => selectedBehaviors.includes(tag))
			) {
				return false
			}

			return true
		})
	}, [appliedFilters, searchTerm])

	return (
		<View style={appStyles.historyScreen}>
			<ScrollView
				contentContainerStyle={appStyles.historyContent}
				style={appStyles.screen}
			>
				<ScreenCard style={appStyles.historySearchCard}>
					<View style={appStyles.historySearchInputWrap}>
						<Ionicons name="search-outline" size={19} color="#5C8BD6" />
						<TextInput
							value={searchTerm}
							onChangeText={setSearchTerm}
							placeholder="Buscar por local, data..."
							placeholderTextColor="#8E8E96"
							style={appStyles.historySearchInput}
						/>
					</View>

					<Pressable
						onPress={openFilters}
						style={appStyles.historyFilterButton}
					>
						<Ionicons name="funnel-outline" size={17} color="#FFFFFF" />
						<Text style={appStyles.historyFilterButtonText}>FILTROS</Text>
					</Pressable>
				</ScreenCard>

				<FlatList
					data={filteredRecords}
					keyExtractor={(item) => String(item.id)}
					scrollEnabled={false}
					ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
					ListEmptyComponent={
						<View style={appStyles.historyEmptyWrap}>
							<Text style={appStyles.historyEmptyText}>
								Nenhum registro encontrado com os filtros atuais.
							</Text>
						</View>
					}
					renderItem={({ item }) => {
						const behaviorTags = parseBehaviorTags(item.flock_size)

						return (
							<View style={appStyles.historyRecordCard}>
								<View style={appStyles.historyRecordTopRow}>
									<View style={appStyles.historyRecordIdBadge}>
										<Text style={appStyles.historyRecordIdText}>
											#{String(item.id).padStart(3, '0')}
										</Text>
									</View>

									<View style={appStyles.historyRecordDateRow}>
										<Ionicons
											name="calendar-outline"
											size={14}
											color="#5C8BD6"
										/>
										<Text style={appStyles.historyRecordDateText}>
											{formatDate(item.datetime)}
										</Text>
										<Text style={appStyles.historyRecordDateDot}>•</Text>
										<Text style={appStyles.historyRecordDateText}>
											{formatTime(item.datetime)}
										</Text>
									</View>
								</View>

								<View style={appStyles.historyRecordInfoRow}>
									<Ionicons name="location-outline" size={14} color="#F2201F" />
									<Text style={appStyles.historyRecordInfoText}>
										{formatLocationLabel(item.latitude, item.longitude)}
									</Text>
								</View>

								<View style={appStyles.historyRecordInfoRow}>
									<Ionicons name="eye-outline" size={14} color="#F2201F" />
									<Text style={appStyles.historyRecordInfoText}>
										Tamanho do grupo: {item.ibis_quantity}
									</Text>
								</View>

								<View style={appStyles.historyTagRow}>
									{behaviorTags.map((tag) => (
										<View
											key={`${item.id}-${tag}`}
											style={appStyles.historyTagChip}
										>
											<Text style={appStyles.historyTagChipText}>{tag}</Text>
										</View>
									))}
								</View>

								<Pressable
									onPress={() => onOpenRecord(item.id)}
									style={appStyles.historyDetailButton}
								>
									<Text style={appStyles.historyDetailButtonText}>
										VER DETALHES
									</Text>
								</Pressable>
							</View>
						)
					}}
				/>
			</ScrollView>

			<Modal
				visible={isFilterOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsFilterOpen(false)}
			>
				<View style={appStyles.historyModalBackdrop}>
					<View style={appStyles.historyModalCard}>
						<View style={appStyles.historyModalHeader}>
							<Text style={appStyles.historyModalTitle}>FILTROS</Text>
							<Pressable onPress={() => setIsFilterOpen(false)}>
								<Ionicons name="close" size={22} color="#1A1A1A" />
							</Pressable>
						</View>

						<ScrollView contentContainerStyle={appStyles.historyModalContent}>
							<View style={appStyles.historyFilterSection}>
								<View style={appStyles.historyFilterSectionTitleRow}>
									<Ionicons name="calendar-outline" size={15} color="#F2201F" />
									<Text style={appStyles.historyFilterSectionTitle}>
										PERÍODO
									</Text>
								</View>

								<View style={appStyles.historyDateLabelsRow}>
									<Text style={appStyles.historySmallLabel}>De</Text>
									<Text style={appStyles.historySmallLabel}>Até</Text>
								</View>

								<View style={appStyles.historyDateRow}>
									<View style={appStyles.historyDateInputWrap}>
										<TextInput
											value={draftFilters.fromDate}
											onChangeText={(value) =>
												setDraftFilters((current) => ({
													...current,
													fromDate: value,
												}))
											}
											placeholder="dd/mm/aaaa"
											placeholderTextColor="#6B6B74"
											style={appStyles.historyDateInput}
										/>
										<Ionicons
											name="calendar-outline"
											size={14}
											color="#1A1A1A"
										/>
									</View>

									<View style={appStyles.historyDateInputWrap}>
										<TextInput
											value={draftFilters.toDate}
											onChangeText={(value) =>
												setDraftFilters((current) => ({
													...current,
													toDate: value,
												}))
											}
											placeholder="dd/mm/aaaa"
											placeholderTextColor="#6B6B74"
											style={appStyles.historyDateInput}
										/>
										<Ionicons
											name="calendar-outline"
											size={14}
											color="#1A1A1A"
										/>
									</View>
								</View>
							</View>

							<View style={appStyles.historyFilterSection}>
								<View style={appStyles.historyFilterSectionTitleRow}>
									<Ionicons name="location-outline" size={15} color="#F2201F" />
									<Text style={appStyles.historyFilterSectionTitle}>
										LOCALIZAÇÃO
									</Text>
								</View>

								<TextInput
									value={draftFilters.location}
									onChangeText={(value) =>
										setDraftFilters((current) => ({
											...current,
											location: value,
										}))
									}
									placeholder="Ex: -24.4959, -47.8431"
									placeholderTextColor="#8E8E96"
									style={appStyles.historySingleInput}
								/>
							</View>

							<View style={appStyles.historyFilterSection}>
								<View style={appStyles.historyFilterSectionTitleRow}>
									<Ionicons name="people-outline" size={15} color="#F2201F" />
									<Text style={appStyles.historyFilterSectionTitle}>
										QUANTIDADE DE INDIVÍDUOS
									</Text>
								</View>

								<View style={appStyles.historyDateLabelsRow}>
									<Text style={appStyles.historySmallLabel}>Mínimo</Text>
									<Text style={appStyles.historySmallLabel}>Máximo</Text>
								</View>

								<View style={appStyles.historyDateRow}>
									<TextInput
										value={draftFilters.minQuantity}
										onChangeText={(value) =>
											setDraftFilters((current) => ({
												...current,
												minQuantity: value,
											}))
										}
										placeholder="Min"
										placeholderTextColor="#6B6B74"
										keyboardType="numeric"
										style={appStyles.historyHalfInput}
									/>

									<TextInput
										value={draftFilters.maxQuantity}
										onChangeText={(value) =>
											setDraftFilters((current) => ({
												...current,
												maxQuantity: value,
											}))
										}
										placeholder="Max"
										placeholderTextColor="#6B6B74"
										keyboardType="numeric"
										style={appStyles.historyHalfInput}
									/>
								</View>
							</View>

							<View style={appStyles.historyFilterSection}>
								<Text style={appStyles.historyFilterSectionTitle}>
									COMPORTAMENTOS
								</Text>

								<View style={appStyles.historyBehaviorList}>
									{behaviorOptions.map((behavior) => {
										const active = draftFilters.behaviors.includes(behavior)

										return (
											<Pressable
												key={behavior}
												onPress={() => toggleBehaviorFilter(behavior)}
												style={appStyles.historyBehaviorItem}
											>
												<View
													style={[
														appStyles.historyBehaviorCheckbox,
														active && appStyles.historyBehaviorCheckboxActive,
													]}
												>
													{active ? (
														<Ionicons
															name="checkmark"
															size={12}
															color="#FFFFFF"
														/>
													) : null}
												</View>
												<Text style={appStyles.historyBehaviorLabel}>
													{behavior}
												</Text>
											</Pressable>
										)
									})}
								</View>
							</View>
						</ScrollView>

						<View style={appStyles.historyModalActions}>
							<Pressable
								onPress={clearFilters}
								style={appStyles.historyClearButton}
							>
								<Text style={appStyles.historyClearButtonText}>LIMPAR</Text>
							</Pressable>

							<Pressable
								onPress={applyFilters}
								style={appStyles.historyApplyButton}
							>
								<Text style={appStyles.historyApplyButtonText}>
									APLICAR FILTROS
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

export function RecordDetailScreen({
	onNavigate,
	recordId,
}: {
	onNavigate: (screen: ScreenId) => void
	recordId?: number
}) {
	const record = mockRecords.find((item) => item.id === recordId)
	const detailById: Record<
		number,
		{
			location: string
			distanceMeters: number
			behaviors: string[]
			observations: string
			imageSlots: number
		}
	> = {
		1: {
			location: 'Area A - Setor Norte',
			distanceMeters: 45,
			behaviors: ['Alimentando', 'Voando'],
			observations:
				'Grupo de tres individuos avistados proximo a area de vegetacao densa.',
			imageSlots: 2,
		},
		2: {
			location: 'Area C - Trilha Leste',
			distanceMeters: 30,
			behaviors: ['Ninhando', 'Pousado'],
			observations: 'Casal em comportamento de ninho na copa baixa.',
			imageSlots: 2,
		},
		3: {
			location: 'Area B - Mirante Sul',
			distanceMeters: 60,
			behaviors: ['Voando'],
			observations: 'Passagem rapida em voo sobre area aberta.',
			imageSlots: 2,
		},
		4: {
			location: 'Area D - Canal Oeste',
			distanceMeters: 22,
			behaviors: ['Pousado', 'Alimentando'],
			observations: 'Grupo alimentando em margem de canal com lama exposta.',
			imageSlots: 2,
		},
	}

	if (!record) {
		return (
			<View style={appStyles.recordDetailScreen}>
				<ScrollView
					style={appStyles.screen}
					contentContainerStyle={appStyles.recordDetailContent}
				>
					<Pressable
						onPress={() => onNavigate('history')}
						style={appStyles.pageBackButton}
					>
						<Ionicons name="chevron-back" size={28} color="#125ED0" />
					</Pressable>

					<View style={appStyles.recordDetailCard}>
						<Text style={appStyles.recordDetailValue}>
							Registro nao encontrado.
						</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

	const details = detailById[record.id] ?? {
		location: `Area ${record.id} - Setor Principal`,
		distanceMeters: 40,
		behaviors: [record.flock_size],
		observations: 'Registro visual sem observacoes adicionais.',
		imageSlots: 2,
	}

	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'individuo' : 'individuos'}`
	const idLabel = `#${String(record.id).padStart(3, '0')}`

	return (
		<View style={appStyles.recordDetailScreen}>
			<ScrollView
				style={appStyles.screen}
				contentContainerStyle={appStyles.recordDetailContent}
			>
				<Pressable
					onPress={() => onNavigate('history')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.recordDetailIdBadge}>
					<Text style={appStyles.recordDetailIdText}>{idLabel}</Text>
				</View>

				<View style={appStyles.recordDetailCard}>
					<Text style={appStyles.recordDetailSectionTitle}>
						INFORMACOES GERAIS
					</Text>

					<View style={appStyles.recordDetailInfoList}>
						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="calendar-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>DATA E HORA</Text>
								<Text style={appStyles.recordDetailValue}>
									{formatDate(record.datetime)} as {formatTime(record.datetime)}
								</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="location-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>LOCALIZACAO</Text>
								<Text style={appStyles.recordDetailValue}>
									{details.location}
								</Text>
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
									DISTANCIA ESTIMADA
								</Text>
								<Text style={appStyles.recordDetailValue}>
									{details.distanceMeters} metros
								</Text>
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
						{details.behaviors.map((behavior) => (
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
							IMAGENS ({details.imageSlots})
						</Text>
					</View>

					<View style={appStyles.recordDetailImageGrid}>
						{Array.from({ length: details.imageSlots }).map((_, index) => (
							<View
								key={`img-${index}`}
								style={appStyles.recordDetailImagePlaceholder}
							>
								<Ionicons name="camera-outline" size={26} color="#8FB0F4" />
							</View>
						))}
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<Text style={appStyles.recordDetailSectionTitle}>OBSERVACOES</Text>
					<Text style={appStyles.recordDetailObservationText}>
						{details.observations}
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}
