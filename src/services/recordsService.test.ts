import { fetchRecords } from './recordsService'
import { invalidateRecordsCache } from './recordsCache'
import { getRecordSummaries } from './recordsApi'

jest.mock('./authService', () => ({ getToken: jest.fn(async () => 'token') }))
jest.mock('./recordsStore', () => ({ savePersistedRecords: jest.fn() }))
jest.mock('./recordsApi', () => ({
	getRecordSummaries: jest.fn(),
	getRecordDetail: jest.fn(),
	mapRecordSummaryToRecordItem: (record: { id: number }) => ({ id: record.id }),
	mapRecordDetailToRecordItem: jest.fn(),
}))

const getSummaries = getRecordSummaries as jest.Mock

function page(start: number, size: number) {
	return Array.from({ length: size }, (_, i) => ({ id: start + i }))
}

beforeEach(() => {
	invalidateRecordsCache()
	getSummaries.mockReset()
})

describe('fetchRecords', () => {
	it('busca todas as paginas, nao so os 100 primeiros', async () => {
		getSummaries
			.mockResolvedValueOnce(page(0, 100))
			.mockResolvedValueOnce(page(100, 100))
			.mockResolvedValueOnce(page(200, 30))

		const items = await fetchRecords({ force: true })

		expect(items).toHaveLength(230)
		expect(getSummaries.mock.calls.map((call) => call[1])).toEqual([0, 100, 200])
	})

	it('cancelar uma chamada nao derruba a requisicao das outras', async () => {
		let resolveRequest: (value: unknown) => void = () => {}
		getSummaries.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveRequest = resolve
			}),
		)

		const controller = new AbortController()
		const first = fetchRecords({ force: true }, controller.signal)
		const second = fetchRecords({ force: true })

		controller.abort()
		resolveRequest(page(0, 3))

		await expect(first).rejects.toMatchObject({ name: 'AbortError' })
		await expect(second).resolves.toHaveLength(3)
		expect(getSummaries).toHaveBeenCalledTimes(1)
	})
})
