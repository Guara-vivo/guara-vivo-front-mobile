import { coordinateFromWorldPixel, worldPixel, type RecordClusterItem } from './clusterRecords'

// Distância mínima (em dp, centro a centro) entre um grupo (44 dp) e o ícone de uma zona (46 dp):
// a soma dos raios mais um respiro, para os dois não se encostarem.
export const ZONE_CLEARANCE_DP = 52
// Empurrar um grupo pode encostá-lo em outra zona; poucas voltas bastam para o caso comum.
const MAX_PASSES = 4

type Point = { latitude: number; longitude: number }

// Só muda onde o grupo é desenhado, para ele não cobrir o ícone de uma zona. Quem está dentro da
// distância mínima de uma zona é empurrado, na direção em que já estava em relação a ela (se
// estiver em cima, vai para a direita), até a distância mínima. O toque no grupo continua usando
// os registros dele, não esta posição.
export function keepClustersClearOfZones(items: RecordClusterItem[], zones: Point[], zoom: number): RecordClusterItem[] {
	if (zones.length === 0) {
		return items
	}

	const roundedZoom = Math.round(zoom)
	const zonePoints = zones.map((zone) => worldPixel(zone.latitude, zone.longitude, roundedZoom))

	return items.map((item) => {
		if (item.kind !== 'cluster') {
			return item
		}

		const position = worldPixel(item.latitude, item.longitude, roundedZoom)
		let moved = false

		for (let pass = 0; pass < MAX_PASSES; pass += 1) {
			let changed = false

			for (const zonePoint of zonePoints) {
				const dx = position.x - zonePoint.x
				const dy = position.y - zonePoint.y
				const distance = Math.hypot(dx, dy)

				if (distance >= ZONE_CLEARANCE_DP - 0.001) {
					continue
				}

				const [ux, uy] = distance < 0.01 ? [1, 0] : [dx / distance, dy / distance]

				position.x = zonePoint.x + ux * ZONE_CLEARANCE_DP
				position.y = zonePoint.y + uy * ZONE_CLEARANCE_DP
				changed = true
				moved = true
			}

			if (!changed) {
				break
			}
		}

		if (!moved) {
			return item
		}

		return { ...item, ...coordinateFromWorldPixel(position.x, position.y, roundedZoom) }
	})
}
