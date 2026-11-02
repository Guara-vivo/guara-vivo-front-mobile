import {
	ApiError,
	apiFetch,
	RequestTimeoutError,
	setSessionExpiredHandler,
} from './apiClient'

const mockTokens = { access: 'a' as string | null, refresh: 'r' as string | null }

jest.mock('./tokenStorage', () => ({
	getRefreshToken: jest.fn(async () => mockTokens.refresh),
	saveTokens: jest.fn(async (t: { accessToken: string; refreshToken: string }) => {
		mockTokens.access = t.accessToken
		mockTokens.refresh = t.refreshToken
	}),
	clearTokens: jest.fn(async () => {
		mockTokens.access = null
		mockTokens.refresh = null
	}),
}))

const fetchMock = jest.fn()

function respond(status: number, body: unknown = {}) {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async () => body,
		text: async () => JSON.stringify(body),
	}
}

const authed = { headers: { Authorization: 'Bearer a' } }

beforeEach(() => {
	mockTokens.access = 'a'
	mockTokens.refresh = 'r'
	fetchMock.mockReset()
	global.fetch = fetchMock as unknown as typeof fetch
	setSessionExpiredHandler(null)
})

afterEach(() => {
	jest.useRealTimers()
})

describe('apiFetch', () => {
	it('lanca ApiError quando a resposta nao e ok', async () => {
		fetchMock.mockResolvedValueOnce(respond(422, { detail: 'x' }))

		await expect(apiFetch('/records', authed)).rejects.toBeInstanceOf(ApiError)
	})

	it('avisa que a sessao expirou quando o refresh token e recusado', async () => {
		const onExpired = jest.fn()
		setSessionExpiredHandler(onExpired)
		fetchMock
			.mockResolvedValueOnce(respond(401)) // requisicao original
			.mockResolvedValueOnce(respond(401)) // refresh recusado

		await expect(apiFetch('/records', authed)).rejects.toBeInstanceOf(ApiError)

		expect(onExpired).toHaveBeenCalledTimes(1)
		expect(mockTokens.access).toBeNull()
	})

	it('nao encerra a sessao quando o refresh falha por falta de rede', async () => {
		const onExpired = jest.fn()
		setSessionExpiredHandler(onExpired)
		fetchMock
			.mockResolvedValueOnce(respond(401))
			.mockRejectedValueOnce(new TypeError('Network request failed'))

		await expect(apiFetch('/records', authed)).rejects.toThrow('Network request failed')

		expect(onExpired).not.toHaveBeenCalled()
		expect(mockTokens.refresh).toBe('r')
	})

	it('repete a requisicao com o token renovado', async () => {
		fetchMock
			.mockResolvedValueOnce(respond(401))
			.mockResolvedValueOnce(respond(200, { access_token: 'n', refresh_token: 'm' }))
			.mockResolvedValueOnce(respond(200, { ok: true }))

		const response = await apiFetch('/records', authed)

		expect(response.status).toBe(200)
		expect(mockTokens.access).toBe('n')
	})

	it('desiste de uma requisicao que nao responde', async () => {
		jest.useFakeTimers()
		fetchMock.mockImplementation(
			(_url: string, init: RequestInit) =>
				new Promise((_resolve, reject) => {
					init.signal?.addEventListener('abort', () =>
						reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })),
					)
				}),
		)

		const request = apiFetch('/records', authed)
		const assertion = expect(request).rejects.toBeInstanceOf(RequestTimeoutError)
		await jest.advanceTimersByTimeAsync(20001)

		await assertion
	})

	it('mantem o cancelamento feito pelo chamador como AbortError', async () => {
		const controller = new AbortController()
		fetchMock.mockImplementation(
			(_url: string, init: RequestInit) =>
				new Promise((_resolve, reject) => {
					init.signal?.addEventListener('abort', () =>
						reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })),
					)
				}),
		)

		const request = apiFetch('/records', { ...authed, signal: controller.signal })
		controller.abort()

		await expect(request).rejects.toMatchObject({ name: 'AbortError' })
	})
})
