import type { MapLayerId } from '../config/map'
import type { MapZoneRead, MapZoneRecordRead } from '../types/api'

export type RecordMarkerKind = 'own-hit' | 'other-hit' | 'own-plain' | 'other-plain'

// Mesma regra do mapa do painel: com guarás contados e análise concluída.
function isHit(record: MapZoneRecordRead) {
	return record.status === 'completed' && (record.ibis_quantity ?? 0) > 0
}

// Camada "todas" mantém tudo (inclusive registros fora de qualquer zona); as outras
// mantêm os registros ligados a uma zona daquele tipo.
export function filterRecordsByLayer(records: MapZoneRecordRead[], layer: MapLayerId) {
	if (layer === 'all') return records

	const zoneType = layer === 'feeding' ? 'feeding' : 'nest'
	return records.filter((record) => record.map_zones.some((zone) => zone.type === zoneType))
}

// Qual imagem de marcador usar: guará (com contagem) ou ponto simples, do próprio usuário ou de outra pessoa.
export function getRecordMarkerKind(
	record: MapZoneRecordRead,
	viewerId: number | null,
): RecordMarkerKind {
	const own = viewerId !== null && record.user_id === viewerId
	const hit = isHit(record)

	if (own) return hit ? 'own-hit' : 'own-plain'
	return hit ? 'other-hit' : 'other-plain'
}

export type RecordMarkerVariant = 'normal' | 'compact' | 'focused' | 'focused-compact'

function isHitKind(kind: RecordMarkerKind) {
	return kind === 'own-hit' || kind === 'other-hit'
}

// Qual imagem usar. No modo compacto os marcadores de guará encolhem (os pontos simples já são
// pequenos) e o registro em foco também é um ponto de 32 dp, azul: um marcador em foco maior ou
// mais alto que os vizinhos colados ganha o toque deles (o Android escolhe pelo `zIndex` e pela
// área do marcador), e o toque no vizinho caía no selecionado.
export function getRecordMarkerVariant(
	kind: RecordMarkerKind,
	focused: boolean,
	compact: boolean,
): RecordMarkerVariant {
	if (focused) {
		return compact && isHitKind(kind) ? 'focused-compact' : 'focused'
	}

	return compact && isHitKind(kind) ? 'compact' : 'normal'
}

// O grande em foco fica acima dos vizinhos; no modo compacto ninguém sobe, para o toque ir ao
// marcador que a pessoa tocou. Pontos simples ficam abaixo dos de guará.
export function getRecordMarkerZIndex(kind: RecordMarkerKind, variant: RecordMarkerVariant): number {
	if (variant === 'focused') {
		return 201
	}

	return isHitKind(kind) ? 200 : 199
}

// Metade do tamanho da imagem do marcador em foco (record-marker-selected 58 dp; record-dot-selected
// 30 dp; no modo compacto o guará em foco é o ponto de 32 dp), para o balão encostar nele sem cobri-lo.
export function focusedMarkerRadius(kind: RecordMarkerKind, compact: boolean): number {
	if (!isHitKind(kind)) {
		return 15
	}

	return compact ? 16 : 29
}

// Admin olhando um registro que não é dele: o detalhe mostra de quem é.
export function isAdminViewOfRecord(
	recordUserId: number | undefined,
	viewer: { isAdmin: boolean; id: number | null },
): boolean {
	return viewer.isAdmin && viewer.id !== null && recordUserId !== undefined && recordUserId !== viewer.id
}

// Verdadeiro quando o toque no registro deve abrir o balão; falso quando a folha de uma zona está
// aberta e o registro está na lista dela (aí o toque destaca e rola, como sempre).
export function shouldShowRecordBalloon(
	recordId: number,
	selectedZone: MapZoneRead | null,
	zoneRecords: MapZoneRecordRead[],
): boolean {
	return !(selectedZone !== null && zoneRecords.some((record) => record.id === recordId))
}
