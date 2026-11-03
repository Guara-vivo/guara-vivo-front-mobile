import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	Pressable,
	Text,
	View,
} from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { LastUpdatedPill } from '../components/map/LastUpdatedPill'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'

import { appStyles } from '../styles/appStyles'
import type { MapZoneRead, MapZoneType } from '../types/api'
import type { MapLayerId } from '../config/map'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { invalidateRecordsCache } from '../services/recordsService'
import { getVisibleMapZoneRecords } from '../utils/mapZoneRecords'
import { filterZonesByLayer, getLayerBadgeText } from '../utils/mapZoneStyle'
import { getLoadErrorMessage } from '../utils/loadErrorMessage'
import { colors } from '../constants/theme'

const ZONES_LOAD_ERROR = 'Não foi possível carregar as áreas. Toque em atualizar para tentar de novo.'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type LayerButton = { id: MapLayerId; label: string; icon: IoniconName }

const LAYER_BUTTONS: LayerButton[] = [
	{ id: 'all', label: 'TODOS', icon: 'layers-outline' },
	{ id: 'feeding', label: 'ALIMENTAÇÃO', icon: 'fish' },
	{ id: 'nests', label: 'NINHOS', icon: 'home' },
]

export function MapsScreen() {
	const ctx = useMapZoneDetail()
	const selectionModalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [selectedLayer, setSelectedLayer] = useState<MapLayerId>('all')
	const [zones, setZones] = useState<MapZoneRead[]>([])
	const [zonesError, setZonesError] = useState<string | null>(null)
	const [isZonesLoading, setIsZonesLoading] = useState(true)
	const [showZoneModal, setShowZoneModal] = useState(false)
	const [creatingZone, setCreatingZone] = useState(false)
	const [isReloading, setIsReloading] = useState(false)
	const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)

	const visibleZoneRecords = useMemo(
		() => getVisibleMapZoneRecords(ctx.zoneRecords),
		[ctx.zoneRecords],
	)

	const visibleZoneCount = useMemo(
		() => filterZonesByLayer(zones, selectedLayer).length,
		[zones, selectedLayer],
	)
	const layerCountLabel = getLayerBadgeText(selectedLayer)

	const loadZones = useCallback(async (signal?: AbortSignal) => {
		try {
			setIsZonesLoading(true)
			setZonesError(null)
			const data = await getMapZones(signal)
			setZones(data)
			setLastUpdatedAt(new Date())
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				return
			}

			setZonesError(getLoadErrorMessage(error, ZONES_LOAD_ERROR))
		} finally {
			setIsZonesLoading(false)
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()

		void loadZones(controller.signal)

		return () => {
			controller.abort()
		}
	}, [loadZones])

	useEffect(() => {
		return () => {
			if (selectionModalTimerRef.current) {
				clearTimeout(selectionModalTimerRef.current)
			}

		}
	}, [])

	const handleReloadZones = useCallback(async () => {
		if (isReloading) {
			return
		}

		setIsReloading(true)

		try {
			await loadZones()
		} finally {
			setIsReloading(false)
		}
	}, [isReloading, loadZones])

	const handleToggleSelectionMode = useCallback(() => {
		if (selectionMode) {
			setSelectionMode(false)
			setSelectedCoords(null)
			return
		}

		setSelectionMode(true)
	}, [selectionMode])

	const handleMapPress = useCallback((lat: number, lng: number) => {
		setSelectedCoords({ lat, lng })

		if (selectionModalTimerRef.current) {
			clearTimeout(selectionModalTimerRef.current)
		}

		selectionModalTimerRef.current = setTimeout(() => {
			setShowZoneModal(true)
			selectionModalTimerRef.current = null
		}, 50)
	}, [])

	const { openSheet, closeSheet, registerOnZoneDeleted, onRecordMarkerPress } = ctx

	useFocusEffect(
		useCallback(() => {
			return () => {
				closeSheet()
			}
		}, [closeSheet]),
	)

	useEffect(() => {
		registerOnZoneDeleted((zoneId: number) => {
			setZones((prev) => prev.filter((z) => z.id !== zoneId))
		})
	}, [registerOnZoneDeleted])

	const handleCreateZone = async (type: MapZoneType, radius_meters: number) => {
		if (!selectedCoords) return

		try {
			setCreatingZone(true)
			const newZone = await createMapZone(type, selectedCoords.lat, selectedCoords.lng, radius_meters)
			invalidateRecordsCache()
			setZones((prev) => [newZone, ...prev])
			setSelectionMode(false)
			setSelectedCoords(null)
			setShowZoneModal(false)
		} catch (error) {
			if (__DEV__) {
				console.error('[MapsScreen] Failed to create zone:', error)
			}
			setZonesError(getLoadErrorMessage(error, 'Não foi possível criar a área. Tente de novo.'))
		} finally {
			setCreatingZone(false)
		}
	}

	// Mantém o modo de seleção e as coordenadas para o usuário poder escolher outro ponto.
	const handleCancelModal = useCallback(() => setShowZoneModal(false), [])

	return (
		<View style={appStyles.mapsScreen}>
			<Header title="Mapas" />
			<View style={[appStyles.screen, appStyles.mapsContent]}>
				<ScreenCard style={appStyles.mapsFilterCard}>
					<View style={appStyles.mapsFilterTitleRow}>
						<Ionicons name="layers-outline" size={18} color={colors.secondary} />
						<Text style={appStyles.sectionTitle}>CAMADA</Text>
						<Text
							style={appStyles.mapsFilterCount}
							accessibilityLiveRegion="polite"
							accessibilityLabel={`${visibleZoneCount} ${layerCountLabel} no mapa`}
						>
							<Text style={appStyles.mapsFilterCountValue}>{visibleZoneCount}</Text>{' '}
							{layerCountLabel}
						</Text>
					</View>

					<View style={appStyles.mapsFilterRow}>
						{LAYER_BUTTONS.map((item) => {
							const active = selectedLayer === item.id

							return (
								<Pressable
									key={item.id}
									onPress={() => setSelectedLayer(item.id)}
										accessibilityRole="radio"
										accessibilityState={{ selected: active }}
										accessibilityLabel={`Camada ${item.label}`}
										hitSlop={{ top: 8, bottom: 8 }}
									style={[
										appStyles.mapsFilterButton,
										active && appStyles.mapsFilterButtonActive,
									]}
								>
									{item.id === 'feeding' ? (
										<View
											style={[
												appStyles.mapsFilterButtonIcon,
												appStyles.mapsFilterDot,
												{ backgroundColor: active ? colors.surface : colors.danger },
											]}
										/>
									) : (
										<Ionicons
											name={item.icon}
											size={15}
											color={active ? colors.onColor : colors.secondary}
											style={appStyles.mapsFilterButtonIcon}
										/>
									)}
									<Text
										numberOfLines={1}
										adjustsFontSizeToFit
										minimumFontScale={0.85}
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

				{zonesError && (
					<View
							style={appStyles.zoneErrorBanner}
							accessibilityRole="alert"
							accessibilityLiveRegion="polite"
						>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				)}

			<ScreenCard style={appStyles.mapsMapCard}>
				<MapLibreMapView
					selectedLayer={selectedLayer}
					zones={zones}
					recordMarkers={visibleZoneRecords}
					onMapPress={selectionMode ? handleMapPress : undefined}
					onZonePress={!selectionMode ? openSheet : undefined}
					onRecordMarkerPress={!selectionMode ? onRecordMarkerPress : undefined}
					selectedZoneId={ctx.selectedZone?.id ?? null}
					selectedRecordId={ctx.selectedRecordId}
					isLoadingData={isZonesLoading}
				/>
				{selectionMode ? (
					<View style={appStyles.mapSelectionInstructionOverlay}>
						<Text style={appStyles.mapSelectionInstructionText}>
							Toque no mapa para escolher a área
						</Text>
					</View>
				) : null}
				<View style={appStyles.mapReloadOverlay}>
					<View style={appStyles.mapTopRightActions}>
						<Pressable
							onPress={handleToggleSelectionMode}
								accessibilityRole="button"
								accessibilityLabel={selectionMode ? 'Cancelar seleção de área' : 'Adicionar área'}
								hitSlop={4}
								accessibilityState={{ disabled: creatingZone }}
							disabled={creatingZone}
							style={[
								appStyles.mapAreaButton,
								selectionMode && appStyles.mapAreaButtonCancel,
								creatingZone && appStyles.mapReloadButtonDisabled,
							]}
						>
							<Ionicons
								name={selectionMode ? 'close' : 'add'}
								size={18}
								color={colors.onColor}
							/>
						</Pressable>
						<Pressable
							onPress={handleReloadZones}
								accessibilityRole="button"
								accessibilityLabel="Atualizar áreas"
								hitSlop={4}
								accessibilityState={{ busy: isReloading, disabled: isReloading }}
							disabled={isReloading}
							style={[
								appStyles.mapReloadButton,
								isReloading && appStyles.mapReloadButtonDisabled,
							]}
						>
							{isReloading ? (
								<ActivityIndicator size="small" color={colors.onColor} />
							) : (
								<Ionicons name="refresh" size={18} color={colors.onColor} />
							)}
						</Pressable>
					</View>
					<LastUpdatedPill lastUpdatedAt={lastUpdatedAt} />
				</View>
			</ScreenCard>
			</View>

		{showZoneModal && (
			<MapZoneSelectionModal
				onConfirm={handleCreateZone}
				onCancel={handleCancelModal}
				isSubmitting={creatingZone}
			/>
		)}
		</View>
	)
}

export default MapsScreen
