import { API_URL } from './apiClient'
import { getAccessToken } from './tokenStorage'
import type { RecordStatus } from '../types/api'

export type RecordProgressUpdate = {
	id: number
	status: RecordStatus
	analysis_progress: number
}

type ProgressMessage =
	| { type: 'snapshot'; records: RecordProgressUpdate[] }
	| { type: 'progress'; record: RecordProgressUpdate }

type SubscribeRecordProgressParams = {
	onSnapshot: (records: RecordProgressUpdate[]) => void
	onProgress: (record: RecordProgressUpdate) => void
	onOpen?: () => void
	onClose?: () => void
	onError?: () => void
}

function buildProgressWebSocketUrl(apiUrl: string, token: string) {
	const url = new URL(apiUrl)
	url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
	url.pathname = `${url.pathname.replace(/\/$/, '')}/records/progress/ws`
	url.searchParams.set('token', token)
	return url.toString()
}

function isProgressMessage(value: unknown): value is ProgressMessage {
	if (!value || typeof value !== 'object') {
		return false
	}

	const message = value as Partial<ProgressMessage>
	return message.type === 'snapshot' || message.type === 'progress'
}

export async function subscribeRecordProgress({
	onSnapshot,
	onProgress,
	onOpen,
	onClose,
	onError,
}: SubscribeRecordProgressParams) {
	const token = await getAccessToken()
	const apiUrl = API_URL

	if (!token || !apiUrl) {
		return () => {}
	}

	const socket = new WebSocket(buildProgressWebSocketUrl(apiUrl, token))

	socket.onopen = () => {
		onOpen?.()
	}

	socket.onmessage = (event) => {
		try {
			const message = JSON.parse(String(event.data))

			if (!isProgressMessage(message)) {
				return
			}

			if (message.type === 'snapshot') {
				onSnapshot(message.records)
				return
			}

			onProgress(message.record)
		} catch {
			// Ignore malformed progress events and keep the socket alive.
		}
	}

	socket.onerror = () => {
		onError?.()
	}

	socket.onclose = () => {
		onClose?.()
	}

	return () => {
		socket.close()
	}
}
