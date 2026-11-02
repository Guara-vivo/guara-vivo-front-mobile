import { useEffect, useMemo, useState } from 'react'
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
import { isActiveAnalysisStatus, mergeProgressUpdates } from '../utils/historyRecords'
import { mergeHistoryRecords } from '../utils/pendingRecords'

// Lista do histórico: cache, rede, cópia guardada no aparelho, fila offline e progresso em tempo real.
export function useHistoryRecords() {
	const { addRecordProgressListener } = useRecordProgress()
	const cachedRecords = getCachedRecordsSnapshot()
	const [records, setRecords] = useState<RecordItem[]>(cachedRecords ?? [])
	const [isLoading, setIsLoading] = useState(!cachedRecords)
	const [isRefreshing, setIsRefreshing] = useState(false)
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

	const hasActiveAnalysis = useMemo(
		() => records.some((record) => isActiveAnalysisStatus(record.status)),
		[records],
	)

	useEffect(() => {
		if (!hasActiveAnalysis) {
			return
		}

		return addRecordProgressListener({
			onSnapshot: (snapshot) => {
				setRecords((current) => mergeProgressUpdates(current, snapshot))
			},
			onProgress: (progress) => {
				setRecords((current) => mergeProgressUpdates(current, [progress]))
			},
		})
	}, [addRecordProgressListener, hasActiveAnalysis])

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
		loadError,
		staleSince,
		handleRefresh,
	}
}
