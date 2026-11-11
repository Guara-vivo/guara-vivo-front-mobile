import { Platform } from 'react-native'
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveTokens,
} from './tokenStorage'
import type { LoginResponse } from '../types/api'
import { isAccessTokenFresh } from '../utils/tokenExpiry'

const DEV_API_URL = Platform.select({
	android: 'http://192.168.18.145:8001',
	ios: 'http://localhost:8001',
	default: 'http://localhost:8001',
})

export const API_URL = __DEV__
	? (process.env.EXPO_PUBLIC_API_URL?.trim() || DEV_API_URL)
	: (process.env.EXPO_PUBLIC_API_URL?.trim() || '')

// Validate HTTPS in production
if (!__DEV__ && (!API_URL || API_URL.startsWith('http://'))) {
	throw new Error(
		'API_URL must be set and use HTTPS in production. ' +
			'Set EXPO_PUBLIC_API_URL environment variable with an HTTPS URL.',
	)
}

export class ApiError extends Error {
	status: number
	body: string

	constructor(status: number, body: string) {
		super(`${status}: ${body}`)
		this.status = status
		this.body = body
	}
}

// O servidor respondeu e recusou o refresh token (diferente de falta de rede).
class RefreshRejectedError extends Error {}

export class RequestTimeoutError extends Error {
	constructor() {
		super('Request timeout')
		this.name = 'TimeoutError'
	}
}

// Sem prazo, uma rede ruim deixa telas girando e a fila offline presa para sempre.
const REQUEST_TIMEOUT_MS = 20000
const UPLOAD_TIMEOUT_MS = 120000

// Avisa o app quando o servidor recusa o refresh token: a sessao acabou e o usuario
// precisa voltar para o login.
let sessionExpiredHandler: (() => void) | null = null

export function setSessionExpiredHandler(handler: (() => void) | null) {
	sessionExpiredHandler = handler
}

async function fetchWithTimeout(url: string, options: RequestInit) {
	const controller = new AbortController()
	const callerSignal = options.signal
	let timedOut = false

	const onCallerAbort = () => controller.abort()
	if (callerSignal) {
		if (callerSignal.aborted) {
			controller.abort()
		} else {
			callerSignal.addEventListener('abort', onCallerAbort)
		}
	}

	const timeoutMs = options.body instanceof FormData ? UPLOAD_TIMEOUT_MS : REQUEST_TIMEOUT_MS
	const timer = setTimeout(() => {
		timedOut = true
		controller.abort()
	}, timeoutMs)

	try {
		return await fetch(url, { ...options, signal: controller.signal })
	} catch (error) {
		if (timedOut) {
			throw new RequestTimeoutError()
		}
		throw error
	} finally {
		clearTimeout(timer)
		callerSignal?.removeEventListener('abort', onCallerAbort)
	}
}

// Uma renovacao por vez: o refresh token e de uso unico (rotacao), entao duas chamadas
// concorrentes com o mesmo token fariam a segunda levar 401 e derrubar a sessao.
let refreshRequest: Promise<LoginResponse> | null = null

function hasAuthorizationHeader(headers: HeadersInit | undefined) {
	if (!headers) {
		return false
	}

	if (headers instanceof Headers) {
		return Boolean(headers.get('Authorization'))
	}

	if (Array.isArray(headers)) {
		return headers.some(([key]) => key.toLowerCase() === 'authorization')
	}

	return Object.keys(headers).some((key) => key.toLowerCase() === 'authorization')
}

function withAuthorizationHeader(
	options: RequestInit,
	accessToken: string,
): RequestInit {
	const headers = new Headers(options.headers)
	headers.set('Authorization', `Bearer ${accessToken}`)

	return {
		...options,
		headers,
	}
}

async function requestTokenRefresh(): Promise<LoginResponse> {
	// Le o token dentro da vez da fila: quem chega depois ja enxerga o token rotacionado.
	const refreshToken = await getRefreshToken()

	if (!refreshToken) {
		throw new Error('Missing refresh token')
	}

	const response = await fetchWithTimeout(`${API_URL}/users/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refresh_token: refreshToken }),
	})

	if (response.status === 401) {
		throw new RefreshRejectedError('Token refresh rejected')
	}

	// 5xx, 429 etc.: o servidor nao disse que a sessao acabou, so que nao deu agora.
	if (!response.ok) {
		throw new ApiError(response.status, await response.text())
	}

	const result = (await response.json()) as LoginResponse

	// O refresh token antigo ja foi consumido: grava o novo antes de qualquer outra coisa.
	await saveTokens({
		accessToken: result.access_token,
		refreshToken: result.refresh_token,
	})

	return result
}

// So um 401 do POST /users/refresh encerra a sessao (tokens apagados e app volta ao login).
// Rede, timeout e 5xx sobem como erro comum e mantem os tokens.
export function refreshAccessToken() {
	if (!refreshRequest) {
		refreshRequest = requestTokenRefresh()
			.catch(async (error) => {
				if (error instanceof RefreshRejectedError) {
					await clearTokens()
					sessionExpiredHandler?.()
				}
				throw error
			})
			.finally(() => {
				refreshRequest = null
			})
	}

	return refreshRequest
}

function bearerToken(headers: HeadersInit | undefined) {
	const value = new Headers(headers).get('Authorization')
	return value?.replace(/^Bearer\s+/i, '') ?? null
}

// Access token pronto para uso. Renova antes se estiver vencido ou perto disso, para que
// um envio grande (fila offline) nao va com token vencido e volte 401. Sem rede o erro
// sobe e a sessao fica intacta; devolve null so quando a sessao acabou (refresh recusado)
// ou nao ha token.
export async function getFreshAccessToken(): Promise<string | null> {
	const token = await getAccessToken()

	if (token && isAccessTokenFresh(token, Date.now())) {
		return token
	}

	if (!(await getRefreshToken())) {
		return token
	}

	try {
		return (await refreshAccessToken()).access_token
	} catch (error) {
		if (error instanceof RefreshRejectedError) {
			return null
		}
		throw error
	}
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	let response = await fetchWithTimeout(`${API_URL}${path}`, options)

	if (response.status === 401 && hasAuthorizationHeader(options.headers)) {
		try {
			// Outra requisicao pode ja ter renovado enquanto esta estava no ar: o refresh
			// token antigo nao vale mais, entao so repete com o token novo, sem renovar.
			const current = await getAccessToken()
			const usedToken = bearerToken(options.headers)
			const accessToken =
				current && current !== usedToken
					? current
					: (await refreshAccessToken()).access_token

			response = await fetchWithTimeout(
				`${API_URL}${path}`,
				withAuthorizationHeader(options, accessToken),
			)
		} catch (error) {
			// Refresh recusado: a sessao ja foi encerrada em refreshAccessToken; devolve o
			// 401 original. Qualquer outra falha (rede, 5xx) mantem a sessao e sobe.
			if (!(error instanceof RefreshRejectedError)) {
				throw error
			}
		}
	}

	if (!response.ok) {
		const body = await response.text()
		throw new ApiError(response.status, body)
	}

	return response
}

const GET_RETRY_DELAY_MS = 400

// Falhas que valem uma nova tentativa: o servidor nao respondeu de forma conclusiva
// (rede caiu, corpo da resposta invalido no RN/Android). Erros da API, cancelamento
// e timeout nao se repetem.
function isRetryableNetworkError(error: unknown) {
	if (error instanceof ApiError || error instanceof RequestTimeoutError) {
		return false
	}
	if (error instanceof Error && error.name === 'AbortError') {
		return false
	}
	return true
}

// GET que le o corpo JSON dentro da mesma tentativa, para que uma falha ao ler o corpo
// tambem seja repetida uma vez (apiFetch devolve a resposta antes de o corpo ser lido).
export async function apiGetJson<T>(path: string, options: RequestInit = {}): Promise<T> {
	const request = async () => {
		const response = await apiFetch(path, { ...options, method: 'GET' })
		return (await response.json()) as T
	}

	try {
		return await request()
	} catch (error) {
		if (!isRetryableNetworkError(error) || options.signal?.aborted) {
			throw error
		}
		await new Promise((resolve) => setTimeout(resolve, GET_RETRY_DELAY_MS))
		if (options.signal?.aborted) {
			throw error
		}
		return request()
	}
}
