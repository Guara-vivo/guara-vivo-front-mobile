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
	| { type: 'heartbeat' }

type SubscribeRecordProgressParams = {
	onSnapshot: (records: RecordProgressUpdate[]) => void
	onProgress: (record: RecordProgressUpdate) => void
	onOpen?: () => void
	onClose?: () => void
	onError?: () => void
}

const INITIAL_RECONNECT_DELAY_MS = 1000
const MAX_RECONNECT_DELAY_MS = 30000
const INACTIVITY_TIMEOUT_MS = 60000

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
	return (
		message.type === 'snapshot' ||
		message.type === 'progress' ||
		message.type === 'heartbeat'
	)
}

export async function subscribeRecordProgress({
	onSnapshot,
	onProgress,
	onOpen,
	onClose,
	onError,
}: SubscribeRecordProgressParams) {
	const apiUrl = API_URL
	let socket: WebSocket | undefined
	let reconnectDelay = INITIAL_RECONNECT_DELAY_MS
	let reconnectTimer: ReturnType<typeof setTimeout> | undefined
	let inactivityTimer: ReturnType<typeof setTimeout> | undefined
	let isActive = true

	if (!apiUrl) {
		return () => {}
	}

	const clearReconnectTimer = () => {
		if (reconnectTimer) {
			clearTimeout(reconnectTimer)
			reconnectTimer = undefined
		}
	}

	const clearInactivityTimer = () => {
		if (inactivityTimer) {
			clearTimeout(inactivityTimer)
			inactivityTimer = undefined
		}
	}

	const scheduleReconnect = () => {
		if (!isActive || reconnectTimer) {
			return
		}

		clearInactivityTimer()
		const delay = reconnectDelay
		reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS)
		reconnectTimer = setTimeout(() => {
			reconnectTimer = undefined
			void openSocket()
		}, delay)
	}

	const resetInactivityTimer = () => {
		clearInactivityTimer()
		inactivityTimer = setTimeout(() => {
			if (!isActive) {
				return
			}

			if (socket && socket.readyState !== WebSocket.CLOSED) {
				socket.close()
				return
			}

			scheduleReconnect()
		}, INACTIVITY_TIMEOUT_MS)
	}

	const openSocket = async () => {
		const token = await getAccessToken()

		if (!isActive || !token) {
			return
		}

		try {
			socket = new WebSocket(buildProgressWebSocketUrl(apiUrl, token))
		} catch {
			onError?.()
			scheduleReconnect()
			return
		}

		socket.onopen = () => {
			reconnectDelay = INITIAL_RECONNECT_DELAY_MS
			resetInactivityTimer()
			onOpen?.()
		}

		socket.onmessage = (event) => {
			resetInactivityTimer()

			try {
				const message = JSON.parse(String(event.data))

				if (!isProgressMessage(message)) {
					return
				}

				if (message.type === 'heartbeat') {
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
			socket?.close()
		}

		socket.onclose = () => {
			clearInactivityTimer()
			onClose?.()
			scheduleReconnect()
		}
	}

	await openSocket()

	return () => {
		isActive = false
		clearReconnectTimer()
		clearInactivityTimer()

		if (!socket || socket.readyState === WebSocket.CLOSED) {
			return
		}

		socket.close()
	}
}
