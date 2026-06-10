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
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'

import { appStyles } from '../styles/appStyles'
import type { MapZoneRead, MapZoneType } from '../types/api'
import type { MapLayerId } from '../config/map'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { formatLastUpdatedAt } from '../utils/timeFormatters'
import { getVisibleMapZoneRecords } from '../utils/mapZoneRecords'

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
	const [lastUpdatedNow, setLastUpdatedNow] = useState(() => new Date())
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)

	const visibleZoneRecords = useMemo(
		() => getVisibleMapZoneRecords(ctx.zoneRecords),
		[ctx.zoneRecords],
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

			setZonesError(error instanceof Error ? error.message : 'Erro ao carregar áreas')
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
		const interval = setInterval(() => {
			setLastUpdatedNow(new Date())
		}, 60000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		return () => {
			if (selectionModalTimerRef.current) {
				clearTimeout(selectionModalTimerRef.current)
			}

		}
	}, [])

	const handleReloadZones = async () => {
		if (isReloading) {
			return
		}

		setIsReloading(true)

		try {
			await loadZones()
		} finally {
			setIsReloading(false)
		}
	}

	const lastUpdatedLabel = formatLastUpdatedAt(lastUpdatedAt, lastUpdatedNow)

	const handleSelectLayer = (layerId: MapLayerId) => {
		setSelectedLayer(layerId)
	}

	const handleToggleSelectionMode = () => {
		if (selectionMode) {
			setSelectionMode(false)
			setSelectedCoords(null)
			return
		}

		setSelectionMode(true)
	}

	const handleMapPress = (lat: number, lng: number) => {
		if (!selectionMode) return
		setSelectedCoords({ lat, lng })

		if (selectionModalTimerRef.current) {
			clearTimeout(selectionModalTimerRef.current)
		}

		selectionModalTimerRef.current = setTimeout(() => {
			setShowZoneModal(true)
			selectionModalTimerRef.current = null
		}, 50)
	}

	const handleZonePress = (zone: MapZoneRead) => {
		ctx.openSheet(zone)
	}

	const closeSheetRef = useRef(ctx.closeSheet)
	closeSheetRef.current = ctx.closeSheet

	useFocusEffect(
		useCallback(() => {
			return () => {
				closeSheetRef.current()
			}
		}, []),
	)

	useEffect(() => {
		ctx.registerOnZoneDeleted((zoneId: number) => {
			setZones((prev) => prev.filter((z) => z.id !== zoneId))
		})
	}, [ctx])

	const handleCreateZone = async (type: MapZoneType, radius_meters: number) => {
		if (!selectedCoords) return

		try {
			setCreatingZone(true)
			const newZone = await createMapZone(type, selectedCoords.lat, selectedCoords.lng, radius_meters)
			setZones((prev) => [newZone, ...prev])
			setSelectionMode(false)
			setSelectedCoords(null)
			setShowZoneModal(false)
		} catch (error) {
			console.error('[MapsScreen] Failed to create zone:', error)
			setZonesError(error instanceof Error ? error.message : 'Erro ao criar área')
		} finally {
			setCreatingZone(false)
		}
	}

	const handleCancelModal = () => {
		setShowZoneModal(false)
		// Keep selection mode and coords in case user wants to select different point
	}

	return (
		<View style={appStyles.mapsScreen}>
			<Header title="Mapas" />
			<View style={[appStyles.screen, appStyles.mapsContent]}>
				<ScreenCard style={appStyles.mapsFilterCard}>
					<View style={appStyles.mapsFilterTitleRow}>
						<Ionicons name="layers-outline" size={18} color="#125ED0" />
						<Text style={appStyles.sectionTitle}>CAMADA</Text>
					</View>

					<View style={appStyles.mapsFilterRow}>
						{LAYER_BUTTONS.map((item) => {
							const active = selectedLayer === item.id

							return (
								<Pressable
									key={item.id}
									onPress={() => handleSelectLayer(item.id)}
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

				{zonesError && (
					<View style={appStyles.zoneErrorBanner}>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				)}

			<ScreenCard style={appStyles.mapsMapCard}>
				<MapLibreMapView
					selectedLayer={selectedLayer}
					zones={zones}
					recordMarkers={visibleZoneRecords}
					onMapPress={selectionMode ? handleMapPress : undefined}
					onZonePress={!selectionMode ? handleZonePress : undefined}
					onRecordMarkerPress={!selectionMode ? ctx.onRecordMarkerPress : undefined}
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
								color="#FFFFFF"
							/>
						</Pressable>
						<Pressable
							onPress={handleReloadZones}
							disabled={isReloading}
							style={[
								appStyles.mapReloadButton,
								isReloading && appStyles.mapReloadButtonDisabled,
							]}
						>
							{isReloading ? (
								<ActivityIndicator size="small" color="#FFFFFF" />
							) : (
								<Ionicons name="refresh" size={18} color="#FFFFFF" />
							)}
						</Pressable>
					</View>
					<View style={appStyles.mapReloadTextPill}>
						<Text style={appStyles.mapReloadText}>{lastUpdatedLabel}</Text>
					</View>
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
