import { mergeHistoryRecords, pendingToRecordItem, recordKey } from './pendingRecords'
import type { PendingRecord } from '../services/offlineQueue'
import type { RecordItem } from '../types/records'

jest.mock('../services/recordsApi', () => ({
	formatBirdBehavior: (behavior: string) => (behavior === 'voando' ? 'Voando' : 'Ninhando'),
}))
jest.mock('../services/offlineQueue', () => ({}))

const pending = (clientUuid: string, status: PendingRecord['status'] = 'pending'): PendingRecord => ({
	clientUuid,
	userId: 2,
	latitude: -24.5,
	longitude: -47.8,
	behavior: ['voando', 'ninhando'],
	dateTime: '2026-11-02T03:30:00.000Z',
	images: [{ uri: 'file:///doc/a.jpg', name: 'a.jpg', type: 'image/jpeg' }],
	status,
	attempts: 0,
	lastError: status === 'failed' ? '422: invalid' : null,
	createdAt: '2026-11-02T03:30:00.000Z',
})

const server = (id: number, client_uuid: string | null): RecordItem => ({
	id,
	ibis_quantity: 1,
	flock_size: 'Voando',
	latitude: 0,
	longitude: 0,
	datetime: '2026-11-01T10:00:00.000Z',
	analysis_progress: 100,
	map_zones: [],
	client_uuid,
})

describe('pending records in history', () => {
	it('shows a pending record with labels and its sync state', () => {
		const item = pendingToRecordItem(pending('u1', 'failed'))

		expect(item.flock_size).toBe('Voando, Ninhando')
		expect(item.sync_state).toBe('failed')
		expect(item.sync_error).toBe('422: invalid')
		expect(recordKey(item)).toBe('u1')
	})

	it('puts pending records before the server ones', () => {
		const merged = mergeHistoryRecords([server(1, null)], [pending('u1')])

		expect(merged.map((r) => r.client_uuid ?? r.id)).toEqual(['u1', 1])
	})

	it('drops the pending copy once the API already has that client_uuid', () => {
		const merged = mergeHistoryRecords([server(7, 'u1')], [pending('u1'), pending('u2')])

		expect(merged).toHaveLength(2)
		expect(merged.find((r) => r.client_uuid === 'u1')?.sync_state).toBeUndefined()
		expect(merged.find((r) => r.client_uuid === 'u2')?.sync_state).toBe('pending')
	})

	it('keys server records by id', () => {
		expect(recordKey(server(7, 'u1'))).toBe('7')
	})
})
