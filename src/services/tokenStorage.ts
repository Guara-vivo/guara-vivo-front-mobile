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

export async function saveTokens(params: {
	accessToken: string
	refreshToken: string
}) {
	await AsyncStorage.multiSet([
		[ACCESS_TOKEN_KEY, normalizeToken(params.accessToken)],
		[REFRESH_TOKEN_KEY, normalizeToken(params.refreshToken)],
	])
}

export async function saveAccessToken(token: string) {
	await AsyncStorage.setItem(ACCESS_TOKEN_KEY, normalizeToken(token))
}

export async function getAccessToken() {
	const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
	return token?.trim() || null
}

export async function getRefreshToken() {
	const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
	return token?.trim() || null
}

export async function clearTokens() {
	await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY])
}
