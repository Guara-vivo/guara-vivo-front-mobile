import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import type { MapZoneRead } from '../../types/api'
import { colors } from '../../constants/theme'
import { mapViewStyles as styles } from './mapViewStyles'

type Props = {
	zone: MapZoneRead
	selected: boolean
	onPress: (zone: MapZoneRead) => void
}

// Ponto da área no centro do círculo: vermelho com talher = alimentação, azul com casa = ninho.
// O selecionado fica maior, então a cor não é a única pista.
function ZoneMarkerBase({ zone, selected, onPress }: Props) {
	const isNest = zone.type === 'nest'
	// Desenha a vista uma vez e depois para de acompanhá-la (marcador custom é caro no Android).
	const [tracksViewChanges, setTracksViewChanges] = useState(true)

	useEffect(() => {
		setTracksViewChanges(true)
		const timer = setTimeout(() => setTracksViewChanges(false), 400)
		return () => clearTimeout(timer)
	}, [selected, zone.type])

	return (
		<Marker
			coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
			onPress={() => onPress(zone)}
			anchor={{ x: 0.5, y: 0.5 }}
			zIndex={selected ? 2 : 1}
			tracksViewChanges={tracksViewChanges}
			accessibilityLabel={`${isNest ? 'Ninho' : 'Área de alimentação'} ${zone.name}`}
		>
			<View
				style={[
					styles.zoneMarker,
					isNest ? styles.zoneMarkerNest : styles.zoneMarkerFeeding,
					selected && styles.zoneMarkerSelected,
				]}
			>
				<Ionicons
					name={isNest ? 'home' : 'restaurant'}
					size={selected ? 20 : 16}
					color={colors.onColor}
				/>
			</View>
		</Marker>
	)
}

export const ZoneMarker = React.memo(ZoneMarkerBase)
