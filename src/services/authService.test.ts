import { login, logout, restoreSession } from './authService'
import {
	loadPersistedRecords,
	savePersistedRecords,
	setRecordsStoreOwner,
} from './recordsStore'

const mockAsync = new Map<string, string>()
const mockTokens = { access: 'a' as string | null, refresh: 'r' as string | null }

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
jest.mock('./tokenStorage', () => ({
	getAccessToken: jest.fn(async () => mockTokens.access),
	getRefreshToken: jest.fn(async () => mockTokens.refresh),
	saveAccessToken: jest.fn(),
	saveTokens: jest.fn(async (t: { accessToken: string; refreshToken: string }) => {
		mockTokens.access = t.accessToken
		mockTokens.refresh = t.refreshToken
	}),
	clearTokens: jest.fn(async () => {
		mockTokens.access = null
		mockTokens.refresh = null
	}),
}))

const user = { id: 2, name: 'Teste', email: 'teste@guaravivo.com' }
const fetchMock = jest.fn()

function respond(status: number, body: unknown = {}) {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async () => body,
		text: async () => JSON.stringify(body),
	}
}

beforeEach(() => {
	mockAsync.clear()
	mockTokens.access = 'a'
	mockTokens.refresh = 'r'
	fetchMock.mockReset()
	global.fetch = fetchMock as unknown as typeof fetch
})

describe('restoreSession', () => {
	it('returns the user from the API and caches it', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))

		expect(await restoreSession()).toEqual(user)
		expect(mockAsync.size).toBe(1)
	})

	it('opens with the cached user when the network is down, keeping the tokens', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()

		fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'))

		expect(await restoreSession()).toEqual(user)
		expect(mockTokens.access).toBe('a')
	})

	it('opens with the cached user when the API answers 5xx', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()

		fetchMock.mockResolvedValueOnce(respond(503))

		expect(await restoreSession()).toEqual(user)
		expect(mockTokens.access).toBe('a')
	})

	it('ends the session when the server rejects the token and the refresh', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()

		fetchMock.mockResolvedValueOnce(respond(401)).mockResolvedValueOnce(respond(401))

		expect(await restoreSession()).toBeNull()
		expect(mockTokens.access).toBeNull()
		expect(mockAsync.size).toBe(0)
	})

	it('keeps the session when the network drops during the token refresh', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()

		fetchMock
			.mockResolvedValueOnce(respond(401))
			.mockRejectedValueOnce(new TypeError('Network request failed'))

		expect(await restoreSession()).toEqual(user)
		expect(mockTokens.access).toBe('a')
	})

	it('has no session without a token, and without cache it ends on a network error', async () => {
		mockTokens.access = null
		expect(await restoreSession()).toBeNull()

		mockTokens.access = 'a'
		fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'))
		expect(await restoreSession()).toBeNull()
		expect(mockTokens.access).toBeNull()
	})
})

describe('login / logout', () => {
	it('caches the user at login and clears it at logout', async () => {
		fetchMock.mockResolvedValueOnce(
			respond(200, { access_token: 'x', refresh_token: 'y', token_type: 'bearer', user }),
		)
		await login('teste@guaravivo.com', 'senha')
		expect(mockAsync.size).toBe(1)

		fetchMock.mockResolvedValueOnce(respond(200))
		await logout()
		expect(mockAsync.size).toBe(0)
		expect(mockTokens.access).toBeNull()
	})

	it('also drops the saved records list at logout and when the session is rejected', async () => {
		setRecordsStoreOwner(2)
		await savePersistedRecords([])
		expect(await loadPersistedRecords()).not.toBeNull()

		fetchMock.mockResolvedValueOnce(respond(200))
		await logout()
		expect(await loadPersistedRecords()).toBeNull()

		await savePersistedRecords([])
		mockTokens.access = 'a'
		mockTokens.refresh = 'r'
		fetchMock.mockResolvedValueOnce(respond(401)).mockResolvedValueOnce(respond(401))
		await restoreSession()
		expect(await loadPersistedRecords()).toBeNull()
	})
})
