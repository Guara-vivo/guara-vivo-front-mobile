import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import {
	ActivityIndicator,
	Pressable,
	Text,
	View,
} from 'react-native'
import i18n from '../i18n'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { LastUpdatedPill } from '../components/map/LastUpdatedPill'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'

import { appStyles } from '../styles/appStyles'
import type { MapZoneRead, MapZoneType } from '../types/api'
import type { MapLayerId } from '../config/map'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { invalidateRecordsCache } from '../services/recordsService'
import { useAdminMapMarkers } from '../hooks/useAdminMapMarkers'
import { getVisibleMapZoneRecords } from '../utils/mapZoneRecords'
import { filterZonesByLayer } from '../utils/mapZoneStyle'
import { getLoadErrorMessage } from '../utils/loadErrorMessage'
import { colors } from '../constants/theme'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']
type LayerButton = { id: MapLayerId; icon: IoniconName }

const LAYER_BUTTONS: LayerButton[] = [
	{ id: 'all', icon: 'layers-outline' },
	{ id: 'feeding', icon: 'fish' },
	{ id: 'nests', icon: 'home' },
]

export function MapsScreen() {
	const { t } = useTranslation('map')
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
	// Só o admin: esconde os ícones das áreas para os registros colados neles receberem o toque.
	const [showZoneIcons, setShowZoneIcons] = useState(true)
	const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)

	const visibleZoneRecords = useMemo(
		() => getVisibleMapZoneRecords(ctx.zoneRecords),
		[ctx.zoneRecords],
	)

	// Admin: todos os registros de todos os usuários no mapa (as demais contas seguem como antes).
	const admin = useAdminMapMarkers(selectedLayer)
	const { refreshIfStale: refreshAdminRecords, reload: reloadAdminRecords } = admin

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

			setZonesError(getLoadErrorMessage(error, i18n.t('map:zones.loadError')))
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
			await Promise.all([loadZones(), reloadAdminRecords()])
		} finally {
			setIsReloading(false)
		}
	}, [isReloading, loadZones, reloadAdminRecords])

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

	// Ao voltar para o mapa, atualiza os registros do admin se a última carga já passou de 1 minuto.
	useFocusEffect(
		useCallback(() => {
			refreshAdminRecords()
		}, [refreshAdminRecords]),
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
			setZonesError(getLoadErrorMessage(error, i18n.t('map:zones.createError')))
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
					recordMarkers={admin.markers ?? visibleZoneRecords}
					markerViewerId={admin.isAdmin ? admin.viewerId : undefined}
					onMapPress={selectionMode ? handleMapPress : undefined}
					onZonePress={!selectionMode ? openSheet : undefined}
					onRecordMarkerPress={!selectionMode ? onRecordMarkerPress : undefined}
					recordBalloon={!selectionMode && admin.isAdmin ? admin.recordBalloon : undefined}
					hideZoneIcons={admin.isAdmin && !showZoneIcons}
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
								accessibilityLabel={t('layers.a11y', { label: t(`layers.${item.id}`) })}
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
									{t(`layers.${item.id}`)}
								</Text>
							</Pressable>
						)
					})}
				</View>

				<LastUpdatedPill
					lastUpdatedAt={lastUpdatedAt}
					countLabel={t(visibleZoneCount === 1 ? 'zonesCountOne' : 'zonesCountMany', { count: visibleZoneCount })}
				/>

				{zonesError ?? admin.error ? (
					<View
						style={[appStyles.zoneErrorBanner, appStyles.mapsErrorBanner]}
						accessibilityRole="alert"
						accessibilityLiveRegion="polite"
					>
						<Text style={appStyles.zoneErrorText}>{zonesError ?? admin.error}</Text>
					</View>
				) : null}

				{selectionMode ? (
					<View style={appStyles.mapSelectionInstructionOverlay} pointerEvents="none">
						<View style={appStyles.mapSelectionInstructionPill}>
							<Text style={appStyles.mapSelectionInstructionText}>
								{t('selectHint')}
							</Text>
						</View>
					</View>
				) : null}

				<View style={appStyles.mapsSideButtons}>
					{admin.isAdmin ? (
						<Pressable
							onPress={() => setShowZoneIcons((shown) => !shown)}
							accessibilityRole="button"
							accessibilityLabel={showZoneIcons ? t('hideZoneIcons') : t('showZoneIcons')}
							style={appStyles.mapsSideButton}
						>
							<Ionicons name={showZoneIcons ? 'eye' : 'eye-off'} size={22} color={colors.secondary} />
						</Pressable>
					) : null}
					{ctx.canManageZones ? (
						<Pressable
							onPress={handleToggleSelectionMode}
							accessibilityRole="button"
							accessibilityLabel={selectionMode ? t('cancelSelection') : t('addZone')}
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
						accessibilityLabel={t('locate')}
						style={appStyles.mapsSideButton}
					>
						<Ionicons name="locate" size={22} color={colors.secondary} />
					</Pressable>
					<Pressable
						onPress={handleReloadZones}
						accessibilityRole="button"
						accessibilityLabel={t('reload')}
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
