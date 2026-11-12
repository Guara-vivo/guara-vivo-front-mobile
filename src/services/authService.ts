import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { ApiError, apiFetch, isNetworkFailure } from './apiClient'
import { isOnlineState } from '../utils/connectivity'
import { invalidateRecordsCache } from './recordsCache'
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
	// Cache em memoria tambem: sem isso, quem entra em seguida enxerga a lista anterior.
	invalidateRecordsCache()
	await AsyncStorage.removeItem(USER_CACHE_KEY).catch(() => {})
	await clearPersistedRecords()
}

// Sessao encerrada pelo servidor (refresh recusado): os tokens ja foram apagados,
// falta limpar os dados do usuario guardados no aparelho.
export async function clearExpiredSession() {
	await clearCachedUser()
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

const LOGIN_RETRY_DELAY_MS = 400

export async function login(
	email: string,
	password: string,
): Promise<LoginResponse> {
	const request = () =>
		apiFetch('/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})

	let response: Awaited<ReturnType<typeof request>>
	try {
		response = await request()
	} catch (error) {
		// Uma nova tentativa só quando o pedido nem foi respondido (rede). Timeout não
		// repete: o servidor pode ter recebido o pedido. Erro da API também não.
		if (!isNetworkFailure(error)) {
			throw error
		}
		await new Promise((resolve) => setTimeout(resolve, LOGIN_RETRY_DELAY_MS))
		response = await request()
	}
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

async function isDeviceOffline() {
	try {
		return !isOnlineState(await NetInfo.fetch())
	} catch {
		return false
	}
}

export async function restoreSession() {
	const token = await getToken()

	if (!token) {
		return null
	}

	// Sem rede nao ha o que validar: abre direto com os dados locais, sem esperar timeout.
	// Token vencido nao e motivo de logout; a renovacao acontece quando houver conexao.
	if (await isDeviceOffline()) {
		const cached = await readCachedUser()

		if (cached) {
			return cached
		}
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

			// Sem rede e sem usuario guardado (app atualizado, nunca abriu online): nao ha
			// como entrar, mas apagar os tokens deslogaria quem so esta sem sinal. Mostra o
			// login e mantem a sessao para a proxima abertura com internet.
			return null
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
