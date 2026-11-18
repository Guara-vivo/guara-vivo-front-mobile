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

const LAT = -24.5
const LNG = -47.8

// Quantos graus de longitude valem `dp` pixels de tela naquele zoom (a longitude é linear na projeção).
function lngForDp(dp: number, zoom: number) {
	return (dp * 360) / (256 * 2 ** zoom)
}

// Dois registros a `dp` pixels de distância na horizontal, a partir de `startDp`.
function pair(dp: number, zoom: number, startDp = 0): MapZoneRecordRead[] {
	return [makeRecord(1, LAT, LNG + lngForDp(startDp, zoom)), makeRecord(2, LAT, LNG + lngForDp(startDp + dp, zoom))]
}

describe('clusterRecords', () => {
	it('keeps a lone record as a record', () => {
		const record = makeRecord(1, LAT, LNG)

		expect(clusterRecords([record], 15)).toEqual([{ kind: 'record', record }])
	})

	it('groups records that are close on screen', () => {
		const items = clusterRecords(pair(50, 15), 15)

		expect(items).toHaveLength(1)
		expect(items[0]).toMatchObject({ kind: 'cluster', count: 2 })
	})

	it('keeps records that are far apart on screen separate', () => {
		const items = clusterRecords(pair(120, 15), 15)

		expect(items.map((item) => item.kind)).toEqual(['record', 'record'])
	})

	it('groups close records wherever they sit (no grid edge effect)', () => {
		const results = Array.from({ length: 30 }, (_, step) => clusterRecords(pair(30, 15, step * 3), 15).length)

		expect(results.every((length) => length === 1)).toBe(true)
	})

	it('keeps grouping close records at high zoom, up to the limit', () => {
		// 15 dp na tela: se sobrepõem. No zoom 19 ainda agrupa; no 20 (limite) mostra um a um.
		expect(clusterRecords(pair(15, 19), 19)).toHaveLength(1)
		expect(clusterRecords(pair(15, 20), 20).map((item) => item.kind)).toEqual(['record', 'record'])
	})

	it('places the cluster at the average position of its records', () => {
		const [cluster] = clusterRecords(pair(40, 15), 15)

		expect(cluster).toMatchObject({
			latitude: expect.closeTo(LAT, 6),
			longitude: expect.closeTo(LNG + lngForDp(20, 15), 6),
		})
	})

	it('never loses or duplicates a record', () => {
		const records = [
			makeRecord(1, LAT, LNG),
			makeRecord(2, LAT, LNG + lngForDp(30, 15)),
			makeRecord(3, LAT, LNG + lngForDp(60, 15)),
			makeRecord(4, LAT, LNG + lngForDp(400, 15)),
			makeRecord(5, LAT, LNG + lngForDp(430, 15)),
		]

		const items = clusterRecords(records, 15)
		const total = items.reduce((sum, item) => sum + (item.kind === 'cluster' ? item.count : 1), 0)
		const ids = items.flatMap((item) => (item.kind === 'cluster' ? item.records.map((r) => r.id) : [item.record.id]))

		expect(total).toBe(5)
		expect([...ids].sort()).toEqual([1, 2, 3, 4, 5])
	})

	it('merges clusters that end up close to each other', () => {
		// 1 e 3 ficam a 90 dp (fora do raio); 2 no meio aproxima os dois grupos e eles se juntam.
		const records = [
			makeRecord(1, LAT, LNG),
			makeRecord(3, LAT, LNG + lngForDp(90, 15)),
			makeRecord(2, LAT, LNG + lngForDp(45, 15)),
		]

		expect(clusterRecords(records, 15)).toHaveLength(1)
	})

	it('gives different clusters different keys', () => {
		const items = clusterRecords(
			[
				makeRecord(1, LAT, LNG),
				makeRecord(2, LAT, LNG + lngForDp(30, 15)),
				makeRecord(3, LAT, LNG + lngForDp(500, 15)),
				makeRecord(4, LAT, LNG + lngForDp(530, 15)),
			],
			15,
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
