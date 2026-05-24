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
	try {
		// Try SecureStore first
		let token = await SecureStore.getItemAsync(key)
		if (token) {
			return token.trim() || null
		}

		// Fallback: AsyncStorage (migration path)
		token = await AsyncStorage.getItem(key)
		if (token) {
			// Migrate to SecureStore and remove from AsyncStorage
			await SecureStore.setItemAsync(key, token)
			await AsyncStorage.removeItem(key)
			return token.trim() || null
		}

		return null
	} catch {
		return null
	}
}

export async function saveTokens(params: {
	accessToken: string
	refreshToken: string
}) {
	const access = normalizeToken(params.accessToken)
	const refresh = normalizeToken(params.refreshToken)

	await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access)
	await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh)

	// Clean up AsyncStorage (no longer used)
	await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
}

export async function saveAccessToken(token: string) {
	const normalized = normalizeToken(token)
	await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, normalized)

	// Clean up AsyncStorage
	await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
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
