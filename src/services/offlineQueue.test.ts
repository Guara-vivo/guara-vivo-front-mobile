import { ApiError } from './apiClient'
import {
	UploadLimitError,
	subscribeQueue,
	discardPendingRecord,
	enqueueRecord,
	flushPendingRecords,
	getPendingRecords,
	setQueueOwner,
} from './offlineQueue'
import { uploadRecord } from './recordsApi'

const mockStore = new Map<string, string>()
const mockSizes = new Map<string, number>()

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
		get size() {
			return mockSizes.get(this.uri) ?? 1000
		}
	}
	return { Directory, File, Paths: { document: { uri: 'file:///doc' } } }
})
jest.mock('./recordsApi', () => ({ uploadRecord: jest.fn() }))
jest.mock('./recordsCache', () => ({ invalidateRecordsCache: jest.fn() }))
jest.mock('./apiClient', () => ({
	...jest.requireActual('./apiClient'),
	getFreshAccessToken: jest.fn(async () => 'token'),
}))

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
	mockSizes.clear()
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

	it('flushes again when a record is queued while a flush is running', async () => {
		const first = await enqueueRecord(params)
		let release: (value: unknown) => void = () => {}
		upload.mockImplementationOnce(() => new Promise((resolve) => (release = resolve)))

		const running = flushPendingRecords()
		await new Promise((resolve) => setImmediate(resolve))

		const second = await enqueueRecord(params)
		upload.mockResolvedValue({})
		const waiting = flushPendingRecords()
		release({})

		const [, result] = await Promise.all([running, waiting])
		expect(result.outcomes[first.clientUuid]).toBe('sent')
		expect(result.outcomes[second.clientUuid]).toBe('sent')
		expect(await getPendingRecords(1)).toHaveLength(0)
	})

	it('refuses images over 5 MB or over 10 MB in total, without saving', async () => {
		mockSizes.set('file:///cache/big.jpg', 6 * 1024 * 1024)
		await expect(
			enqueueRecord({ ...params, images: [{ ...params.images[0], uri: 'file:///cache/big.jpg' }] }),
		).rejects.toMatchObject({ kind: 'image' })

		const four = (n: number) =>
			Array.from({ length: n }, (_, i) => {
				mockSizes.set(`file:///cache/${i}.jpg`, 4 * 1024 * 1024)
				return { uri: `file:///cache/${i}.jpg`, name: `${i}.jpg`, type: 'image/jpeg' }
			})
		await expect(enqueueRecord({ ...params, images: four(3) })).rejects.toBeInstanceOf(UploadLimitError)
		expect(await getPendingRecords(1)).toHaveLength(0)
	})

	it('notifies listeners: changed on save and discard, only sent when a record goes out', async () => {
		const events: string[] = []
		const unsubscribe = subscribeQueue((event) => events.push(event))

		const record = await enqueueRecord(params)
		expect(events).toEqual(['changed'])

		upload.mockResolvedValue({})
		await flushPendingRecords()
		expect(events).toEqual(['changed', 'sent'])

		const other = await enqueueRecord(params)
		await discardPendingRecord(other.clientUuid)
		expect(events.slice(2)).toEqual(['changed', 'changed'])
		expect(record.clientUuid).not.toBe(other.clientUuid)

		unsubscribe()
	})
})
