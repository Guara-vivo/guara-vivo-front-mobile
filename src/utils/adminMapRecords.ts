import type { MapLayerId } from '../config/map'
import type { MapZoneRecordRead } from '../types/api'

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

// Admin olhando um registro que não é dele: o detalhe mostra de quem é.
export function isAdminViewOfRecord(
	recordUserId: number | undefined,
	viewer: { isAdmin: boolean; id: number | null },
): boolean {
	return viewer.isAdmin && viewer.id !== null && recordUserId !== undefined && recordUserId !== viewer.id
}
