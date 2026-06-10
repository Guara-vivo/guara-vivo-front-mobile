import type { MapZoneRecordRead } from '../types/api'

export function getVisibleMapZoneRecords(
	records: MapZoneRecordRead[],
	limit = 10,
) {
	return records
		.filter((record) => record.status === 'completed' && (record.ibis_quantity ?? 0) > 0)
		.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
		.slice(0, limit)
}
