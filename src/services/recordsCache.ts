import type { IbisRead } from '../types/api'
import type { RecordItem, ImageAnalysisItem } from '../types/records'

export type CachedRecordDetail = RecordItem & {
	ibis?: IbisRead[]
	image_analyses?: ImageAnalysisItem[]
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

	// Do NOT cache records from /records/summary as "full details"
	// They lack image_analyses and will show "Aguardando análise..." incorrectly.
	// Only cache full records from /records/{id}/detail endpoint.
}

export function getCachedRecordDetailSnapshot(recordId: number) {
	const cached = detailCache.get(recordId)?.data

	// Only return cache if it has image_analyses (is a full detail, not summary)
	if (cached && cached.image_analyses) {
		return cached
	}

	// Return summary-level record only if fresh; don't confuse with full detail
	const fromSummary = recordsCache?.data.find((record) => record.id === recordId)
	if (fromSummary && isRecordsCacheFresh()) {
		return fromSummary
	}
	
	return undefined
}

export function isRecordDetailCacheFresh(recordId: number) {
	const cached = detailCache.get(recordId)
	
	// Cache is fresh only if:
	// 1. We have a specific detail cache entry (from /records/{id}/detail)
	// 2. AND it has image_analyses (means it's a full detail, not a summary)
	// 3. AND the timestamp is within TTL
	if (cached && cached.data.image_analyses) {
		return isFresh(cached.timestamp, RECORD_DETAIL_CACHE_TTL_MS)
	}
	
	return false
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
