import { createMapZone, getMapZones } from './mapZonesApi'
import { apiFetch, apiGetJson } from './apiClient'

jest.mock('./apiClient', () => ({
	apiFetch: jest.fn(),
	apiGetJson: jest.fn(),
}))

jest.mock('./tokenStorage', () => ({
	getAccessToken: jest.fn(async () => 'access-token'),
}))

const mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>
const mockedApiGetJson = apiGetJson as jest.MockedFunction<typeof apiGetJson>

function mockJsonResponse(data: unknown) {
	mockedApiFetch.mockResolvedValue({
		ok: true,
		json: jest.fn(async () => data),
	} as unknown as Response)
}

describe('mapZonesApi', () => {
	beforeEach(() => {
		mockedApiFetch.mockReset()
		mockedApiGetJson.mockReset()
	})

	it('fetches map zones using trailing slash to avoid redirects', async () => {
		mockedApiGetJson.mockResolvedValue([])

		await getMapZones()

		expect(mockedApiGetJson).toHaveBeenCalledWith('/map-zones/', expect.any(Object))
	})

	it('creates map zones using trailing slash to avoid redirects', async () => {
		mockJsonResponse({ id: 1 })

		await createMapZone('feeding', -23.1, -45.1, 100)

		expect(mockedApiFetch).toHaveBeenCalledWith('/map-zones/', expect.any(Object))
	})
})
