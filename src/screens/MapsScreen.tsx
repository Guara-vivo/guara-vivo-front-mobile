import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { appStyles } from '../styles/appStyles'
import { MAP_RECORDS, MAP_CENTER } from '../config/map'
import type { ScreenId } from '../types/navigation'
import type { MapZoneRead, MapZoneType } from '../types/api'
import { getMapZones, createMapZone } from '../services/mapZonesApi'
import { getUserId } from '../utils/getUserId'

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

	const layerButtons: { id: 'all' | 'feeding' | 'nests'; label: string; icon: IoniconName }[] = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'fish' },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' },
	]

	useEffect(() => {
		let isMounted = true

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

		loadZones()

		return () => {
			isMounted = false
		}
	}, [])

	const handleCreateZone = async (type: MapZoneType, radius_meters: number) => {
		try {
			setCreatingZone(true)
			const userId = await getUserId()
			const newZone = await createMapZone(type, MAP_CENTER.lat, MAP_CENTER.lng, radius_meters, userId)
			setZones((prev) => [newZone, ...prev])
			setShowZoneModal(false)
		} catch (error) {
			console.error('[MapsScreen] Failed to create zone:', error)
			setZonesError(error instanceof Error ? error.message : 'Erro ao criar área')
		} finally {
			setCreatingZone(false)
		}
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
					<Pressable
						style={appStyles.zoneAddButton}
						onPress={() => setShowZoneModal(true)}
						disabled={creatingZone}
					>
						<Ionicons name="add-circle" size={18} color="#FFFFFF" />
						<Text style={appStyles.zoneAddButtonText}>Adicionar Área</Text>
					</Pressable>
				</View>

				{zonesError && (
					<View style={appStyles.zoneErrorBanner}>
						<Text style={appStyles.zoneErrorText}>{zonesError}</Text>
					</View>
				)}

				<ScreenCard style={appStyles.mapsMapCard}>
					<MapLibreMapView
						selectedLayer={selectedLayer}
						records={MAP_RECORDS}
						zones={zones}
					/>
				</ScreenCard>
			</View>

			<MapZoneSelectionModal
				visible={showZoneModal}
				onConfirm={handleCreateZone}
				onCancel={() => setShowZoneModal(false)}
			/>
		</View>
	)
}

export default MapsScreen
