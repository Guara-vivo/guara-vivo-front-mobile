import { Platform } from 'react-native'
import {
	clearTokens,
	getRefreshToken,
	saveTokens,
} from './tokenStorage'
import type { LoginResponse } from '../types/api'

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

async function refreshAccessToken() {
	const refreshToken = await getRefreshToken()

	if (!refreshToken) {
		throw new Error('Missing refresh token')
	}

	if (!refreshRequest) {
		refreshRequest = fetchWithTimeout(`${API_URL}/users/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new RefreshRejectedError(`Token refresh failed: ${response.status}`)
				}

				return response.json() as Promise<LoginResponse>
			})
			.then(async (result) => {
				await saveTokens({
					accessToken: result.access_token,
					refreshToken: result.refresh_token,
				})
				return result
			})
			.finally(() => {
				refreshRequest = null
			})
	}

	return refreshRequest
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	let response = await fetchWithTimeout(`${API_URL}${path}`, options)

	if (response.status === 401 && hasAuthorizationHeader(options.headers)) {
		try {
			const refreshed = await refreshAccessToken()
			response = await fetchWithTimeout(
				`${API_URL}${path}`,
				withAuthorizationHeader(options, refreshed.access_token),
			)
		} catch (error) {
			// Sem rede durante o refresh nao e sessao invalida: mantem os tokens.
			if (!(error instanceof RefreshRejectedError)) {
				throw error
			}
			await clearTokens()
			sessionExpiredHandler?.()
		}
	}

	if (!response.ok) {
		const body = await response.text()
		throw new ApiError(response.status, body)
	}

	return response
}
