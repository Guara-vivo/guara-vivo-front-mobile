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

// Dois marcadores a menos que isso (em dp, centro a centro) se juntam num grupo. O marcador tem
// 46 dp, então 70 dp deixa um respiro entre os que ficam fora do grupo.
const CLUSTER_RADIUS_DP = 70
// A partir deste zoom os registros aparecem um a um (é o limite prático do mapa).
const NO_CLUSTER_FROM_ZOOM = 20
const TILE_SIZE = 256

// Zoom do Google Maps a partir da largura de longitude visível (e da largura da tela em dp).
export function zoomFromLongitudeDelta(longitudeDelta: number, screenWidthDp: number) {
	return Math.log2((360 * screenWidthDp) / (TILE_SIZE * longitudeDelta))
}

// Posição do ponto no "mundo" em pixels (projeção Web Mercator) naquele zoom.
export function worldPixel(latitude: number, longitude: number, zoom: number) {
	const scale = TILE_SIZE * 2 ** zoom
	const sin = Math.sin((latitude * Math.PI) / 180)

	return {
		x: ((longitude + 180) / 360) * scale,
		y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
	}
}

// Faz o caminho de volta de `worldPixel`: do pixel do "mundo" para latitude e longitude.
export function coordinateFromWorldPixel(x: number, y: number, zoom: number) {
	const scale = TILE_SIZE * 2 ** zoom
	const mercator = (0.5 - y / scale) * 2 * Math.PI

	return {
		latitude: (Math.atan(Math.sinh(mercator)) * 180) / Math.PI,
		longitude: (x / scale) * 360 - 180,
	}
}

type Group = { records: MapZoneRecordRead[]; x: number; y: number }

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
	return Math.hypot(a.x - b.x, a.y - b.y)
}

// Junta registros próximos na tela: cada registro entra no grupo mais perto dentro do raio (ou abre
// um novo) e, no fim, grupos que ficaram perto uns dos outros se fundem. Sem grade, então não há
// efeito de borda. Grupo com um registro só continua sendo o registro; com dois ou mais vira um
// grupo na posição média. Basta para algumas centenas de registros.
export function clusterRecords(records: MapZoneRecordRead[], zoom: number): RecordClusterItem[] {
	const roundedZoom = Math.round(zoom)

	if (roundedZoom >= NO_CLUSTER_FROM_ZOOM) {
		return records.map((record) => ({ kind: 'record', record }))
	}

	const groups: Group[] = []

	for (const record of records) {
		const point = worldPixel(record.latitude_camera, record.longitude_camera, roundedZoom)
		let nearest: Group | null = null
		let nearestDistance = CLUSTER_RADIUS_DP

		for (const group of groups) {
			const d = distance(group, point)

			if (d <= nearestDistance) {
				nearest = group
				nearestDistance = d
			}
		}

		if (nearest) {
			const size = nearest.records.length
			nearest.x = (nearest.x * size + point.x) / (size + 1)
			nearest.y = (nearest.y * size + point.y) / (size + 1)
			nearest.records.push(record)
		} else {
			groups.push({ records: [record], x: point.x, y: point.y })
		}
	}

	let merged = true

	while (merged) {
		merged = false

		for (let i = 0; i < groups.length && !merged; i += 1) {
			for (let j = i + 1; j < groups.length && !merged; j += 1) {
				if (distance(groups[i], groups[j]) <= CLUSTER_RADIUS_DP) {
					const a = groups[i]
					const b = groups[j]
					const total = a.records.length + b.records.length

					a.x = (a.x * a.records.length + b.x * b.records.length) / total
					a.y = (a.y * a.records.length + b.y * b.records.length) / total
					a.records.push(...b.records)
					groups.splice(j, 1)
					merged = true
				}
			}
		}
	}

	return groups.map((group): RecordClusterItem => {
		if (group.records.length === 1) {
			return { kind: 'record', record: group.records[0] }
		}

		const count = group.records.length

		return {
			kind: 'cluster',
			key: `cluster-${roundedZoom}-${Math.min(...group.records.map((record) => record.id))}`,
			latitude: group.records.reduce((sum, record) => sum + record.latitude_camera, 0) / count,
			longitude: group.records.reduce((sum, record) => sum + record.longitude_camera, 0) / count,
			count,
			records: group.records,
		}
	})
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
