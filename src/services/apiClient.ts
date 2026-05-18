import { Platform } from 'react-native'

export const API_URL =
	Platform.select({
		android: 'http://192.168.18.145:8001',
		ios: 'http://localhost:8001',
		default: 'http://localhost:8001',
	}) ?? 'http://localhost:8001'

export class ApiError extends Error {
	status: number
	body: string

	constructor(status: number, body: string) {
		super(`${status}: ${body}`)
		this.status = status
		this.body = body
	}
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	const response = await fetch(`${API_URL}${path}`, options)

	if (!response.ok) {
		const body = await response.text()
		throw new ApiError(response.status, body)
	}

	return response
}
