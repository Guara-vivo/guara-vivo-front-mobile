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

// API rodando em modo offline (OFFLINE_MODE=true no backend): sem WebSocket de
// progresso de análise e com imagens servidas em /local-storage (URL relativa).
export const IS_OFFLINE_API = process.env.EXPO_PUBLIC_OFFLINE_MODE?.trim() === 'true'

// Imagens da API offline vêm como "/local-storage/..."; prefixa com a URL da API.
export function resolveMediaUrl(url: string) {
	return url.startsWith('/') && !url.startsWith('//') ? `${API_URL}${url}` : url
}

// Validate HTTPS in production (a API offline roda na rede local, via HTTP)
if (
	!__DEV__ &&
	!IS_OFFLINE_API &&
	(!API_URL || API_URL.startsWith('http://'))
) {
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
		refreshRequest = fetch(`${API_URL}/users/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(`Token refresh failed: ${response.status}`)
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

type ApiFetchOptions = RequestInit & {
	// Nao tenta renovar o token em 401 (ex.: 401 de credenciais de outro servidor).
	skipAuthRefresh?: boolean
}

export async function apiFetch(path: string, init: ApiFetchOptions = {}) {
	const { skipAuthRefresh, ...options } = init
	let response = await fetch(`${API_URL}${path}`, options)

	if (
		response.status === 401 &&
		!skipAuthRefresh &&
		hasAuthorizationHeader(options.headers)
	) {
		try {
			const refreshed = await refreshAccessToken()
			response = await fetch(
				`${API_URL}${path}`,
				withAuthorizationHeader(options, refreshed.access_token),
			)
		} catch {
			await clearTokens()
		}
	}

	if (!response.ok) {
		const body = await response.text()
		throw new ApiError(response.status, body)
	}

	return response
}
