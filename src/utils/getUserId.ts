import { getAccessToken } from '../services/tokenStorage'

export async function getUserId(): Promise<number> {
	try {
		const token = await getAccessToken()
		if (!token) throw new Error('No token found')

		// Decode JWT payload (no validation, just decode)
		const parts = token.split('.')
		if (parts.length !== 3) throw new Error('Invalid token format')

		const payload = JSON.parse(atob(parts[1]))
		const userId = payload.sub // JWT 'sub' claim is user_id

		if (!userId || typeof userId !== 'number') {
			throw new Error('Invalid user_id in token')
		}

		return userId
	} catch (error) {
		console.error('[getUserId] Failed to extract user ID:', error)
		throw error
	}
}
