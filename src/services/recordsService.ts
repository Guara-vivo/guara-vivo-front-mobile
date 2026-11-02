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
import { savePersistedRecords } from './recordsStore'
import type { RecordSummaryRead } from '../types/api'
import type { RecordItem, RecordDetailItem } from '../types/records'

type FetchOptions = {
	force?: boolean
}

// A API limita cada pagina; busca varias para nao esconder registros antigos.
const PAGE_SIZE = 100
const MAX_PAGES = 10

function abortError() {
	return Object.assign(new Error('Aborted'), { name: 'AbortError' })
}

// Deixa de esperar quando o chamador cancela, sem derrubar a requisicao compartilhada.
function waitUnlessAborted<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
	if (!signal) return promise
	if (signal.aborted) return Promise.reject(abortError())

	return new Promise<T>((resolve, reject) => {
		const onAbort = () => reject(abortError())
		signal.addEventListener('abort', onAbort)
		promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort))
	})
}

let recordsRequest: Promise<RecordItem[]> | null = null
const detailRequests = new Map<number, Promise<RecordDetailItem | undefined>>()

export async function fetchRecords(
	options: FetchOptions = {},
	signal?: AbortSignal,
): Promise<RecordItem[]> {
	if (!options.force) {
		const cached = getFreshCachedRecords()

		if (cached) {
			return cached
		}
	}

	if (recordsRequest) {
		return waitUnlessAborted(recordsRequest, signal)
	}

	// A requisicao e compartilhada: nao usa o signal de quem a iniciou, senao fechar essa
	// tela cancelaria a lista para as outras. Cada chamador so deixa de esperar.
	recordsRequest = loadRecords().finally(() => {
		recordsRequest = null
	})

	return waitUnlessAborted(recordsRequest, signal)
}

async function loadRecords(): Promise<RecordItem[]> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const records: RecordSummaryRead[] = []
	for (let page = 0; page < MAX_PAGES; page += 1) {
		const batch = await getRecordSummaries(token, page * PAGE_SIZE, PAGE_SIZE)
		records.push(...batch)
		if (batch.length < PAGE_SIZE) break
	}
	const items = records.map(mapRecordSummaryToRecordItem)

	setCachedRecords(items)
	void savePersistedRecords(items)
	return items
}

export async function fetchRecordDetail(
	recordId: number,
	options: FetchOptions = {},
	signal?: AbortSignal,
): Promise<RecordDetailItem | undefined> {
	if (!options.force) {
		const cached = getFreshCachedRecordDetail(recordId)

		if (cached) {
			return cached
		}
	}

	const activeRequest = detailRequests.get(recordId)

	if (activeRequest) {
		return waitUnlessAborted(activeRequest, signal)
	}

	const request = loadRecordDetail(recordId).finally(() => {
		detailRequests.delete(recordId)
	})
	detailRequests.set(recordId, request)

	return waitUnlessAborted(request, signal)
}

async function loadRecordDetail(
	recordId: number,
): Promise<RecordDetailItem | undefined> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const record = await getRecordDetail(token, recordId)

	const detail: RecordDetailItem = mapRecordDetailToRecordItem(record)

	setCachedRecordDetail(detail)
	return detail
}

export {
	getCachedRecordDetailSnapshot,
	getCachedRecordsSnapshot,
	invalidateRecordsCache,
	isRecordDetailCacheFresh,
	isRecordsCacheFresh,
	type RecordDetailItem,
}

export default { fetchRecordDetail, fetchRecords }
