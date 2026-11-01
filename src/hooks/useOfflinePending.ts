import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { IS_OFFLINE_API } from '../services/apiClient'
import { getToken } from '../services/authService'
import { getOfflineStatus } from '../services/offlineApi'

// Quantidade de registros aguardando envio ao servidor remoto (null = desconhecido).
export function useOfflinePending() {
	const [pending, setPending] = useState<number | null>(null)

	useFocusEffect(
		useCallback(() => {
			if (!IS_OFFLINE_API) return

			let active = true
			void (async () => {
				try {
					const token = await getToken()
					if (!token) return
					const status = await getOfflineStatus(token)
					if (active) setPending(status.pending_sync)
				} catch {
					if (active) setPending(null)
				}
			})()

			return () => {
				active = false
			}
		}, []),
	)

	return pending
}
