import { formatBirdBehavior } from '../services/recordsApi'
import type { PendingRecord } from '../services/offlineQueue'
import type { RecordItem } from '../types/records'

export function pendingToRecordItem(pending: PendingRecord): RecordItem {
	return {
		// Ainda nao existe id na API; a chave de lista e o client_uuid.
		id: 0,
		ibis_quantity: 0,
		flock_size: pending.behavior.map(formatBirdBehavior).join(', '),
		latitude: pending.latitude,
		longitude: pending.longitude,
		datetime: pending.dateTime,
		images: pending.images.map((image) => image.uri),
		status: 'pending',
		analysis_progress: 0,
		user_id: pending.userId,
		map_zones: [],
		client_uuid: pending.clientUuid,
		sync_state: pending.status,
		sync_error: pending.lastError,
	}
}

// Junta o que a API devolveu com o que ainda esta so no aparelho. Se o registro ja
// existe na API (mesmo client_uuid), vale a versao da API e a pendente some.
export function mergeHistoryRecords(
	server: RecordItem[],
	pending: PendingRecord[],
): RecordItem[] {
	const sent = new Set(
		server.map((record) => record.client_uuid).filter((uuid): uuid is string => Boolean(uuid)),
	)

	return [
		...pending.filter((p) => !sent.has(p.clientUuid)).map(pendingToRecordItem),
		...server,
	]
}

export function recordKey(record: RecordItem) {
	return record.client_uuid && record.sync_state ? record.client_uuid : String(record.id)
}
