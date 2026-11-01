import { apiFetch } from './apiClient'

export type OfflineStatus = {
	offline_mode: boolean
	remote_connected: boolean
	pending_sync: number
	syncing: boolean
	last_sync_at: string | null
	last_sync_error: string | null
}

function authHeaders(token: string, json = false): HeadersInit {
	return json
		? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
		: { Authorization: `Bearer ${token}` }
}

export async function getOfflineStatus(token: string): Promise<OfflineStatus> {
	const response = await apiFetch('/offline/status', {
		headers: authHeaders(token),
	})
	return response.json() as Promise<OfflineStatus>
}

// Vincula o usuário local à conta no servidor remoto.
export async function configureOffline(
	token: string,
	email: string,
	password: string,
) {
	await apiFetch('/offline/configure', {
		method: 'POST',
		headers: authHeaders(token, true),
		body: JSON.stringify({ email, password }),
	})
}

export async function triggerOfflineSync(token: string) {
	await apiFetch('/offline/sync/trigger', {
		method: 'POST',
		headers: authHeaders(token),
	})
}
