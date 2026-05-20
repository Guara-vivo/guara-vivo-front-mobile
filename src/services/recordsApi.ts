import { apiFetch } from './apiClient'
import type {
	AnalysisRead,
	BirdBehavior,
	IbisRead,
	ReactNativeFile,
	RecordDetailRead,
	RecordRead,
	RecordSummaryRead,
} from '../types/api'
import type { RecordDetailItem, RecordItem } from '../types/records'

const behaviorLabels: Record<BirdBehavior, string> = {
	'alimentando-se': 'Alimentando',
	ninhando: 'Ninhando',
	vocalizando: 'Vocalizando',
	voando: 'Voando',
}

export function formatBirdBehavior(behavior: BirdBehavior) {
	return behaviorLabels[behavior]
}

export function mapRecordReadToRecordItem(
	record: RecordRead,
	analysis?: AnalysisRead | null,
): RecordItem {
	return {
		id: record.id,
		ibis_quantity: analysis?.ibis_quantity ?? 0,
		flock_size:
			record.behavior.map(formatBirdBehavior).join(', ') || record.status,
		latitude: record.latitude_camera,
		longitude: record.longitude_camera,
		datetime: record.date_time,
		images: record.images,
		status: record.status,
		user_id: record.user_id,
	}
}

export function mapRecordSummaryToRecordItem(
	record: RecordSummaryRead,
): RecordItem {
	return {
		...mapRecordReadToRecordItem(record),
		ibis_quantity: record.ibis_quantity ?? 0,
	}
}

export function mapRecordDetailToRecordItem(
	record: RecordDetailRead,
): RecordDetailItem {
	return {
		...mapRecordReadToRecordItem(record, record.analysis),
		ibis_quantity: record.analysis?.ibis_quantity ?? 0,
		image_analyses: record.image_analyses.map((img) => {
			// Filter ibis detections for this specific image
			const detections = record.ibis.filter(
				(ibis) => ibis.analysis_image_id === img.id
			)

			return {
				id: img.id,
				image_index: img.image_index,
				image_url: img.image_url,
				ibis_quantity: img.ibis_quantity,
				created_at: img.created_at,
				raw_result: img.raw_result,
				detections: detections.map((ibis) => {
					// Parse raw_detection if available
					let parsed_detection = null
					if (ibis.raw_detection) {
						try {
							parsed_detection =
								typeof ibis.raw_detection === 'string'
									? JSON.parse(ibis.raw_detection)
									: ibis.raw_detection
						} catch {
							parsed_detection = null
						}
					}

					return {
						id: ibis.id,
						color: ibis.color,
						age_group: ibis.age_group,
						analysis_image_id: ibis.analysis_image_id,
						raw_detection: parsed_detection,
					}
				}),
			}
		}),
	}
}

export async function getRecordSummaries(
	token: string,
	skip = 0,
	limit = 100,
): Promise<RecordSummaryRead[]> {
	const response = await apiFetch(`/records/summary?skip=${skip}&limit=${limit}`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<RecordSummaryRead[]>
}

export async function getRecordDetail(
	token: string,
	recordId: number,
): Promise<RecordDetailRead> {
	const response = await apiFetch(`/records/${recordId}/detail`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<RecordDetailRead>
}

export async function getRecords(
	token: string,
	skip = 0,
	limit = 100,
): Promise<RecordRead[]> {
	const response = await apiFetch(`/records?skip=${skip}&limit=${limit}`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<RecordRead[]>
}

export async function getRecord(
	token: string,
	recordId: number,
): Promise<RecordRead> {
	const response = await apiFetch(`/records/${recordId}`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<RecordRead>
}

export async function getAnalyses(
	token: string,
	skip = 0,
	limit = 100,
): Promise<AnalysisRead[]> {
	const response = await apiFetch(`/analysis?skip=${skip}&limit=${limit}`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<AnalysisRead[]>
}

export async function getRecordAnalysis(
	token: string,
	recordId: number,
): Promise<AnalysisRead | null> {
	const analyses = await getAnalyses(token)
	return analyses.find((analysis) => analysis.recorder_id === recordId) ?? null
}

export async function getIbis(
	token: string,
	skip = 0,
	limit = 100,
): Promise<IbisRead[]> {
	const response = await apiFetch(`/ibis?skip=${skip}&limit=${limit}`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<IbisRead[]>
}

export async function getAnalysisIbis(
	token: string,
	analysisId: number,
): Promise<IbisRead[]> {
	const ibis = await getIbis(token)
	return ibis.filter((item) => item.analysis_id === analysisId)
}

export async function uploadRecord(params: {
	token: string
	images: ReactNativeFile[]
	latitude: number
	longitude: number
	behavior: BirdBehavior[]
	dateTime?: Date
}): Promise<RecordRead> {
	const formData = new FormData()

	for (const image of params.images) {
		formData.append('images', image as unknown as Blob)
	}

	formData.append('latitude_camera', String(params.latitude))
	formData.append('longitude_camera', String(params.longitude))

	for (const item of params.behavior) {
		formData.append('behavior', item)
	}

	formData.append('date_time', (params.dateTime ?? new Date()).toISOString())

	const response = await apiFetch('/records/upload', {
		method: 'POST',
		headers: { Authorization: `Bearer ${params.token}` },
		body: formData,
	})

	return response.json() as Promise<RecordRead>
}

export default {
	getAnalyses,
	getAnalysisIbis,
	getIbis,
	getRecord,
	getRecordDetail,
	getRecordAnalysis,
	getRecordSummaries,
	getRecords,
	mapRecordDetailToRecordItem,
	mapRecordReadToRecordItem,
	mapRecordSummaryToRecordItem,
	uploadRecord,
}
