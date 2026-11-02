import { ApiError } from './apiClient'
import {
	discardPendingRecord,
	enqueueRecord,
	flushPendingRecords,
	getPendingRecords,
	setQueueOwner,
} from './offlineQueue'
import { uploadRecord } from './recordsApi'

const mockStore = new Map<string, string>()

jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
		setItem: jest.fn(async (key: string, value: string) => {
			mockStore.set(key, value)
		}),
	},
}))
jest.mock('expo-crypto', () => {
	let n = 0
	return { randomUUID: () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}` }
})
jest.mock('expo-file-system', () => {
	class Directory {
		uri: string
		exists = true
		constructor(...parts: unknown[]) {
			this.uri = parts.map((p) => (typeof p === 'string' ? p : (p as { uri: string }).uri)).join('/')
		}
		create() {}
		delete() {}
	}
	class File {
		uri: string
		constructor(...parts: unknown[]) {
			this.uri = parts.map((p) => (typeof p === 'string' ? p : (p as { uri: string }).uri)).join('/')
		}
		copy() {}
	}
	return { Directory, File, Paths: { document: { uri: 'file:///doc' } } }
})
jest.mock('./recordsApi', () => ({ uploadRecord: jest.fn() }))
jest.mock('./recordsCache', () => ({ invalidateRecordsCache: jest.fn() }))
jest.mock('./tokenStorage', () => ({ getAccessToken: jest.fn(async () => 'token') }))

const upload = uploadRecord as jest.Mock

const params = {
	latitude: -23.1,
	longitude: -45.1,
	behavior: ['voando' as const],
	dateTime: new Date('2026-06-04T10:00:00Z'),
	images: [{ uri: 'file:///cache/a.jpg', name: 'a.jpg', type: 'image/jpeg' }],
}

beforeEach(() => {
	mockStore.clear()
	upload.mockReset()
	setQueueOwner(1)
})

describe('offlineQueue', () => {
	it('persists the record with its own client uuid and copied images', async () => {
		const record = await enqueueRecord(params)

		expect(record.clientUuid).toMatch(/^[0-9a-f-]{36}$/)
		expect(record.images[0].uri).toContain(record.clientUuid)
		expect(await getPendingRecords(1)).toHaveLength(1)
	})

	it('sends with the client uuid and removes the record on success', async () => {
		const record = await enqueueRecord(params)
		upload.mockResolvedValue({})

		const result = await flushPendingRecords()

		expect(upload).toHaveBeenCalledWith(
			expect.objectContaining({ clientUuid: record.clientUuid }),
		)
		expect(result.outcomes[record.clientUuid]).toBe('sent')
		expect(await getPendingRecords(1)).toHaveLength(0)
	})

	it('keeps the record and stops on network errors, then resends with the same uuid', async () => {
		const record = await enqueueRecord(params)
		upload.mockRejectedValueOnce(new TypeError('Network request failed'))

		const first = await flushPendingRecords()
		expect(first.stopped).toBe(true)
		expect(first.outcomes[record.clientUuid]).toBe('retry')
		expect((await getPendingRecords(1))[0].attempts).toBe(1)

		upload.mockResolvedValue({})
		await flushPendingRecords()
		expect(upload).toHaveBeenLastCalledWith(
			expect.objectContaining({ clientUuid: record.clientUuid }),
		)
		expect(await getPendingRecords(1)).toHaveLength(0)
	})

	it('retries on 5xx and 401', async () => {
		await enqueueRecord(params)
		upload.mockRejectedValueOnce(new ApiError(503, 'down'))
		expect((await flushPendingRecords()).stopped).toBe(true)
		upload.mockRejectedValueOnce(new ApiError(401, 'expired'))
		expect((await flushPendingRecords()).stopped).toBe(true)
		expect((await getPendingRecords(1))[0].status).toBe('pending')
	})

	it('marks a 422 as failed, keeps going and does not resend it', async () => {
		const bad = await enqueueRecord(params)
		const good = await enqueueRecord(params)
		upload.mockRejectedValueOnce(new ApiError(422, 'invalid')).mockResolvedValueOnce({})

		const result = await flushPendingRecords()

		expect(result.outcomes[bad.clientUuid]).toBe('rejected')
		expect(result.outcomes[good.clientUuid]).toBe('sent')
		expect((await getPendingRecords(1))[0].status).toBe('failed')

		upload.mockClear()
		await flushPendingRecords()
		expect(upload).not.toHaveBeenCalled()
	})

	it('only sends the active user records', async () => {
		await enqueueRecord(params)
		setQueueOwner(2)
		upload.mockResolvedValue({})

		await flushPendingRecords()

		expect(upload).not.toHaveBeenCalled()
		expect(await getPendingRecords(1)).toHaveLength(1)
	})

	it('shares one run between simultaneous flushes', async () => {
		await enqueueRecord(params)
		upload.mockResolvedValue({})

		await Promise.all([flushPendingRecords(), flushPendingRecords()])

		expect(upload).toHaveBeenCalledTimes(1)
	})

	it('discards a record', async () => {
		const record = await enqueueRecord(params)
		await discardPendingRecord(record.clientUuid)
		expect(await getPendingRecords(1)).toHaveLength(0)
	})
})
