import type { IbisRead } from '../types/api'
import type { RecordItem } from '../types/records'

export type CachedRecordDetail = RecordItem & {
	ibis?: IbisRead[]
}

const RECORDS_CACHE_TTL_MS = 60 * 1000
const RECORD_DETAIL_CACHE_TTL_MS = 60 * 1000
const MAX_DETAIL_CACHE_ITEMS = 20

let recordsCache: { data: RecordItem[]; timestamp: number } | null = null
const detailCache = new Map<
	number,
	{ data: CachedRecordDetail; timestamp: number }
>()

function isFresh(timestamp: number, ttlMs: number) {
	return Date.now() - timestamp < ttlMs
}

export function getCachedRecordsSnapshot() {
	return recordsCache?.data
}

export function isRecordsCacheFresh() {
	return recordsCache ? isFresh(recordsCache.timestamp, RECORDS_CACHE_TTL_MS) : false
}

export function getFreshCachedRecords() {
	return isRecordsCacheFresh() ? recordsCache?.data : undefined
}

export function setCachedRecords(records: RecordItem[]) {
	recordsCache = { data: records, timestamp: Date.now() }

	for (const record of records) {
		setCachedRecordDetail(record)
	}
}

export function getCachedRecordDetailSnapshot(recordId: number) {
	const cached = detailCache.get(recordId)?.data

	if (cached) {
		return cached
	}

	return recordsCache?.data.find((record) => record.id === recordId)
}

export function isRecordDetailCacheFresh(recordId: number) {
	const cached = detailCache.get(recordId)
	return cached
		? isFresh(cached.timestamp, RECORD_DETAIL_CACHE_TTL_MS)
		: isRecordsCacheFresh()
}

export function getFreshCachedRecordDetail(recordId: number) {
	return isRecordDetailCacheFresh(recordId)
		? getCachedRecordDetailSnapshot(recordId)
		: undefined
}

export function setCachedRecordDetail(record: CachedRecordDetail) {
	if (detailCache.has(record.id)) {
		detailCache.delete(record.id)
	}

	detailCache.set(record.id, { data: record, timestamp: Date.now() })

	while (detailCache.size > MAX_DETAIL_CACHE_ITEMS) {
		const oldestKey = detailCache.keys().next().value

		if (oldestKey === undefined) {
			break
		}

		detailCache.delete(oldestKey)
	}
}

export function invalidateRecordsCache() {
	recordsCache = null
	detailCache.clear()
}
