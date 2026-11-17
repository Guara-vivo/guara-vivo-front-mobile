import { Animated } from 'react-native'
import { Marker } from 'react-native-maps'
import { useTranslation } from 'react-i18next'
import type { MapZoneRecordRead } from '../../types/api'
import { countLabel } from '../../utils/countLabel'
import { getRecordMarkerKind, type RecordMarkerKind } from '../../utils/adminMapRecords'

type RecordMarkerProps = {
	record: MapZoneRecordRead
	focused: boolean
	// Mantido pela API do hook de fade; marcador de imagem estática não anima opacidade.
	opacity?: Animated.Value
	onPress?: (recordId: number) => void
	// Definido só para admin: distingue registros próprios dos de outras pessoas e os sem guará.
	// Sem ele, todo marcador é o guará de sempre.
	viewerId?: number | null
}

// Imagens estáticas (PNG @1x/2x/3x): o Android corta marcadores feitos de View quando o tamanho
// muda (acontecia ao selecionar). Guará nas cores originais; o anel vermelho vira azul e o marcador
// cresce quando o registro está em foco.
// Admin: anel laranja para registros de outras pessoas e pontos simples (azul claro, os do próprio
// usuário; laranja claro, os de outras pessoas) para registros sem guará, pendentes ou com falha.
const RECORD_IMAGE = require('../../assets/images/record-marker.png')
const RECORD_IMAGE_FOCUSED = require('../../assets/images/record-marker-selected.png')
const RECORD_IMAGE_OTHER = require('../../assets/images/record-marker-other.png')
const DOT_IMAGE = require('../../assets/images/record-dot.png')
const DOT_IMAGE_OTHER = require('../../assets/images/record-dot-other.png')
const DOT_IMAGE_FOCUSED = require('../../assets/images/record-dot-selected.png')

const MARKER_IMAGES: Record<RecordMarkerKind, { normal: number; focused: number }> = {
	'own-hit': { normal: RECORD_IMAGE, focused: RECORD_IMAGE_FOCUSED },
	'other-hit': { normal: RECORD_IMAGE_OTHER, focused: RECORD_IMAGE_FOCUSED },
	'own-plain': { normal: DOT_IMAGE, focused: DOT_IMAGE_FOCUSED },
	'other-plain': { normal: DOT_IMAGE_OTHER, focused: DOT_IMAGE_FOCUSED },
}

export function RecordMarker({ record, focused, onPress, viewerId }: RecordMarkerProps) {
	const { t } = useTranslation('map')
	const adminView = viewerId !== undefined
	const kind: RecordMarkerKind = adminView ? getRecordMarkerKind(record, viewerId) : 'own-hit'
	const images = MARKER_IMAGES[kind]
	const foreign = kind === 'other-hit' || kind === 'other-plain'
	const plain = kind === 'own-plain' || kind === 'other-plain'
	const ibis = countLabel(record.ibis_quantity ?? 0)

	return (
		<Marker
			coordinate={{
				latitude: record.latitude_camera,
				longitude: record.longitude_camera,
			}}
			onPress={onPress ? () => onPress(record.id) : undefined}
			anchor={{ x: 0.5, y: 0.5 }}
			// Registros com guará ficam por cima dos pontos simples.
			zIndex={focused ? 201 : plain ? 199 : 200}
			image={focused ? images.focused : images.normal}
			accessibilityLabel={
				foreign
					? t('marker.recordBy', { id: record.id, ibis, author: record.author_name })
					: t('marker.record', { id: record.id, ibis })
			}
		/>
	)
}
