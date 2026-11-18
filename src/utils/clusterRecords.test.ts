import { clusterLabel, clusterRecords, zoomFromLongitudeDelta } from './clusterRecords'
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

// 0,0001 grau de latitude vale cerca de 11 m.
const NEAR = 0.0001
// 0,05 grau vale cerca de 5,5 km.
const FAR = 0.05

describe('clusterRecords', () => {
	it('keeps a lone record as a record', () => {
		const record = makeRecord(1, -24.5, -47.8)

		const items = clusterRecords([record], 14)

		expect(items).toEqual([{ kind: 'record', record }])
	})

	it('groups records that fall in the same cell into one cluster', () => {
		const items = clusterRecords([makeRecord(1, -24.5, -47.8), makeRecord(2, -24.5 + NEAR, -47.8 + NEAR)], 14)

		expect(items).toHaveLength(1)
		expect(items[0]).toMatchObject({ kind: 'cluster', count: 2 })
	})

	it('places the cluster at the average position of its records', () => {
		const items = clusterRecords([makeRecord(1, -24.5, -47.8), makeRecord(2, -24.5 + NEAR, -47.8 + NEAR)], 14)

		expect(items[0]).toMatchObject({
			latitude: expect.closeTo(-24.5 + NEAR / 2, 6),
			longitude: expect.closeTo(-47.8 + NEAR / 2, 6),
		})
	})

	it('keeps records that are far apart separate', () => {
		const items = clusterRecords([makeRecord(1, -24.5, -47.8), makeRecord(2, -24.5 + FAR, -47.8)], 14)

		expect(items.map((item) => item.kind)).toEqual(['record', 'record'])
	})

	it('does not group anything when zoomed in past the clustering limit', () => {
		const items = clusterRecords([makeRecord(1, -24.5, -47.8), makeRecord(2, -24.5 + NEAR, -47.8 + NEAR)], 18)

		expect(items.map((item) => item.kind)).toEqual(['record', 'record'])
	})

	it('never loses or duplicates a record', () => {
		const records = [
			makeRecord(1, -24.5, -47.8),
			makeRecord(2, -24.5 + NEAR, -47.8),
			makeRecord(3, -24.5 + NEAR, -47.8 + NEAR),
			makeRecord(4, -24.5 + FAR, -47.8),
		]

		const items = clusterRecords(records, 14)
		const total = items.reduce((sum, item) => sum + (item.kind === 'cluster' ? item.count : 1), 0)
		const ids = items.flatMap((item) => (item.kind === 'cluster' ? item.records.map((r) => r.id) : [item.record.id]))

		expect(total).toBe(4)
		expect([...ids].sort()).toEqual([1, 2, 3, 4])
	})

	it('gives different clusters different keys', () => {
		const items = clusterRecords(
			[
				makeRecord(1, -24.5, -47.8),
				makeRecord(2, -24.5 + NEAR, -47.8),
				makeRecord(3, -24.5 + FAR, -47.8),
				makeRecord(4, -24.5 + FAR + NEAR, -47.8),
			],
			14,
		)
		const keys = items.map((item) => (item.kind === 'cluster' ? item.key : `record-${item.record.id}`))

		expect(items).toHaveLength(2)
		expect(new Set(keys).size).toBe(2)
	})
})

describe('zoomFromLongitudeDelta', () => {
	it('converts the visible longitude span to a zoom level', () => {
		// Tela de 360 dp: o mundo todo (360°) cabe em 256 dp no zoom 0.
		expect(zoomFromLongitudeDelta((360 * 360) / (256 * 2 ** 10), 360)).toBeCloseTo(10, 5)
	})
})

describe('clusterLabel', () => {
	it('shows the exact count up to 9', () => {
		expect([2, 5, 9].map(clusterLabel)).toEqual(['2', '5', '9'])
	})

	it('rounds larger counts down to a bucket with a plus sign', () => {
		expect([10, 19, 20, 49, 50, 99, 100, 640].map(clusterLabel)).toEqual([
			'10+',
			'10+',
			'20+',
			'20+',
			'50+',
			'50+',
			'100+',
			'100+',
		])
	})
})
