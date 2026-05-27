import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { appStyles } from '../styles/appStyles'
import { MAP_RECORDS, MAP_ZONES } from '../config/map'
import type { ScreenId } from '../types/navigation'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

export function MapsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [selectedLayer, setSelectedLayer] = useState<
		'all' | 'feeding' | 'nests'
	>('all')

	const layerButtons: { id: 'all' | 'feeding' | 'nests'; label: string; icon: IoniconName }[] = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'fish' },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' },
	]

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

				<ScreenCard style={appStyles.mapsMapCard}>
					<MapLibreMapView
						selectedLayer={selectedLayer}
						records={MAP_RECORDS}
						zones={MAP_ZONES}
					/>
				</ScreenCard>
			</View>
		</View>
	)
}

export default MapsScreen
