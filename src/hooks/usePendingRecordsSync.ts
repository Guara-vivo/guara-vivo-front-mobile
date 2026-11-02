import { useEffect } from 'react'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { flushPendingRecords, setQueueOwner } from '../services/offlineQueue'

const RETRY_INTERVAL_MS = 60000

// Envia os registros guardados no aparelho: ao entrar, quando a rede volta, quando o
// app volta ao primeiro plano e a cada minuto (cobre API fora do ar com rede ligada).
export function usePendingRecordsSync(userId: number | null) {
	useEffect(() => {
		setQueueOwner(userId)

		if (userId === null) {
			return
		}

		const flush = () => {
			void flushPendingRecords().catch(() => {
				// Falhas ficam registradas na propria fila; tenta de novo no proximo gatilho.
			})
		}

		flush()

		const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
			if (state.isConnected && state.isInternetReachable !== false) {
				flush()
			}
		})
		const appStateSubscription = AppState.addEventListener('change', (next) => {
			if (next === 'active') {
				flush()
			}
		})
		const interval = setInterval(flush, RETRY_INTERVAL_MS)

		return () => {
			unsubscribeNetInfo()
			appStateSubscription.remove()
			clearInterval(interval)
			setQueueOwner(null)
		}
	}, [userId])
}
