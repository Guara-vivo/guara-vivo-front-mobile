import { coordinateFromWorldPixel, worldPixel } from './clusterRecords'
import type { MapZoneRecordRead } from '../types/api'

// A conta é feita sempre neste zoom (o primeiro sem grupos), para cada registro ficar no mesmo
// lugar quando o admin aproxima ou afasta o mapa. Com mais zoom o espaço entre eles só aumenta.
export const FAN_OUT_REFERENCE_ZOOM = 20
// Dois marcadores (ponto de 32 dp) a menos que isso, centro a centro, se cobrem.
export const FAN_OUT_MIN_DISTANCE_DP = 42
// Distância mínima entre os pontos depois de afastados (um respiro de 2 dp além do marcador).
const FAN_OUT_SPACING_DP = 44
// Pontos que cabem no primeiro círculo; o k-ésimo círculo (a partir de 0) tem raio
// SPACING * (k + 1) e comporta 6 * (k + 1) pontos.
const FIRST_RING_CAPACITY = 6

type Point = { x: number; y: number }

// Marcadores que ficam colados (aos olhos de quem usa o mapa, no mesmo ponto) se abrem em círculo
// em volta do centro do grupo, sem se cobrirem. Só muda onde o marcador é desenhado: o registro
// continua com a coordenada real, que o detalhe mostra. O deslocamento é de poucos metros, perto
// do erro normal do GPS. Quem não tem vizinho colado volta como veio (mesmo objeto).
export function fanOutOverlappingRecords(records: MapZoneRecordRead[]): MapZoneRecordRead[] {
	if (records.length < 2) {
		return records
	}

	const points = records.map((record) =>
		worldPixel(record.latitude_camera, record.longitude_camera, FAN_OUT_REFERENCE_ZOOM),
	)
	const groups = overlapGroups(points)
	const fanned = new Map<number, MapZoneRecordRead>()

	for (const group of groups) {
		if (group.length < 2) {
			continue
		}

		const members = group.map((index) => ({ record: records[index], point: points[index] }))
		// Ordem fixa pelo id: o mesmo registro cai sempre no mesmo lugar do círculo.
		members.sort((a, b) => a.record.id - b.record.id)

		const center = {
			x: members.reduce((sum, member) => sum + member.point.x, 0) / members.length,
			y: members.reduce((sum, member) => sum + member.point.y, 0) / members.length,
		}

		ringOffsets(members.length).forEach((offset, position) => {
			const record = members[position].record
			const moved = coordinateFromWorldPixel(
				center.x + offset.x,
				center.y + offset.y,
				FAN_OUT_REFERENCE_ZOOM,
			)

			fanned.set(record.id, {
				...record,
				latitude_camera: moved.latitude,
				longitude_camera: moved.longitude,
			})
		})
	}

	return records.map((record) => fanned.get(record.id) ?? record)
}

// Grupos de registros ligados por proximidade (A perto de B e B perto de C põe os três juntos).
function overlapGroups(points: Point[]): number[][] {
	const parent = points.map((_, index) => index)
	const find = (index: number): number => {
		let root = index

		while (parent[root] !== root) {
			root = parent[root]
		}

		parent[index] = root

		return root
	}

	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < FAN_OUT_MIN_DISTANCE_DP) {
				parent[find(i)] = find(j)
			}
		}
	}

	const groups = new Map<number, number[]>()

	points.forEach((_, index) => {
		const root = find(index)

		groups.set(root, [...(groups.get(root) ?? []), index])
	})

	return [...groups.values()]
}

// Posição (em pixels, relativa ao centro) de cada um dos `count` pontos. O primeiro círculo é o
// menor possível para o tanto de pontos (até 6 a 36 dp do centro); sobrando, vêm círculos de fora.
function ringOffsets(count: number): Point[] {
	const offsets: Point[] = []
	let ring = 0

	while (offsets.length < count) {
		const inRing = Math.min(count - offsets.length, FIRST_RING_CAPACITY * (ring + 1))
		const radius =
			ring === 0
				? FAN_OUT_SPACING_DP / (2 * Math.sin(Math.PI / inRing))
				: FAN_OUT_SPACING_DP * (ring + 1)

		for (let step = 0; step < inRing; step++) {
			const angle = -Math.PI / 2 + (2 * Math.PI * step) / inRing

			offsets.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
		}

		ring += 1
	}

	return offsets
}
