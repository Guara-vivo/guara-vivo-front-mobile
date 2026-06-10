import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCESS_TOKEN_KEY = 'guara_vivo_access_token'
const REFRESH_TOKEN_KEY = 'guara_vivo_refresh_token'

function normalizeToken(token: string) {
	const normalizedToken = token.trim()

	if (!normalizedToken) {
		throw new Error('Missing token')
	}

	return normalizedToken
}

/**
 * Read token from secure storage with fallback to AsyncStorage for migration.
 * If token exists in AsyncStorage, migrate it to SecureStore and remove from AsyncStorage.
 */
async function readTokenFromStorage(key: string): Promise<string | null> {
	let token: string | null = null

	// Try SecureStore first
	try {
		token = await SecureStore.getItemAsync(key)
		if (token) {
			return token.trim() || null
		}
	} catch {
		// SecureStore failed — fall through to AsyncStorage
	}

	// Fallback: AsyncStorage
	try {
		token = await AsyncStorage.getItem(key)
	} catch {
		return null
	}

	if (token) {
		// Try to migrate to SecureStore, but keep AsyncStorage copy if migration fails
		try {
			await SecureStore.setItemAsync(key, token)
			await AsyncStorage.removeItem(key)
		} catch {
			// Migration failed — AsyncStorage copy preserved
		}

		return token.trim() || null
	}

	return null
}

async function secureStoreSetItem(
	key: string,
	value: string,
): Promise<boolean> {
	try {
		await SecureStore.setItemAsync(key, value)
		return true
	} catch {
		await AsyncStorage.setItem(key, value)
		return false
	}
}

export async function saveTokens(params: {
	accessToken: string
	refreshToken: string
}) {
	const access = normalizeToken(params.accessToken)
	const refresh = normalizeToken(params.refreshToken)

	const secureAccessOk = await secureStoreSetItem(ACCESS_TOKEN_KEY, access)
	const secureRefreshOk = await secureStoreSetItem(REFRESH_TOKEN_KEY, refresh)

	if (secureAccessOk && secureRefreshOk) {
		await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
	}
}

export async function saveAccessToken(token: string) {
	const normalized = normalizeToken(token)
	const secureOk = await secureStoreSetItem(ACCESS_TOKEN_KEY, normalized)

	if (secureOk) {
		await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
	}
}

export async function getAccessToken() {
	return await readTokenFromStorage(ACCESS_TOKEN_KEY)
}

export async function getRefreshToken() {
	return await readTokenFromStorage(REFRESH_TOKEN_KEY)
}

export async function clearTokens() {
	await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => {})
	await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {})

	// Also clear AsyncStorage for migration safety
	await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
}
