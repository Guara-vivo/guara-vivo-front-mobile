import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useRecordProgress } from '../contexts/RecordProgressContext'
import {
	getActivePendingRecords,
	subscribeQueue,
	type PendingRecord,
} from '../services/offlineQueue'
import {
	fetchRecords,
	getCachedRecordsSnapshot,
	isRecordsCacheFresh,
} from '../services/recordsService'
import { loadPersistedRecords } from '../services/recordsStore'
import type { RecordItem } from '../types/records'
import {
	mergeProgressUpdates,
	needsRecordsRefresh,
} from '../utils/historyRecords'
import { mergeHistoryRecords } from '../utils/pendingRecords'
import { createRefreshScheduler } from '../utils/refreshScheduler'

const SILENT_REFRESH_MIN_INTERVAL_MS = 5000

// Lista do histórico: cache, rede, cópia guardada no aparelho, fila offline e progresso em tempo real.
export function useHistoryRecords() {
	const { addRecordProgressListener } = useRecordProgress()
	const cachedRecords = getCachedRecordsSnapshot()
	const [records, setRecords] = useState<RecordItem[]>(cachedRecords ?? [])
	const [isLoading, setIsLoading] = useState(!cachedRecords)
	const [isRefreshing, setIsRefreshing] = useState(false)
	// Recarga silenciosa que corrige dados incompletos (começou offline ou lista zerada): a tela mostra esqueleto.
	const [isRecovering, setIsRecovering] = useState(false)
	const [loadError, setLoadError] = useState(false)
	const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([])
	// Data da ultima atualizacao quando a lista vem do aparelho (sem conexao com a API)
	const [staleSince, setStaleSince] = useState<number | null>(null)

	// Registros guardados no aparelho aparecem junto com os da API.
	useEffect(() => {
		let mounted = true
		const loadPending = () =>
			getActivePendingRecords().then((list) => {
				if (mounted) setPendingRecords(list)
			})

		void loadPending()

		const unsubscribe = subscribeQueue((event) => {
			if (event !== 'sent') {
				void loadPending()
				return
			}

			// Um registro foi enviado: troca o pendente pelo da API de uma vez.
			void Promise.all([
				fetchRecords({ force: true }),
				getActivePendingRecords(),
			])
				.then(([items, list]) => {
					if (mounted) {
						setRecords(items)
						setStaleSince(null)
						setPendingRecords(list)
					}
				})
				.catch(() => {
					void loadPending()
				})
		})

		return () => {
			mounted = false
			unsubscribe()
		}
	}, [])

	const allRecords = useMemo(
		() => mergeHistoryRecords(records, pendingRecords),
		[records, pendingRecords],
	)

	useEffect(() => {
		const controller = new AbortController()
		let mounted = true
		const cached = getCachedRecordsSnapshot()
		const hasCachedRecords = Boolean(cached)

		if (cached) {
			setRecords(cached)
		}

		setIsLoading(!hasCachedRecords)
		setLoadError(false)

		// Sem cache em memoria, mostra a ultima lista guardada no aparelho enquanto a API responde.
		let fetched = false
		let shownFromDevice = false
		const persistedLoad = hasCachedRecords
			? Promise.resolve(null)
			: loadPersistedRecords().then((persisted) => {
					if (mounted && persisted && !fetched) {
						shownFromDevice = true
						setRecords(persisted.records)
						setStaleSince(persisted.savedAt)
						setIsLoading(false)
					}
					return persisted
				})

		fetchRecords(
			{ force: hasCachedRecords && !isRecordsCacheFresh() },
			controller.signal,
		)
			.then((items) => {
				fetched = true
				if (mounted) {
					setRecords(items)
					setStaleSince(null)
				}
			})
			.catch(async (error) => {
				await persistedLoad

				if (mounted && error.name !== 'AbortError') {
					setLoadError(!hasCachedRecords && !shownFromDevice)
				}
			})
			.finally(() => {
				if (mounted && !hasCachedRecords) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
			controller.abort()
		}
	}, [])

	const recordsRef = useRef(records)
	recordsRef.current = records
	const unreliableRef = useRef(false)
	unreliableRef.current = staleSince !== null || loadError || records.length === 0
	const mountedRef = useRef(true)

	// Recarrega a lista sem mexer nos indicadores de carregamento (a tela continua como está).
	const refreshNow = useCallback(async () => {
		const recovering = unreliableRef.current

		if (recovering && mountedRef.current) {
			setIsRecovering(true)
		}

		try {
			const items = await fetchRecords({ force: true })
			if (mountedRef.current) {
				setRecords(items)
				setStaleSince(null)
				setLoadError(false)
			}
		} catch {
			// Sem rede ou API fora: mantém o que já está na tela; o próximo gatilho tenta de novo.
		} finally {
			if (recovering && mountedRef.current) {
				setIsRecovering(false)
			}
		}
	}, [])

	// O agendador limita a frequência sem descartar pedidos (um pedido cedo demais é adiado).
	const scheduler = useMemo(
		() => createRefreshScheduler(() => void refreshNow(), SILENT_REFRESH_MIN_INTERVAL_MS),
		[refreshNow],
	)
	const refreshSilently = useCallback(() => scheduler.trigger(), [scheduler])

	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
			scheduler.cancel()
		}
	}, [scheduler])

	// Progresso em tempo real: a lista (em qualquer aba) acompanha as análises sem precisar de
	// um registro ativo já na tela, e recarrega quando uma análise termina.
	useEffect(() => {
		return addRecordProgressListener({
			onSnapshot: (snapshot) => {
				const needsRefresh = needsRecordsRefresh(recordsRef.current, snapshot)
				setRecords((current) => mergeProgressUpdates(current, snapshot))
				if (needsRefresh) {
					refreshSilently()
				}
			},
			onProgress: (progress) => {
				const needsRefresh = needsRecordsRefresh(recordsRef.current, [progress])
				setRecords((current) => mergeProgressUpdates(current, [progress]))
				if (needsRefresh) {
					refreshSilently()
				}
			},
		})
	}, [addRecordProgressListener, refreshSilently])

	// Atualiza sozinha quando a internet volta e quando o app volta ao primeiro plano.
	useEffect(() => {
		let wasOnline: boolean | null = null
		const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
			const online = Boolean(state.isConnected) && state.isInternetReachable !== false
			if (online && wasOnline === false) {
				refreshSilently()
			}
			wasOnline = online
		})
		const appStateSubscription = AppState.addEventListener('change', (next) => {
			if (next === 'active' && !isRecordsCacheFresh()) {
				refreshSilently()
			}
		})

		return () => {
			unsubscribeNetInfo()
			appStateSubscription.remove()
		}
	}, [refreshSilently])

	const handleRefresh = async () => {
		setIsRefreshing(true)
		setLoadError(false)

		try {
			const items = await fetchRecords({ force: true })
			setRecords(items)
			setStaleSince(null)
		} catch {
			setLoadError(records.length === 0)
		} finally {
			setIsRefreshing(false)
			setIsLoading(false)
		}
	}

	return {
		allRecords,
		isLoading,
		isRefreshing,
		isRecovering,
		loadError,
		staleSince,
		handleRefresh,
	}
}
