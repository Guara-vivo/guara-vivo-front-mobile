import React, { useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'
import type { MapZoneRead, MapZoneType } from '../types/api'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { formatLastUpdatedAt } from '../utils/timeFormatters'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

export function MapsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [selectedLayer, setSelectedLayer] = useState<
		'all' | 'feeding' | 'nests'
	>('all')
	const [zones, setZones] = useState<MapZoneRead[]>([])
	const [zonesError, setZonesError] = useState<string | null>(null)
	const [showZoneModal, setShowZoneModal] = useState(false)
	const [creatingZone, setCreatingZone] = useState(false)
	const [isReloading, setIsReloading] = useState(false)
	const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
	const [lastUpdatedNow, setLastUpdatedNow] = useState(() => new Date())
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)

	const layerButtons: { id: 'all' | 'feeding' | 'nests'; label: string; icon: IoniconName }[] = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'fish' },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' },
	]

	const loadZones = useCallback(async (signal?: AbortSignal) => {
		try {
			setZonesError(null)
			const data = await getMapZones(signal)
			setZones(data)
			setLastUpdatedAt(new Date())
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				return
			}

			setZonesError(error instanceof Error ? error.message : 'Erro ao carregar áreas')
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

	const handleMapPress = (lat: number, lng: number) => {
		if (!selectionMode) return
		setSelectedCoords({ lat, lng })
		setShowZoneModal(true)
	}

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

				{zonesError && (
					<View style={appStyles.zoneErrorBanner}>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				)}

			<ScreenCard style={appStyles.mapsMapCard}>
				<MapLibreMapView
					selectedLayer={selectedLayer}
					zones={zones}
					onMapPress={selectionMode ? handleMapPress : undefined}
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
							onPress={() => {
								if (selectionMode) {
									setSelectionMode(false)
									setSelectedCoords(null)
									return
								}

								setSelectionMode(true)
							}}
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
								<Ionicons name="refresh" size={22} color="#FFFFFF" />
							)}
						</Pressable>
					</View>
					<View style={appStyles.mapReloadTextPill}>
						<Text style={appStyles.mapReloadText}>{lastUpdatedLabel}</Text>
					</View>
				</View>
			</ScreenCard>
			</View>

		<MapZoneSelectionModal
			visible={showZoneModal}
			onConfirm={handleCreateZone}
			onCancel={handleCancelModal}
			isSubmitting={creatingZone}
		/>
		</View>
	)
}

export default MapsScreen
