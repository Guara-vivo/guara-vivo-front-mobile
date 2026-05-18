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
