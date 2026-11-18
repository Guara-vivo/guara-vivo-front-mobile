import { Animated } from 'react-native'
import { Marker } from 'react-native-maps'
import { useTranslation } from 'react-i18next'
import type { MapZoneRecordRead } from '../../types/api'
import { countLabel } from '../../utils/countLabel'
import {
	getRecordMarkerKind,
	getRecordMarkerVariant,
	getRecordMarkerZIndex,
	type RecordMarkerKind,
	type RecordMarkerVariant,
} from '../../utils/adminMapRecords'

type RecordMarkerProps = {
	record: MapZoneRecordRead
	focused: boolean
	// Ponto sólido de 32 dp no lugar do guará (registros aparecendo um a um, bem próximos).
	compact?: boolean
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
const RECORD_IMAGE_COMPACT = require('../../assets/images/record-marker-compact.png')
const RECORD_IMAGE_FOCUSED_COMPACT = require('../../assets/images/record-marker-selected-compact.png')
const RECORD_IMAGE_OTHER_COMPACT = require('../../assets/images/record-marker-other-compact.png')
const DOT_IMAGE = require('../../assets/images/record-dot.png')
const DOT_IMAGE_OTHER = require('../../assets/images/record-dot-other.png')
const DOT_IMAGE_FOCUSED = require('../../assets/images/record-dot-selected.png')

const MARKER_IMAGES: Record<RecordMarkerKind, Record<RecordMarkerVariant, number>> = {
	'own-hit': {
		normal: RECORD_IMAGE,
		compact: RECORD_IMAGE_COMPACT,
		focused: RECORD_IMAGE_FOCUSED,
		'focused-compact': RECORD_IMAGE_FOCUSED_COMPACT,
	},
	'other-hit': {
		normal: RECORD_IMAGE_OTHER,
		compact: RECORD_IMAGE_OTHER_COMPACT,
		focused: RECORD_IMAGE_FOCUSED,
		'focused-compact': RECORD_IMAGE_FOCUSED_COMPACT,
	},
	'own-plain': {
		normal: DOT_IMAGE,
		compact: DOT_IMAGE,
		focused: DOT_IMAGE_FOCUSED,
		'focused-compact': DOT_IMAGE_FOCUSED,
	},
	'other-plain': {
		normal: DOT_IMAGE_OTHER,
		compact: DOT_IMAGE_OTHER,
		focused: DOT_IMAGE_FOCUSED,
		'focused-compact': DOT_IMAGE_FOCUSED,
	},
}

export function RecordMarker({ record, focused, compact = false, onPress, viewerId }: RecordMarkerProps) {
	const { t } = useTranslation('map')
	const adminView = viewerId !== undefined
	const kind: RecordMarkerKind = adminView ? getRecordMarkerKind(record, viewerId) : 'own-hit'
	const variant = getRecordMarkerVariant(kind, focused, compact)
	const foreign = kind === 'other-hit' || kind === 'other-plain'
	const ibis = countLabel(record.ibis_quantity ?? 0)

	return (
		<Marker
			coordinate={{
				latitude: record.latitude_camera,
				longitude: record.longitude_camera,
			}}
			onPress={onPress ? () => onPress(record.id) : undefined}
			anchor={{ x: 0.5, y: 0.5 }}
			// Registros com guará ficam por cima dos pontos simples; o grande em foco sobe acima dos vizinhos.
			zIndex={getRecordMarkerZIndex(kind, variant)}
			image={MARKER_IMAGES[kind][variant]}
			accessibilityLabel={
				foreign
					? t('marker.recordBy', { id: record.id, ibis, author: record.author_name })
					: t('marker.record', { id: record.id, ibis })
			}
		/>
	)
}
