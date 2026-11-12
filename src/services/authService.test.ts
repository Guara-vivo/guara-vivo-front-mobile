import { login, logout, restoreSession } from './authService'
import { getCachedRecordsSnapshot, setCachedRecords } from './recordsCache'
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

const mockNet = { isConnected: true as boolean | null, isInternetReachable: true as boolean | null }
jest.mock('@react-native-community/netinfo', () => ({
	__esModule: true,
	default: { fetch: jest.fn(async () => mockNet) },
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

	it('has no session without a token', async () => {
		mockTokens.access = null
		expect(await restoreSession()).toBeNull()
	})

	it('without cache and without network shows the login but keeps the tokens', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'))

		expect(await restoreSession()).toBeNull()
		expect(mockTokens.access).toBe('a')
		expect(mockTokens.refresh).toBe('r')
	})

	it('opens offline straight from the cache, without calling the API', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()
		fetchMock.mockClear()

		mockNet.isConnected = false
		try {
			expect(await restoreSession()).toEqual(user)
		} finally {
			mockNet.isConnected = true
		}

		expect(fetchMock).not.toHaveBeenCalled()
		expect(mockTokens.access).toBe('a')
	})

	it('keeps the session when the refresh answers 5xx', async () => {
		fetchMock.mockResolvedValueOnce(respond(200, user))
		await restoreSession()

		fetchMock.mockResolvedValueOnce(respond(401)).mockResolvedValueOnce(respond(503))

		expect(await restoreSession()).toEqual(user)
		expect(mockTokens.refresh).toBe('r')
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

describe('login: nova tentativa em falha de rede', () => {
	const loginResponse = { access_token: 'novo-a', refresh_token: 'novo-r', user }

	it('tenta de novo uma vez quando a rede falha e conclui o login', async () => {
		fetchMock
			.mockRejectedValueOnce(new TypeError('Network request failed'))
			.mockResolvedValueOnce(respond(200, loginResponse))

		const result = await login('teste@guaravivo.com', 'senha123')

		expect(result.user).toEqual(user)
		expect(fetchMock).toHaveBeenCalledTimes(2)
		expect(mockTokens.access).toBe('novo-a')
	})

	it('desiste depois da segunda falha de rede', async () => {
		fetchMock
			.mockRejectedValueOnce(new TypeError('Network request failed'))
			.mockRejectedValueOnce(new TypeError('Network request failed'))

		await expect(login('teste@guaravivo.com', 'senha123')).rejects.toBeInstanceOf(TypeError)
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	it('não repete quando a API recusa as credenciais', async () => {
		fetchMock.mockResolvedValueOnce(respond(401))

		await expect(login('teste@guaravivo.com', 'errada')).rejects.toMatchObject({ status: 401 })
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('não repete quando a API responde 5xx', async () => {
		fetchMock.mockResolvedValueOnce(respond(503))

		await expect(login('teste@guaravivo.com', 'senha123')).rejects.toMatchObject({ status: 503 })
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('não repete em timeout: o servidor pode ter recebido o pedido', async () => {
		jest.useFakeTimers()
		try {
			fetchMock.mockImplementation(
				(_url: string, init: RequestInit) =>
					new Promise((_resolve, reject) => {
						init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
					}),
			)

			const pending = login('teste@guaravivo.com', 'senha123')
			const assertion = expect(pending).rejects.toMatchObject({ name: 'TimeoutError' })
			await jest.advanceTimersByTimeAsync(20001)
			await assertion

			expect(fetchMock).toHaveBeenCalledTimes(1)
		} finally {
			jest.useRealTimers()
		}
	})
})

describe('logout', () => {
	it('descarta a lista de registros guardada em memoria', async () => {
		setCachedRecords([{ id: 1 }] as never)
		fetchMock.mockResolvedValueOnce(respond(200))

		await logout()

		expect(getCachedRecordsSnapshot()).toBeUndefined()
	})
})
