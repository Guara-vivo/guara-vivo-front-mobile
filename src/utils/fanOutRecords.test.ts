import { worldPixel } from './clusterRecords'
import {
	FAN_OUT_MIN_DISTANCE_DP,
	FAN_OUT_REFERENCE_ZOOM,
	fanOutOverlappingRecords,
} from './fanOutRecords'
import type { MapZoneRecordRead } from '../types/api'

function makeRecord(id: number, latitude: number, longitude: number): MapZoneRecordRead {
	return {
		id,
		images: [],
		latitude_camera: latitude,
		longitude_camera: longitude,
		behavior: ['voando'],
		date_time: '2026-06-04T10:00:00Z',
		user_id: 7,
		status: 'completed',
		analysis_progress: 100,
		map_zones: [],
		analysis_id: id,
		ibis_quantity: 2,
		author_name: 'Ana Silva',
	}
}

const LAT = -24.5
const LNG = -47.8

function pixel(record: MapZoneRecordRead) {
	return worldPixel(record.latitude_camera, record.longitude_camera, FAN_OUT_REFERENCE_ZOOM)
}

function dp(a: MapZoneRecordRead, b: MapZoneRecordRead) {
	const pa = pixel(a)
	const pb = pixel(b)

	return Math.hypot(pa.x - pb.x, pa.y - pb.y)
}

function stackOf(count: number) {
	return Array.from({ length: count }, (_, index) => makeRecord(index + 1, LAT, LNG))
}

function minPairDistance(records: MapZoneRecordRead[]) {
	let min = Infinity

	for (let i = 0; i < records.length; i++) {
		for (let j = i + 1; j < records.length; j++) {
			min = Math.min(min, dp(records[i], records[j]))
		}
	}

	return min
}

describe('fanOutOverlappingRecords', () => {
	it('leaves a lone record exactly where it is', () => {
		const lone = makeRecord(1, LAT, LNG)

		expect(fanOutOverlappingRecords([lone])[0]).toBe(lone)
	})

	it('leaves records that already have room between them untouched', () => {
		const a = makeRecord(1, LAT, LNG)
		const far = makeRecord(2, LAT, LNG + 0.0001)

		const [outA, outFar] = fanOutOverlappingRecords([a, far])

		expect(outA).toBe(a)
		expect(outFar).toBe(far)
	})

	it('pulls two records on the same spot apart by at least the marker spacing', () => {
		const out = fanOutOverlappingRecords(stackOf(2))

		expect(minPairDistance(out)).toBeGreaterThanOrEqual(FAN_OUT_MIN_DISTANCE_DP)
	})

	it('keeps every record apart in a big stack, using more than one ring', () => {
		const out = fanOutOverlappingRecords(stackOf(20))

		expect(minPairDistance(out)).toBeGreaterThanOrEqual(FAN_OUT_MIN_DISTANCE_DP)
	})

	it('spreads around the middle of the group instead of drifting off', () => {
		const out = fanOutOverlappingRecords(stackOf(5))
		const centerX = out.reduce((sum, record) => sum + pixel(record).x, 0) / out.length
		const centerY = out.reduce((sum, record) => sum + pixel(record).y, 0) / out.length
		const origin = worldPixel(LAT, LNG, FAN_OUT_REFERENCE_ZOOM)

		expect(Math.hypot(centerX - origin.x, centerY - origin.y)).toBeLessThan(2)
	})

	it('moves a pair no further than needed (about half the spacing each)', () => {
		const out = fanOutOverlappingRecords(stackOf(2))
		const origin = worldPixel(LAT, LNG, FAN_OUT_REFERENCE_ZOOM)

		for (const record of out) {
			const p = pixel(record)

			expect(Math.hypot(p.x - origin.x, p.y - origin.y)).toBeLessThanOrEqual(FAN_OUT_MIN_DISTANCE_DP)
		}
	})

	it('gives each record the same place whatever the input order', () => {
		const forward = fanOutOverlappingRecords(stackOf(4))
		const backward = fanOutOverlappingRecords(stackOf(4).reverse())

		for (const record of forward) {
			const twin = backward.find((item) => item.id === record.id)

			expect(twin?.latitude_camera).toBeCloseTo(record.latitude_camera, 10)
			expect(twin?.longitude_camera).toBeCloseTo(record.longitude_camera, 10)
		}
	})

	it('keeps the input order and every other field of each record', () => {
		const input = stackOf(3)
		const out = fanOutOverlappingRecords(input)

		expect(out.map((record) => record.id)).toEqual([1, 2, 3])
		expect(out[1]).toMatchObject({ author_name: 'Ana Silva', ibis_quantity: 2, user_id: 7 })
	})

	it('does not change the records it was given', () => {
		const input = stackOf(3)

		fanOutOverlappingRecords(input)

		expect(input.every((record) => record.latitude_camera === LAT && record.longitude_camera === LNG)).toBe(true)
	})

	it('treats records just under the spacing as overlapping, but only those', () => {
		const near = makeRecord(2, LAT, LNG + (FAN_OUT_MIN_DISTANCE_DP - 4) * (360 / (256 * 2 ** FAN_OUT_REFERENCE_ZOOM)))
		const base = makeRecord(1, LAT, LNG)
		const apart = makeRecord(3, LAT, LNG + 0.001)

		const [outBase, outNear, outApart] = fanOutOverlappingRecords([base, near, apart])

		expect(dp(outBase, outNear)).toBeGreaterThanOrEqual(FAN_OUT_MIN_DISTANCE_DP)
		expect(outApart).toBe(apart)
	})

	it('returns an empty list for no records', () => {
		expect(fanOutOverlappingRecords([])).toEqual([])
	})
})
