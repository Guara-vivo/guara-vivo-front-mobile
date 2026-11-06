import type { RecordProgressUpdate } from '../services/recordProgressService'
import type { RecordItem } from '../types/records'

export type SortOrder = 'asc' | 'desc'

// Registro ainda sem resultado final: o app acompanha o progresso pelo WebSocket.
export function isActiveAnalysisStatus(status?: RecordItem['status']) {
	return !status || status === 'pending' || status === 'processing'
}

// Em análise pela IA, ou já concluída mas ainda sem a contagem final: a quantidade mostrada não vale.
// Registro só do aparelho (aguardando envio) não conta, ele tem o próprio aviso.
export function isAnalysisInProgress(
	record: Pick<RecordItem, 'status' | 'sync_state' | 'count_pending'>,
) {
	return !record.sync_state && (isActiveAnalysisStatus(record.status) || Boolean(record.count_pending))
}

// Aplica status e progresso recebidos em tempo real sobre a lista atual.
export function mergeProgressUpdates(
	records: RecordItem[],
	updates: RecordProgressUpdate[],
) {
	if (updates.length === 0) {
		return records
	}

	const updatesById = new Map(updates.map((update) => [update.id, update]))
	return records.map((record) => {
		const update = updatesById.get(record.id)

		if (!update) {
			return record
		}

		const justFinished =
			isActiveAnalysisStatus(record.status) && update.status === 'completed'

		return {
			...record,
			status: update.status,
			analysis_progress: update.analysis_progress,
			...(justFinished ? { count_pending: true } : null),
		}
	})
}

// A lista só traz status e progresso; quando uma análise termina (a quantidade de guarás e as
// fotos mudam) ou chega um registro que a lista não conhece, é preciso buscar a lista de novo.
export function needsRecordsRefresh(
	records: RecordItem[],
	updates: RecordProgressUpdate[],
) {
	const byId = new Map(records.map((record) => [record.id, record]))

	return updates.some((update) => {
		const known = byId.get(update.id)

		if (!known) {
			return true
		}

		return isActiveAnalysisStatus(known.status) && !isActiveAnalysisStatus(update.status)
	})
}

// Registro ainda não enviado (só no aparelho) é sempre o mais recente; os demais valem pelo id.
function recencyKey(record: Pick<RecordItem, 'id' | 'sync_state'>) {
	return record.sync_state ? Number.POSITIVE_INFINITY : record.id
}

// Ordena pela criação do registro (id), não pela data do avistamento, que pode ser retroativa.
// Não altera a lista original.
export function sortRecordsByRecency<T extends Pick<RecordItem, 'id' | 'sync_state'>>(
	records: T[],
	order: SortOrder,
) {
	const direction = order === 'desc' ? -1 : 1

	return [...records].sort((a, b) => {
		const left = recencyKey(a)
		const right = recencyKey(b)

		if (left === right) {
			return 0
		}

		return direction * (left < right ? -1 : 1)
	})
}

export function getLatestRecord<T extends Pick<RecordItem, 'id' | 'sync_state'>>(records: T[]) {
	return sortRecordsByRecency(records, 'desc')[0] ?? null
}
