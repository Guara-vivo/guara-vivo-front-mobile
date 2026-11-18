import { mergeAdminHistoryRecords } from './adminHistory'
import type { MapZoneRecordRead } from '../types/api'
import type { RecordItem } from '../types/records'

jest.mock('../services/recordsApi', () => ({
	formatBirdBehavior: (behavior: string) => (behavior === 'voando' ? 'Voando' : 'Ninhando'),
	mapRecordSummaryToRecordItem: (record: {
		id: number
		user_id: number
		behavior: string[]
		ibis_quantity: number | null
	}) => ({
		id: record.id,
		user_id: record.user_id,
		ibis_quantity: record.ibis_quantity ?? 0,
		flock_size: record.behavior.join(', '),
		latitude: 0,
		longitude: 0,
		datetime: '2026-11-01T10:00:00.000Z',
		analysis_progress: 100,
		map_zones: [],
	}),
}))

const VIEWER = 1

const own = (id: number): RecordItem => ({
	id,
	user_id: VIEWER,
	ibis_quantity: 1,
	flock_size: 'Voando',
	latitude: 0,
	longitude: 0,
	datetime: '2026-11-01T10:00:00.000Z',
	analysis_progress: 100,
	map_zones: [],
})

const fromAdminList = (id: number, userId: number, author: string) =>
	({
		id,
		user_id: userId,
		behavior: ['voando'],
		ibis_quantity: 2,
		author_name: author,
	}) as unknown as MapZoneRecordRead

describe('admin history', () => {
	it('adds other people’s records, with the author, after the admin’s own', () => {
		const merged = mergeAdminHistoryRecords(
			[own(1)],
			[fromAdminList(2, 7, 'Bob'), fromAdminList(3, 8, 'Carol')],
			VIEWER,
		)

		expect(merged.map((r) => r.id)).toEqual([1, 2, 3])
		expect(merged.find((r) => r.id === 2)?.author_name).toBe('Bob')
		expect(merged.find((r) => r.id === 1)?.author_name).toBeUndefined()
	})

	it('does not repeat the admin’s own records that also come in the admin list', () => {
		const merged = mergeAdminHistoryRecords(
			[own(1)],
			[fromAdminList(1, VIEWER, 'Admin'), fromAdminList(2, 7, 'Bob')],
			VIEWER,
		)

		expect(merged.map((r) => r.id)).toEqual([1, 2])
		expect(merged[0].author_name).toBeUndefined()
	})

	it('returns only the own list when the viewer is not known', () => {
		const merged = mergeAdminHistoryRecords([own(1)], [fromAdminList(2, 7, 'Bob')], null)

		expect(merged.map((r) => r.id)).toEqual([1])
	})

	it('returns only the own list when there is no admin list yet', () => {
		expect(mergeAdminHistoryRecords([own(1)], [], VIEWER).map((r) => r.id)).toEqual([1])
	})
})
