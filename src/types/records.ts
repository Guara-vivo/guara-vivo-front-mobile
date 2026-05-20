export type RecordItem = {
	id: number
	ibis_quantity: number
	flock_size: string
	latitude: number
	longitude: number
	datetime: string
	images?: string[]
	status?: 'pending' | 'processing' | 'completed' | 'failed'
	user_id?: number
}

export type RawDetection = {
	cor: string
	fase_vida: string
	acuracia: {
		deteccao_yolo: number
		classificacao_guara: number
		classificacao_cor: number
		classificacao_fase_vida: number
		estimativa_distancia: number
	}
}

export type DetectionItem = {
	id: number
	color: string
	age_group: string
	analysis_image_id?: number | null
	raw_detection?: RawDetection | null
}

export type ImageAnalysisItem = {
	id: number
	image_index: number
	image_url: string
	ibis_quantity: number
	created_at: string
	raw_result?: string | null
	detections: DetectionItem[]
}

export type RecordDetailItem = RecordItem & {
	image_analyses?: ImageAnalysisItem[]
}
