import { Animated } from 'react-native'
import { Marker } from 'react-native-maps'
import type { MapZoneRecordRead } from '../../types/api'

type RecordMarkerProps = {
	record: MapZoneRecordRead
	focused: boolean
	// Mantido pela API do hook de fade; marcador de imagem estática não anima opacidade.
	opacity?: Animated.Value
	onPress?: (recordId: number) => void
}

// Imagens estáticas (PNG @1x/2x/3x): o Android corta marcadores feitos de View quando o tamanho
// muda (acontecia ao selecionar). Guará nas cores originais; o anel vermelho vira azul e o marcador
// cresce quando o registro está em foco.
const RECORD_IMAGE = require('../../assets/images/record-marker.png')
const RECORD_IMAGE_FOCUSED = require('../../assets/images/record-marker-selected.png')

export function RecordMarker({ record, focused, onPress }: RecordMarkerProps) {
	return (
		<Marker
			coordinate={{
				latitude: record.latitude_camera,
				longitude: record.longitude_camera,
			}}
			onPress={onPress ? () => onPress(record.id) : undefined}
			anchor={{ x: 0.5, y: 0.5 }}
			zIndex={focused ? 201 : 200}
			image={focused ? RECORD_IMAGE_FOCUSED : RECORD_IMAGE}
			accessibilityLabel={`Registro ${record.id}, ${record.ibis_quantity ?? 0} guarás`}
		/>
	)
}
