import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiError, apiFetch } from './apiClient'
import { clearPersistedRecords } from './recordsStore'
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveAccessToken,
	saveTokens,
} from './tokenStorage'
import type { LoginResponse, UserRead } from '../types/api'

// Ultimo usuario autenticado: permite abrir o app sem rede (modo offline).
const USER_CACHE_KEY = 'guara_vivo_cached_user'

async function cacheUser(user: UserRead) {
	try {
		await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
	} catch {
		// Sem cache o app so perde a abertura offline.
	}
}

async function readCachedUser(): Promise<UserRead | null> {
	try {
		const raw = await AsyncStorage.getItem(USER_CACHE_KEY)
		const user = raw ? (JSON.parse(raw) as Partial<UserRead>) : null
		return user && typeof user.id === 'number' ? (user as UserRead) : null
	} catch {
		return null
	}
}

// Dados do usuario guardados no aparelho: o cache do usuario e a ultima lista de registros.
async function clearCachedUser() {
	await AsyncStorage.removeItem(USER_CACHE_KEY).catch(() => {})
	await clearPersistedRecords()
}

export async function saveToken(token: string) {
	await saveAccessToken(token)
}

export async function getToken() {
	return getAccessToken()
}

export async function clearToken() {
	await clearTokens()
}

export async function login(
	email: string,
	password: string,
): Promise<LoginResponse> {
	const response = await apiFetch('/users/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	})
	const result = (await response.json()) as LoginResponse

	await saveTokens({
		accessToken: result.access_token,
		refreshToken: result.refresh_token,
	})
	await cacheUser(result.user)
	return result
}

export async function getCurrentUser(token: string): Promise<UserRead> {
	const response = await apiFetch('/users/me', {
		headers: { Authorization: `Bearer ${token}` },
	})

	return response.json() as Promise<UserRead>
}

export async function restoreSession() {
	const token = await getToken()

	if (!token) {
		return null
	}

	try {
		const user = await getCurrentUser(token)
		await cacheUser(user)
		return user
	} catch (error) {
		// So uma recusa do servidor encerra a sessao. Sem rede ou com a API fora do ar,
		// entra com o ultimo usuario conhecido: os registros salvos no aparelho precisam
		// continuar acessiveis e sincronizar quando a conexao voltar.
		const rejected =
			error instanceof ApiError && (error.status === 401 || error.status === 403)

		if (!rejected) {
			const cached = await readCachedUser()

			if (cached) {
				return cached
			}
		}

		await clearToken()
		await clearCachedUser()
		return null
	}
}

export async function logout() {
	const refreshToken = await getRefreshToken()

	if (refreshToken) {
		try {
			await apiFetch('/users/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken }),
			})
		} catch {
			// Local logout must still clear stored credentials.
		}
	}

	await clearToken()
	await clearCachedUser()
}

export default {
	clearToken,
	getCurrentUser,
	getToken,
	login,
	logout,
	restoreSession,
	saveToken,
}
