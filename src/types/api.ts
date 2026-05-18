export type BirdBehavior =
	| 'ninhando'
	| 'vocalizando'
	| 'alimentando-se'
	| 'voando'

export type RecordStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type UserRead = {
	id: number
	name: string
	email: string
}

export type LoginResponse = {
	access_token: string
	refresh_token: string
	token_type: 'bearer'
	user: UserRead
}

export type RecordRead = {
	id: number
	images: string[]
	latitude_camera: number
	longitude_camera: number
	behavior: BirdBehavior[]
	date_time: string
	user_id: number
	status: RecordStatus
}

export type RecordSummaryRead = RecordRead & {
	analysis_id: number | null
	ibis_quantity: number | null
}

export type AnalysisRead = {
	id: number
	ibis_quantity: number
	datetime: string
	recorder_id: number
}

export type IbisRead = {
	id: number
	color: string
	age_group: string
	analysis_id: number
}

export type RecordDetailRead = RecordRead & {
	analysis: AnalysisRead | null
	ibis: IbisRead[]
}

export type ReactNativeFile = {
	uri: string
	name: string
	type: string
}
