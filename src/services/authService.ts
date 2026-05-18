import { apiFetch } from './apiClient'
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveAccessToken,
	saveTokens,
} from './tokenStorage'
import type { LoginResponse, UserRead } from '../types/api'

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
