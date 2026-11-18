import type { MapZoneRecordRead } from '../types/api'

export type RecordClusterItem =
	| { kind: 'record'; record: MapZoneRecordRead }
	| {
			kind: 'cluster'
			key: string
			latitude: number
			longitude: number
			count: number
			records: MapZoneRecordRead[]
	  }

// Lado da célula da grade, em dp: marcadores mais próximos que isso se juntam num grupo.
const CLUSTER_CELL_DP = 60
// A partir deste zoom os registros aparecem um a um (mesmo empilhados).
const NO_CLUSTER_FROM_ZOOM = 18
const TILE_SIZE = 256

// Zoom do Google Maps a partir da largura de longitude visível (e da largura da tela em dp).
export function zoomFromLongitudeDelta(longitudeDelta: number, screenWidthDp: number) {
	return Math.log2((360 * screenWidthDp) / (TILE_SIZE * longitudeDelta))
}

// Posição do ponto no "mundo" em pixels (projeção Web Mercator) naquele zoom.
function worldPixel(latitude: number, longitude: number, zoom: number) {
	const scale = TILE_SIZE * 2 ** zoom
	const sin = Math.sin((latitude * Math.PI) / 180)

	return {
		x: ((longitude + 180) / 360) * scale,
		y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
	}
}

// Junta registros próximos numa grade de células de CLUSTER_CELL_DP. Célula com um registro só
// continua sendo o registro; com dois ou mais vira um grupo na posição média. Agrupamento simples
// (sem biblioteca): basta para algumas centenas de registros.
export function clusterRecords(records: MapZoneRecordRead[], zoom: number): RecordClusterItem[] {
	const roundedZoom = Math.round(zoom)

	if (roundedZoom >= NO_CLUSTER_FROM_ZOOM) {
		return records.map((record) => ({ kind: 'record', record }))
	}

	const cells = new Map<string, MapZoneRecordRead[]>()

	for (const record of records) {
		const { x, y } = worldPixel(record.latitude_camera, record.longitude_camera, roundedZoom)
		const cell = `${Math.floor(x / CLUSTER_CELL_DP)}:${Math.floor(y / CLUSTER_CELL_DP)}`
		const bucket = cells.get(cell)

		if (bucket) {
			bucket.push(record)
		} else {
			cells.set(cell, [record])
		}
	}

	const items: RecordClusterItem[] = []

	for (const [cell, bucket] of cells) {
		if (bucket.length === 1) {
			items.push({ kind: 'record', record: bucket[0] })
			continue
		}

		items.push({
			kind: 'cluster',
			key: `cluster-${roundedZoom}-${cell}`,
			latitude: bucket.reduce((sum, record) => sum + record.latitude_camera, 0) / bucket.length,
			longitude: bucket.reduce((sum, record) => sum + record.longitude_camera, 0) / bucket.length,
			count: bucket.length,
			records: bucket,
		})
	}

	return items
}

// Rótulo do grupo: o número exato até 9 e faixas ("10+", "20+", "50+", "100+") acima disso.
// Cada rótulo tem a sua imagem, então a lista é fechada.
export function clusterLabel(count: number): string {
	if (count >= 100) return '100+'
	if (count >= 50) return '50+'
	if (count >= 20) return '20+'
	if (count >= 10) return '10+'
	return String(count)
}
