import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'
import type { MapZoneRead, MapZoneType } from '../types/api'
import type { RecordItem } from '../types/records'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { fetchRecords } from '../services/recordsService'

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
	const [records, setRecords] = useState<RecordItem[]>([])
	const [recordsLoading, setRecordsLoading] = useState(true)
	const [recordsError, setRecordsError] = useState<string | null>(null)
	const [showZoneModal, setShowZoneModal] = useState(false)
	const [creatingZone, setCreatingZone] = useState(false)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)

	const layerButtons: { id: 'all' | 'feeding' | 'nests'; label: string; icon: IoniconName }[] = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'fish' },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' },
	]

	useEffect(() => {
		let isMounted = true
		const abortController = new AbortController()

		const loadZones = async () => {
			try {
				setZonesError(null)
				const data = await getMapZones()
				if (isMounted) {
					setZones(data)
				}
			} catch (error) {
				if (isMounted) {
					setZonesError(error instanceof Error ? error.message : 'Erro ao carregar áreas')
				}
			}
		}

		const loadRecords = async () => {
			try {
				setRecordsError(null)
				const apiRecords = await fetchRecords({}, abortController.signal)
				if (isMounted) {
					setRecords(apiRecords)
				}
			} catch (error) {
				if (isMounted && !(error instanceof Error && error.name === 'AbortError')) {
					setRecordsError(error instanceof Error ? error.message : 'Erro ao carregar registros')
				}
			} finally {
				if (isMounted) {
					setRecordsLoading(false)
				}
			}
		}

		loadZones()
		loadRecords()

		return () => {
			isMounted = false
			abortController.abort()
		}
	}, [])

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

				<View style={appStyles.zoneActionButtonRow}>
					{selectionMode ? (
						<>
							<View style={appStyles.zoneSelectionIndicator}>
								<Text style={appStyles.zoneSelectionText}>Toque no mapa para escolher a área</Text>
							<Pressable
								style={appStyles.zoneCancelButton}
								onPress={() => {
									setSelectionMode(false)
									setSelectedCoords(null)
								}}
							>
								<Text style={appStyles.zoneCancelButtonText}>Cancelar</Text>
							</Pressable>
							</View>
						</>
					) : (
						<Pressable
							style={appStyles.zoneAddButton}
							onPress={() => setSelectionMode(true)}
							disabled={creatingZone}
						>
							<Ionicons name="add-circle" size={18} color="#FFFFFF" />
							<Text style={appStyles.zoneAddButtonText}>Adicionar Área</Text>
						</Pressable>
					)}
				</View>

				{zonesError && (
					<View style={appStyles.zoneErrorBanner}>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				)}

			{recordsError && (
				<View style={appStyles.zoneErrorBanner}>
					<Text style={appStyles.zoneErrorText}>{recordsError}</Text>
				</View>
			)}

			<ScreenCard style={appStyles.mapsMapCard}>
				<MapLibreMapView
					selectedLayer={selectedLayer}
					records={records}
					recordsLoading={recordsLoading}
					zones={zones}
					onMapPress={selectionMode ? handleMapPress : undefined}
				/>
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
