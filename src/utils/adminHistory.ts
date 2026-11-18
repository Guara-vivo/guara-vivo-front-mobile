import { mapRecordSummaryToRecordItem } from '../services/recordsApi'
import type { MapZoneRecordRead } from '../types/api'
import type { RecordItem } from '../types/records'

// Histórico do admin: os registros dele (com a fila do aparelho e o andamento ao vivo, que vêm da lista
// de sempre) mais os das outras pessoas. Os do próprio admin que vêm também na lista de todos ficam de
// fora, para não aparecerem duas vezes. Sem saber quem é o admin, não dá para separar: fica só a lista dele.
export function mergeAdminHistoryRecords(
	ownRecords: RecordItem[],
	adminRecords: MapZoneRecordRead[],
	viewerId: number | null,
): RecordItem[] {
	if (viewerId === null || adminRecords.length === 0) return ownRecords

	const others = adminRecords
		.filter((record) => record.user_id !== viewerId)
		.map((record): RecordItem => ({
			...mapRecordSummaryToRecordItem(record),
			author_name: record.author_name,
		}))

	return [...ownRecords, ...others]
}
