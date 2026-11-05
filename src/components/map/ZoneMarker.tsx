import React from 'react'
import { Marker } from 'react-native-maps'
import type { MapZoneRead } from '../../types/api'

type Props = {
	zone: MapZoneRead
	selected: boolean
	onPress: (zone: MapZoneRead) => void
}

// Imagens estáticas (PNG @1x/2x/3x): o Android corta marcadores feitos de View quando o bitmap
// é capturado menor que a view, o que acontecia ao destacar a área (o ícone ficava cortado).
const ZONE_IMAGES = {
	feeding: require('../../assets/images/zone-feeding.png'),
	feedingSelected: require('../../assets/images/zone-feeding-selected.png'),
	nest: require('../../assets/images/zone-nest.png'),
	nestSelected: require('../../assets/images/zone-nest-selected.png'),
}

function getZoneImage(isNest: boolean, selected: boolean) {
	if (isNest) {
		return selected ? ZONE_IMAGES.nestSelected : ZONE_IMAGES.nest
	}

	return selected ? ZONE_IMAGES.feedingSelected : ZONE_IMAGES.feeding
}

// Ponto da área no centro do círculo: vermelho com talher = alimentação, azul com casa = ninho.
// O selecionado fica maior, então a cor não é a única pista.
function ZoneMarkerBase({ zone, selected, onPress }: Props) {
	const isNest = zone.type === 'nest'

	return (
		<Marker
			coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
			onPress={() => onPress(zone)}
			anchor={{ x: 0.5, y: 0.5 }}
			zIndex={selected ? 2 : 1}
			image={getZoneImage(isNest, selected)}
			accessibilityLabel={`${isNest ? 'Ninho' : 'Área de alimentação'} ${zone.name}`}
		/>
	)
}

export const ZoneMarker = React.memo(ZoneMarkerBase)
