import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiFetch } from './apiClient'
import type { LoginResponse, UserRead } from '../types/api'

const TOKEN_KEY = 'guara_vivo_access_token'

export async function saveToken(token: string) {
	const normalizedToken = token.trim()

	if (!normalizedToken) {
		throw new Error('Missing access token')
	}

	await AsyncStorage.setItem(TOKEN_KEY, normalizedToken)
}

export async function getToken() {
	const token = await AsyncStorage.getItem(TOKEN_KEY)
	return token?.trim() || null
}

export async function clearToken() {
	await AsyncStorage.removeItem(TOKEN_KEY)
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

	await saveToken(result.access_token)
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
		return await getCurrentUser(token)
	} catch {
		await clearToken()
		return null
	}
}

export async function logout() {
	await clearToken()
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
