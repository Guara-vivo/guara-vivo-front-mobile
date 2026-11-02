import {
	clearPersistedRecords,
	loadPersistedRecords,
	savePersistedRecords,
	setRecordsStoreOwner,
} from './recordsStore'
import type { RecordItem } from '../types/records'

const mockAsync = new Map<string, string>()

jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		getItem: jest.fn(async (key: string) => mockAsync.get(key) ?? null),
		setItem: jest.fn(async (key: string, value: string) => {
			mockAsync.set(key, value)
		}),
		removeItem: jest.fn(async (key: string) => {
			mockAsync.delete(key)
		}),
	},
}))

const record = (id: number): RecordItem => ({
	id,
	ibis_quantity: 0,
	flock_size: 'Voando',
	latitude: 0,
	longitude: 0,
	datetime: '2026-11-02T03:30:00.000Z',
	analysis_progress: 0,
	map_zones: [],
	client_uuid: `uuid-${id}`,
})

beforeEach(() => {
	mockAsync.clear()
	setRecordsStoreOwner(2)
})

describe('recordsStore', () => {
	it('saves the list and loads it back with its date', async () => {
		const before = Date.now()
		await savePersistedRecords([record(1), record(2)])

		const loaded = await loadPersistedRecords()

		expect(loaded?.records.map((r) => r.id)).toEqual([1, 2])
		expect(loaded?.savedAt).toBeGreaterThanOrEqual(before)
	})

	it('does not save or load without an active user', async () => {
		setRecordsStoreOwner(null)
		await savePersistedRecords([record(1)])
		expect(mockAsync.size).toBe(0)

		setRecordsStoreOwner(2)
		await savePersistedRecords([record(1)])
		setRecordsStoreOwner(null)
		expect(await loadPersistedRecords()).toBeNull()
	})

	it('never shows another user the list saved for someone else', async () => {
		await savePersistedRecords([record(1)])

		setRecordsStoreOwner(3)

		expect(await loadPersistedRecords()).toBeNull()
	})

	it('ignores corrupted data', async () => {
		mockAsync.set('guara_vivo_records_list', '{not json')
		expect(await loadPersistedRecords()).toBeNull()

		mockAsync.set(
			'guara_vivo_records_list',
			JSON.stringify({ userId: 2, savedAt: 1, records: [{ nope: true }] }),
		)
		expect(await loadPersistedRecords()).toBeNull()
	})

	it('clears the saved list', async () => {
		await savePersistedRecords([record(1)])
		await clearPersistedRecords()

		expect(await loadPersistedRecords()).toBeNull()
	})

	it('does not rewrite the list of someone who logged out while a save was in flight', async () => {
		const saving = savePersistedRecords([record(1)])
		const clearing = clearPersistedRecords()
		await Promise.all([saving, clearing])

		setRecordsStoreOwner(2)
		expect(await loadPersistedRecords()).toBeNull()
		expect(mockAsync.size).toBe(0)
	})

	it('ignores a save requested after the owner was cleared', async () => {
		await clearPersistedRecords()
		await savePersistedRecords([record(1)])

		expect(mockAsync.size).toBe(0)
	})

	it('drops a copy saved by another version of the app', async () => {
		mockAsync.set(
			'guara_vivo_records_list',
			JSON.stringify({ version: 0, userId: 2, savedAt: 1, records: [record(1)] }),
		)

		expect(await loadPersistedRecords()).toBeNull()
	})
})
