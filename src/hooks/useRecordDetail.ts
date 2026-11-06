import { useEffect, useState } from 'react'
import {
	fetchRecordDetail,
	getCachedRecordDetailSnapshot,
	isRecordDetailCacheFresh,
	type RecordDetailItem,
} from '../services/recordsService'

// Carrega o detalhe de um registro (cache primeiro, rede em seguida) e expõe o pull-to-refresh.
export function useRecordDetail(recordId: number | undefined) {
	const [record, setRecord] = useState<RecordDetailItem | undefined>(() =>
		recordId ? getCachedRecordDetailSnapshot(recordId) : undefined,
	)
	const [isLoading, setIsLoading] = useState(
		() => !(recordId && getCachedRecordDetailSnapshot(recordId)),
	)
	const [isRefreshing, setIsRefreshing] = useState(false)
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
	}, [recordId])

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

	return { record, isLoading, isRefreshing, isFetchingDetail, handleRefresh }
}
