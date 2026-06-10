import { getVisibleMapZoneRecords } from './mapZoneRecords'
import type { MapZoneRecordRead } from '../types/api'

function makeRecord(
	id: number,
	date_time: string,
	ibis_quantity: number | null,
	status: MapZoneRecordRead['status'] = 'completed',
): MapZoneRecordRead {
	return {
		id,
		images: ['https://example.com/a.jpg'],
		latitude_camera: -23.1,
		longitude_camera: -45.1,
		behavior: ['voando'],
		date_time,
		user_id: 1,
		status,
		analysis_progress: 100,
		map_zones: [{ id: 7, type: 'feeding', name: 'Alimentação A' }],
		analysis_id: id,
		ibis_quantity,
		author_name: 'Ana Silva',
	}
}

describe('getVisibleMapZoneRecords', () => {
	it('keeps only records with identified guaras', () => {
		const records = [
			makeRecord(1, '2026-06-04T10:00:00Z', 0),
			makeRecord(2, '2026-06-04T11:00:00Z', null),
			makeRecord(3, '2026-06-04T12:00:00Z', 2),
		]

		expect(getVisibleMapZoneRecords(records).map((record) => record.id)).toEqual([3])
	})

	it('hides failed records even when they have a stale guara count', () => {
		const records = [
			makeRecord(1, '2026-06-04T10:00:00Z', 3, 'failed'),
			makeRecord(2, '2026-06-04T11:00:00Z', 2),
		]

		expect(getVisibleMapZoneRecords(records).map((record) => record.id)).toEqual([2])
	})

	it('returns the newest 10 records with identified guaras', () => {
		const records = Array.from({ length: 12 }, (_, index) =>
			makeRecord(index + 1, `2026-06-${String(index + 1).padStart(2, '0')}T12:00:00Z`, 1),
		)

		expect(getVisibleMapZoneRecords(records).map((record) => record.id)).toEqual([
			12,
			11,
			10,
			9,
			8,
			7,
			6,
			5,
			4,
			3,
		])
	})
})
