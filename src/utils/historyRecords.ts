import type { RecordProgressUpdate } from '../services/recordProgressService'
import type { RecordItem } from '../types/records'

export type SortOrder = 'asc' | 'desc'

// Registro ainda sem resultado final: o app acompanha o progresso pelo WebSocket.
export function isActiveAnalysisStatus(status?: RecordItem['status']) {
	return !status || status === 'pending' || status === 'processing'
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

		return {
			...record,
			status: update.status,
			analysis_progress: update.analysis_progress,
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

// Ordena por data sem alterar a lista original.
export function sortRecordsByDate<T extends Pick<RecordItem, 'datetime'>>(
	records: T[],
	order: SortOrder,
) {
	const direction = order === 'desc' ? -1 : 1

	return [...records].sort(
		(a, b) =>
			direction * (new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
	)
}
