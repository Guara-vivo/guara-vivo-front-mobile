import { useCallback, useEffect, useState } from 'react'
import {
	fetchRecordDetail,
	getCachedRecordDetailSnapshot,
	isRecordDetailCacheFresh,
	type RecordDetailItem,
} from '../services/recordsService'
import { getLoadErrorMessage } from '../utils/loadErrorMessage'

// Carrega o detalhe de um registro (cache primeiro, rede em seguida) e expõe o pull-to-refresh.
export function useRecordDetail(recordId: number | undefined) {
	const [record, setRecord] = useState<RecordDetailItem | undefined>(() =>
		recordId ? getCachedRecordDetailSnapshot(recordId) : undefined,
	)
	const [isLoading, setIsLoading] = useState(
		() => !(recordId && getCachedRecordDetailSnapshot(recordId)),
	)
	const [isRefreshing, setIsRefreshing] = useState(false)
	// Texto da falha ao carregar (ex.: sem internet) quando não há nada guardado para mostrar.
	const [loadError, setLoadError] = useState<string | null>(null)
	const [reloadKey, setReloadKey] = useState(0)
	// A busca do detalhe completo (com as análises) está em andamento.
	const [isFetchingDetail, setIsFetchingDetail] = useState(true)

	useEffect(() => {
		const controller = new AbortController()
		let mounted = true

		if (!recordId) {
			setRecord(undefined)
			setIsLoading(false)
			return () => {
				mounted = false
				controller.abort()
			}
		}

		setLoadError(null)
		const cached = getCachedRecordDetailSnapshot(recordId)
		const hasCachedRecord = Boolean(cached)

		if (cached) {
			setRecord(cached)
		}

		if (hasCachedRecord && isRecordDetailCacheFresh(recordId)) {
			setIsLoading(false)
			setIsFetchingDetail(false)
			return () => {
				mounted = false
				controller.abort()
			}
		}

		setIsLoading(!hasCachedRecord)
		setIsFetchingDetail(true)
		fetchRecordDetail(recordId, { force: hasCachedRecord }, controller.signal)
			.then((item) => {
				if (mounted) {
					setRecord(item)
				}
			})
			.catch((error) => {
				if (mounted && error.name !== 'AbortError') {
					setRecord(cached)

					if (!cached) {
						setLoadError(
							getLoadErrorMessage(error, 'Não foi possível carregar o registro. Tente de novo.'),
						)
					}
				}
			})
			.finally(() => {
				if (mounted) {
					setIsFetchingDetail(false)
				}

				if (mounted && !hasCachedRecord) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
			controller.abort()
		}
	}, [recordId, reloadKey])

	const retry = useCallback(() => {
		setIsLoading(true)
		setReloadKey((key) => key + 1)
	}, [])

	const handleRefresh = async () => {
		if (!recordId) {
			return
		}

		setIsRefreshing(true)

		try {
			const item = await fetchRecordDetail(recordId, { force: true })
			setRecord(item)
		} catch {
			setRecord((current: RecordDetailItem | undefined) => current)
		} finally {
			setIsRefreshing(false)
			setIsLoading(false)
		}
	}

	return { record, isLoading, isRefreshing, isFetchingDetail, loadError, retry, handleRefresh }
}
