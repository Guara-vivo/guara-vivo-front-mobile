import { createMapZone, getMapZones } from './mapZonesApi'
import { apiFetch } from './apiClient'

jest.mock('./apiClient', () => ({
	apiFetch: jest.fn(),
}))

jest.mock('./tokenStorage', () => ({
	getAccessToken: jest.fn(async () => 'access-token'),
}))

const mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>

function mockJsonResponse(data: unknown) {
	mockedApiFetch.mockResolvedValue({
		ok: true,
		json: jest.fn(async () => data),
	} as unknown as Response)
}

describe('mapZonesApi', () => {
	beforeEach(() => {
		mockedApiFetch.mockReset()
	})

	it('fetches map zones using trailing slash to avoid redirects', async () => {
		mockJsonResponse([])

		await getMapZones()

		expect(mockedApiFetch).toHaveBeenCalledWith('/map-zones/', expect.any(Object))
	})

	it('creates map zones using trailing slash to avoid redirects', async () => {
		mockJsonResponse({ id: 1 })

		await createMapZone('feeding', -23.1, -45.1, 100)

		expect(mockedApiFetch).toHaveBeenCalledWith('/map-zones/', expect.any(Object))
	})
})
