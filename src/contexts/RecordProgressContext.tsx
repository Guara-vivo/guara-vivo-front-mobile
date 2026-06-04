import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { useInAppNotification } from './InAppNotificationContext'
import {
	subscribeRecordProgress,
	type RecordProgressUpdate,
} from '../services/recordProgressService'
import type { RecordStatus } from '../types/api'

type RecordProgressListener = {
	onSnapshot?: (records: RecordProgressUpdate[]) => void
	onProgress?: (record: RecordProgressUpdate) => void
}

type RecordProgressContextValue = {
	addRecordProgressListener: (listener: RecordProgressListener) => () => void
}

type RecordProgressProviderProps = {
	children: React.ReactNode
	isEnabled: boolean
}

const RecordProgressContext = createContext<RecordProgressContextValue | null>(null)

function isActiveAnalysisStatus(status?: RecordStatus) {
	return !status || status === 'pending' || status === 'processing'
}

function isFinalAnalysisStatus(status: RecordStatus) {
	return status === 'completed' || status === 'failed'
}

export function RecordProgressProvider({
	children,
	isEnabled,
}: RecordProgressProviderProps) {
	const listenersRef = useRef(new Set<RecordProgressListener>())
	const statusByRecordIdRef = useRef(new Map<number, RecordStatus>())
	const hasSnapshotRef = useRef(false)
	const { showAnalysisNotification } = useInAppNotification()

	const notifyListenersSnapshot = useCallback((records: RecordProgressUpdate[]) => {
		listenersRef.current.forEach((listener) => {
			listener.onSnapshot?.(records)
		})
	}, [])

	const notifyListenersProgress = useCallback((record: RecordProgressUpdate) => {
		listenersRef.current.forEach((listener) => {
			listener.onProgress?.(record)
		})
	}, [])

	const handleSnapshot = useCallback(
		(records: RecordProgressUpdate[]) => {
			if (hasSnapshotRef.current) {
				records.forEach((record) => {
					const previousStatus = statusByRecordIdRef.current.get(record.id)

					if (
						isActiveAnalysisStatus(previousStatus) &&
						isFinalAnalysisStatus(record.status)
					) {
						showAnalysisNotification({
							recordId: record.id,
							status: record.status,
						})
					}
				})
			}

			records.forEach((record) => {
				statusByRecordIdRef.current.set(record.id, record.status)
			})
			hasSnapshotRef.current = true
			notifyListenersSnapshot(records)
		},
		[notifyListenersSnapshot, showAnalysisNotification],
	)

	const handleProgress = useCallback(
		(record: RecordProgressUpdate) => {
			statusByRecordIdRef.current.set(record.id, record.status)

			if (isFinalAnalysisStatus(record.status)) {
				showAnalysisNotification({
					recordId: record.id,
					status: record.status,
				})
			}

			notifyListenersProgress(record)
		},
		[notifyListenersProgress, showAnalysisNotification],
	)

	const resetProgressState = useCallback(() => {
		statusByRecordIdRef.current.clear()
		hasSnapshotRef.current = false
	}, [])

	useEffect(() => {
		if (!isEnabled) {
			resetProgressState()
			return
		}

		let mounted = true
		let unsubscribe: (() => void) | undefined

		subscribeRecordProgress({
			onSnapshot: handleSnapshot,
			onProgress: handleProgress,
		}).then((cleanup) => {
			if (!mounted) {
				cleanup()
				return
			}

			unsubscribe = cleanup
		})

		return () => {
			mounted = false
			unsubscribe?.()
			resetProgressState()
		}
	}, [handleProgress, handleSnapshot, isEnabled, resetProgressState])

	const addRecordProgressListener = useCallback((listener: RecordProgressListener) => {
		listenersRef.current.add(listener)

		return () => {
			listenersRef.current.delete(listener)
		}
	}, [])

	const value = useMemo(
		() => ({ addRecordProgressListener }),
		[addRecordProgressListener],
	)

	return (
		<RecordProgressContext.Provider value={value}>
			{children}
		</RecordProgressContext.Provider>
	)
}

export function useRecordProgress() {
	const context = useContext(RecordProgressContext)

	if (!context) {
		throw new Error('useRecordProgress must be used within RecordProgressProvider')
	}

	return context
}
