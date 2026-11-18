import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { MapZoneRecordRead } from '../../types/api'
import { BALLOON_POINTER_DP, type BalloonPlacement } from '../../utils/balloonPlacement'
import { countLabel } from '../../utils/countLabel'
import { formatDateAtTime } from '../../utils/recordFormatters'
import { mapViewStyles as styles } from './mapViewStyles'

// Tamanho fixo: a posição é calculada antes de desenhar (utils/balloonPlacement), sem medir a view.
export const BALLOON_WIDTH_DP = 232
export const BALLOON_HEIGHT_DP = 60

// O que o mapa precisa saber do dono do balão: quando mostrá-lo e o que fazer ao tocar nele.
export type RecordBalloonHandlers = {
	shouldShow: (recordId: number) => boolean
	onPress: (recordId: number) => void
}

type RecordBalloonProps = {
	record: MapZoneRecordRead
	placement: BalloonPlacement
	onPress: () => void
}

// Balão do avistamento no mapa do admin: o essencial do registro, ancorado no marcador. Tocar nele
// abre o detalhe.
export function RecordBalloon({ record, placement, onPress }: RecordBalloonProps) {
	const { t } = useTranslation('map')
	const author = record.author_name?.trim() ? record.author_name : t('balloon.unknownAuthor')

	return (
		<View
			pointerEvents="box-none"
			style={{
				position: 'absolute',
				left: placement.left,
				top: placement.top,
				width: BALLOON_WIDTH_DP,
				height: BALLOON_HEIGHT_DP,
			}}
		>
			<Pressable
				onPress={onPress}
				accessibilityRole="button"
				accessibilityLabel={t('balloon.open', { id: record.id })}
				style={styles.balloon}
			>
				<View style={styles.balloonRow}>
					<Text style={styles.balloonAuthor} numberOfLines={1} ellipsizeMode="tail">
						{author}
					</Text>
					<Text style={styles.balloonId}>#{record.id}</Text>
				</View>
				<Text style={styles.balloonMeta} numberOfLines={1} ellipsizeMode="tail">
					{`${countLabel(record.ibis_quantity ?? 0)} · ${formatDateAtTime(record.date_time)}`}
				</Text>
			</Pressable>
			<View
				pointerEvents="none"
				style={[
					placement.side === 'above' ? styles.balloonPointerDown : styles.balloonPointerUp,
					{ left: placement.pointerLeft - BALLOON_POINTER_DP },
				]}
			/>
		</View>
	)
}
