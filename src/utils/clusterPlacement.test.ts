import { keepClustersClearOfZones, ZONE_CLEARANCE_DP } from './clusterPlacement'
import { worldPixel, type RecordClusterItem } from './clusterRecords'
import type { MapZoneRecordRead } from '../types/api'

const ZOOM = 17
const LAT = -24.5
const LNG = -47.8

function lngForDp(dp: number, zoom: number) {
	return (dp * 360) / (256 * 2 ** zoom)
}

function cluster(latitude: number, longitude: number): Extract<RecordClusterItem, { kind: 'cluster' }> {
	return { kind: 'cluster', key: 'cluster-1', latitude, longitude, count: 3, records: [] }
}

function dpBetween(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
	const p = worldPixel(a.latitude, a.longitude, ZOOM)
	const q = worldPixel(b.latitude, b.longitude, ZOOM)

	return Math.hypot(p.x - q.x, p.y - q.y)
}

const zone = { latitude: LAT, longitude: LNG }

describe('keepClustersClearOfZones', () => {
	it('leaves a cluster that is far from every zone exactly as it is', () => {
		const far = cluster(LAT, LNG + lngForDp(200, ZOOM))
		const [result] = keepClustersClearOfZones([far], [zone], ZOOM)

		expect(result).toBe(far)
	})

	it('does not touch single records', () => {
		const record = { kind: 'record', record: { id: 1 } as MapZoneRecordRead } as const
		const [result] = keepClustersClearOfZones([record], [zone], ZOOM)

		expect(result).toBe(record)
	})

	it('moves a cluster that sits on a zone icon until the two icons no longer overlap', () => {
		const [result] = keepClustersClearOfZones([cluster(LAT, LNG + lngForDp(5, ZOOM))], [zone], ZOOM)

		expect(result.kind).toBe('cluster')
		expect(dpBetween(result as { latitude: number; longitude: number }, zone)).toBeCloseTo(ZONE_CLEARANCE_DP, 1)
	})

	it('pushes the cluster away along the side it already was on', () => {
		const [left] = keepClustersClearOfZones([cluster(LAT, LNG - lngForDp(10, ZOOM))], [zone], ZOOM)
		const [right] = keepClustersClearOfZones([cluster(LAT, LNG + lngForDp(10, ZOOM))], [zone], ZOOM)

		expect((left as { longitude: number }).longitude).toBeLessThan(LNG)
		expect((right as { longitude: number }).longitude).toBeGreaterThan(LNG)
	})

	it('puts a cluster exactly on top of the zone to its right, at the same height', () => {
		const [result] = keepClustersClearOfZones([cluster(LAT, LNG)], [zone], ZOOM)

		expect((result as { longitude: number }).longitude).toBeGreaterThan(LNG)
		expect((result as { latitude: number }).latitude).toBeCloseTo(LAT, 8)
	})

	it('keeps the key, the count and the records of the cluster it moves', () => {
		const original = cluster(LAT, LNG)
		const [result] = keepClustersClearOfZones([original], [zone], ZOOM)

		expect(result).toMatchObject({ kind: 'cluster', key: 'cluster-1', count: 3, records: [] })
		expect(original.longitude).toBe(LNG)
	})

	it('keeps clear of every zone when there is more than one', () => {
		const second = { latitude: LAT, longitude: LNG + lngForDp(ZONE_CLEARANCE_DP, ZOOM) }
		const [result] = keepClustersClearOfZones([cluster(LAT, LNG + lngForDp(4, ZOOM))], [zone, second], ZOOM)
		const moved = result as { latitude: number; longitude: number }

		expect(dpBetween(moved, zone)).toBeGreaterThanOrEqual(ZONE_CLEARANCE_DP - 0.5)
		expect(dpBetween(moved, second)).toBeGreaterThanOrEqual(ZONE_CLEARANCE_DP - 0.5)
	})
})
