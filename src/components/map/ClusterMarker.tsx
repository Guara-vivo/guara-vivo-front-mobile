import { Marker } from 'react-native-maps'
import { useTranslation } from 'react-i18next'
import { clusterLabel } from '../../utils/clusterRecords'

// Uma imagem por rótulo (2 a 9 exatos; depois faixas), pelo mesmo motivo dos outros marcadores:
// no Android marcador feito de View é cortado quando o tamanho muda.
const CLUSTER_IMAGES: Record<string, number> = {
	'2': require('../../assets/images/record-cluster-2.png'),
	'3': require('../../assets/images/record-cluster-3.png'),
	'4': require('../../assets/images/record-cluster-4.png'),
	'5': require('../../assets/images/record-cluster-5.png'),
	'6': require('../../assets/images/record-cluster-6.png'),
	'7': require('../../assets/images/record-cluster-7.png'),
	'8': require('../../assets/images/record-cluster-8.png'),
	'9': require('../../assets/images/record-cluster-9.png'),
	'10+': require('../../assets/images/record-cluster-10plus.png'),
	'20+': require('../../assets/images/record-cluster-20plus.png'),
	'50+': require('../../assets/images/record-cluster-50plus.png'),
	'100+': require('../../assets/images/record-cluster-100plus.png'),
}

type ClusterMarkerProps = {
	latitude: number
	longitude: number
	count: number
	onPress: () => void
}

export function ClusterMarker({ latitude, longitude, count, onPress }: ClusterMarkerProps) {
	const { t } = useTranslation('map')

	return (
		<Marker
			coordinate={{ latitude, longitude }}
			onPress={onPress}
			anchor={{ x: 0.5, y: 0.5 }}
			// Acima do ícone da zona (203 e 204), que costuma ficar colado no grupo: tocar no grupo só
			// aproxima o mapa, e a zona continua alcançável pelo toque na área do círculo.
			zIndex={205}
			image={CLUSTER_IMAGES[clusterLabel(count)]}
			accessibilityLabel={t('marker.cluster', { count })}
		/>
	)
}
