import { getToken } from './authService'
import {
	getAnalysisIbis,
	getAnalyses,
	getRecord,
	getRecordAnalysis,
	getRecords,
	mapRecordReadToRecordItem,
} from './recordsApi'
import type { IbisRead } from '../types/api'
import type { RecordItem } from '../types/records'

export type RecordDetailItem = RecordItem & {
	ibis?: IbisRead[]
}

export async function fetchRecords(): Promise<RecordItem[]> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const records = await getRecords(token)
	const analyses = await getAnalyses(token)

	return records.map((record) =>
		mapRecordReadToRecordItem(
			record,
			analyses.find((analysis) => analysis.recorder_id === record.id),
		),
	)
}

export async function fetchRecordDetail(
	recordId: number,
): Promise<RecordDetailItem | undefined> {
	const token = await getToken()

	if (!token) {
		throw new Error('Missing access token')
	}

	const record = await getRecord(token, recordId)
	const analysis = await getRecordAnalysis(token, recordId)
	const ibis = analysis ? await getAnalysisIbis(token, analysis.id) : []

	return {
		...mapRecordReadToRecordItem(record, analysis),
		ibis,
	}
}

export default { fetchRecordDetail, fetchRecords }
