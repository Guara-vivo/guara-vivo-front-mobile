import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCESS_TOKEN_KEY = 'guara_vivo_access_token'
const REFRESH_TOKEN_KEY = 'guara_vivo_refresh_token'

// Usado só quando o SecureStore do aparelho não funciona (alguns emuladores perdem a chave de
// criptografia). A sessão vale enquanto o app estiver aberto; o token nunca vai para o
// AsyncStorage, que guarda em texto puro.
const memoryFallback = new Map<string, string>()

function normalizeToken(token: string) {
	const normalizedToken = token.trim()

	if (!normalizedToken) {
		throw new Error('Missing token')
	}

	return normalizedToken
}

async function removeLegacyCopy(keys: string[]) {
	try {
		await AsyncStorage.multiRemove(keys)
	} catch {
		// Sem a cópia antiga não há o que migrar; ignora.
	}
}

async function secureStoreSetItem(
	key: string,
	value: string,
): Promise<boolean> {
	try {
		await SecureStore.setItemAsync(key, value)

		// Alguns aparelhos/emuladores gravam sem erro mas perdem a chave de criptografia
		// (leitura devolve vazio). Confere a leitura antes de confiar no SecureStore.
		if ((await SecureStore.getItemAsync(key)) !== value) {
			throw new Error('SecureStore read-back mismatch')
		}

		memoryFallback.delete(key)
		return true
	} catch {
		memoryFallback.set(key, value)
		return false
	}
}

/**
 * Lê o token do SecureStore. Se ele não funciona, usa a cópia em memória. Tokens salvos por
 * versões antigas no AsyncStorage são migrados para o SecureStore e a cópia em texto puro é
 * sempre apagada, mesmo que a migração não seja possível.
 */
async function readTokenFromStorage(key: string): Promise<string | null> {
	try {
		const token = await SecureStore.getItemAsync(key)
		if (token?.trim()) {
			return token.trim()
		}
	} catch {
		// SecureStore indisponível — tenta a memória e depois a cópia antiga
	}

	const inMemory = memoryFallback.get(key)
	if (inMemory) {
		return inMemory
	}

	let legacyToken: string | null = null
	try {
		legacyToken = await AsyncStorage.getItem(key)
	} catch {
		return null
	}

	const normalized = legacyToken?.trim()
	if (!normalized) {
		return null
	}

	await secureStoreSetItem(key, normalized)
	await removeLegacyCopy([key])

	return normalized
}

export async function saveTokens(params: {
	accessToken: string
	refreshToken: string
}) {
	const access = normalizeToken(params.accessToken)
	const refresh = normalizeToken(params.refreshToken)

	await secureStoreSetItem(ACCESS_TOKEN_KEY, access)
	await secureStoreSetItem(REFRESH_TOKEN_KEY, refresh)
	await removeLegacyCopy([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
}

export async function saveAccessToken(token: string) {
	const normalized = normalizeToken(token)

	await secureStoreSetItem(ACCESS_TOKEN_KEY, normalized)
	await removeLegacyCopy([ACCESS_TOKEN_KEY])
}

export async function getAccessToken() {
	return await readTokenFromStorage(ACCESS_TOKEN_KEY)
}

export async function getRefreshToken() {
	return await readTokenFromStorage(REFRESH_TOKEN_KEY)
}

export async function clearTokens() {
	memoryFallback.clear()

	await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => {})
	await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {})

	// Apaga também a cópia de versões antigas
	await removeLegacyCopy([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
}
