import { getToken } from './authService'
import {
	getCachedRecordDetailSnapshot,
	getCachedRecordsSnapshot,
	getFreshCachedRecordDetail,
	getFreshCachedRecords,
	invalidateRecordsCache,
	isRecordDetailCacheFresh,
	isRecordsCacheFresh,
	setCachedRecordDetail,
	setCachedRecords,
} from './recordsCache'
import {
	getRecordDetail,
	getRecordSummaries,
	mapRecordDetailToRecordItem,
	mapRecordSummaryToRecordItem,
} from './recordsApi'
import type { IbisRead } from '../types/api'
import type { RecordItem } from '../types/records'

export type RecordDetailItem = RecordItem & {
	ibis?: IbisRead[]
}

type FetchOptions = {
	force?: boolean
}

let recordsRequest: Promise<RecordItem[]> | null = null
const detailRequests = new Map<number, Promise<RecordDetailItem | undefined>>()

export async function fetchRecords(
	options: FetchOptions = {},
): Promise<RecordItem[]> {
	if (!options.force) {
		const cached = getFreshCachedRecords()

		if (cached) {
			return cached
		}
	}

	if (recordsRequest) {
		return recordsRequest
	}

	recordsRequest = loadRecords().finally(() => {
		recordsRequest = null
	})

	return recordsRequest
}

async function loadRecords(): Promise<RecordItem[]> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const records = await getRecordSummaries(token)
	const items = records.map(mapRecordSummaryToRecordItem)

	setCachedRecords(items)
	return items
}

export async function fetchRecordDetail(
	recordId: number,
	options: FetchOptions = {},
): Promise<RecordDetailItem | undefined> {
	if (!options.force) {
		const cached = getFreshCachedRecordDetail(recordId)

		if (cached) {
			return cached
		}
	}

	const activeRequest = detailRequests.get(recordId)

	if (activeRequest) {
		return activeRequest
	}

	const request = loadRecordDetail(recordId).finally(() => {
		detailRequests.delete(recordId)
	})
	detailRequests.set(recordId, request)

	return request
}

async function loadRecordDetail(
	recordId: number,
): Promise<RecordDetailItem | undefined> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const record = await getRecordDetail(token, recordId)

	const detail = {
		...mapRecordDetailToRecordItem(record),
		ibis: record.ibis,
	}

	setCachedRecordDetail(detail)
	return detail
}

export {
	getCachedRecordDetailSnapshot,
	getCachedRecordsSnapshot,
	invalidateRecordsCache,
	isRecordDetailCacheFresh,
	isRecordsCacheFresh,
}

export default { fetchRecordDetail, fetchRecords }
