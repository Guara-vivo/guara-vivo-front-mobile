import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	Pressable,
	Text,
	View,
} from 'react-native'
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
import { filterZonesByLayer } from '../utils/mapZoneStyle'
import { getLoadErrorMessage } from '../utils/loadErrorMessage'
import { colors } from '../constants/theme'

const ZONES_LOAD_ERROR = 'Não foi possível carregar as áreas. Toque em atualizar para tentar de novo.'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type LayerButton = { id: MapLayerId; label: string; icon: IoniconName }

const LAYER_BUTTONS: LayerButton[] = [
	{ id: 'all', label: 'Todos', icon: 'layers-outline' },
	{ id: 'feeding', label: 'Alimentação', icon: 'fish' },
	{ id: 'nests', label: 'Ninhos', icon: 'home' },
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
	const [recenterKey, setRecenterKey] = useState(0)
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
			<View style={appStyles.mapsMapArea}>
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
					recenterKey={recenterKey}
				/>

				<View style={appStyles.mapsChipsRow} accessibilityRole="radiogroup">
					{LAYER_BUTTONS.map((item) => {
						const active = selectedLayer === item.id

						return (
							<Pressable
								key={item.id}
								onPress={() => setSelectedLayer(item.id)}
								accessibilityRole="radio"
								accessibilityState={{ selected: active }}
								accessibilityLabel={`Camada ${item.label}`}
								hitSlop={{ top: 4, bottom: 4 }}
								style={[appStyles.mapsChip, active && appStyles.mapsChipActive]}
							>
								{item.id === 'all' ? (
									<Ionicons
										name="layers-outline"
										size={16}
										color={active ? colors.onColor : colors.text}
									/>
								) : (
									<View
										style={[
											appStyles.mapsChipDot,
											item.id === 'nests' && appStyles.mapsChipDotNest,
										]}
									/>
								)}
								<Text
									style={[appStyles.mapsChipLabel, active && appStyles.mapsChipLabelActive]}
								>
									{item.label}
								</Text>
							</Pressable>
						)
					})}
				</View>

				<LastUpdatedPill
					lastUpdatedAt={lastUpdatedAt}
					countLabel={`${visibleZoneCount} ${visibleZoneCount === 1 ? 'área' : 'áreas'}`}
				/>

				{zonesError ? (
					<View
						style={[appStyles.zoneErrorBanner, appStyles.mapsErrorBanner]}
						accessibilityRole="alert"
						accessibilityLiveRegion="polite"
					>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				) : null}

				{selectionMode ? (
					<View style={appStyles.mapSelectionInstructionOverlay} pointerEvents="none">
						<View style={appStyles.mapSelectionInstructionPill}>
							<Text style={appStyles.mapSelectionInstructionText}>
								Toque no mapa para escolher a área
							</Text>
						</View>
					</View>
				) : null}

				<View style={appStyles.mapsSideButtons}>
					{ctx.canManageZones ? (
						<Pressable
							onPress={handleToggleSelectionMode}
							accessibilityRole="button"
							accessibilityLabel={selectionMode ? 'Cancelar seleção de área' : 'Adicionar área'}
							accessibilityState={{ disabled: creatingZone }}
							disabled={creatingZone}
							style={[
								appStyles.mapsSideButton,
								appStyles.mapsSideButtonAccent,
								creatingZone && appStyles.mapsSideButtonDisabled,
							]}
						>
							<Ionicons
								name={selectionMode ? 'close' : 'add'}
								size={24}
								color={colors.onColor}
							/>
						</Pressable>
					) : null}
					<Pressable
						onPress={() => setRecenterKey((key) => key + 1)}
						accessibilityRole="button"
						accessibilityLabel="Ir para minha localização"
						style={appStyles.mapsSideButton}
					>
						<Ionicons name="locate" size={22} color={colors.secondary} />
					</Pressable>
					<Pressable
						onPress={handleReloadZones}
						accessibilityRole="button"
						accessibilityLabel="Atualizar áreas"
						accessibilityState={{ busy: isReloading, disabled: isReloading }}
						disabled={isReloading}
						style={[appStyles.mapsSideButton, isReloading && appStyles.mapsSideButtonDisabled]}
					>
						{isReloading ? (
							<ActivityIndicator size="small" color={colors.secondary} />
						) : (
							<Ionicons name="refresh" size={22} color={colors.secondary} />
						)}
					</Pressable>
				</View>
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
