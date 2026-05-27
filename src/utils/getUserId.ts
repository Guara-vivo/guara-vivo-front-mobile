import { getAccessToken } from '../services/tokenStorage'

export async function getUserId(): Promise<number> {
	try {
		const token = await getAccessToken()
		if (!token) throw new Error('No token found')

		// Decode JWT payload (no validation, just decode)
		const parts = token.split('.')
		if (parts.length !== 3) throw new Error('Invalid token format')

		const payload = JSON.parse(atob(parts[1]))
		const userIdStr = payload.sub // JWT 'sub' claim is user_id as string

		if (!userIdStr) {
			throw new Error('Missing user_id in token')
		}

		const userId = parseInt(userIdStr, 10)
		if (isNaN(userId)) {
			throw new Error('Invalid user_id format in token')
		}

		return userId
	} catch (error) {
		console.error('[getUserId] Failed to extract user ID:', error)
		throw error
	}
}
