import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import InAppNotificationBanner, {
	type InAppNotificationVariant,
} from '../components/InAppNotificationBanner'
import type { RecordStatus } from '../types/api'

type InAppNotification = {
	recordId: number
	status: Extract<RecordStatus, 'completed' | 'failed'>
	title: string
	message: string
	variant: InAppNotificationVariant
}

type ShowAnalysisNotificationParams = {
	recordId: number
	status: RecordStatus
}

type InAppNotificationContextValue = {
	showAnalysisNotification: (params: ShowAnalysisNotificationParams) => void
}

type InAppNotificationProviderProps = {
	children: React.ReactNode
	isEnabled: boolean
	onOpenRecord: (recordId: number) => void
}

const AUTO_HIDE_MS = 6000

const InAppNotificationContext = createContext<InAppNotificationContextValue | null>(null)

function buildAnalysisNotification({
	recordId,
	status,
}: ShowAnalysisNotificationParams): InAppNotification | null {
	if (status === 'completed') {
		return {
			recordId,
			status,
			title: 'Analise finalizada',
			message: `Registro #${String(recordId).padStart(3, '0')} pronto. Toque para ver os detalhes.`,
			variant: 'success',
		}
	}

	if (status === 'failed') {
		return {
			recordId,
			status,
			title: 'Analise falhou',
			message: `Nao foi possivel analisar o registro #${String(recordId).padStart(3, '0')}. Toque para abrir.`,
			variant: 'error',
		}
	}

	return null
}

export function InAppNotificationProvider({
	children,
	isEnabled,
	onOpenRecord,
}: InAppNotificationProviderProps) {
	const [notification, setNotification] = useState<InAppNotification | null>(null)
	const notifiedKeysRef = useRef(new Set<string>())
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const clearHideTimer = useCallback(() => {
		if (hideTimerRef.current) {
			clearTimeout(hideTimerRef.current)
			hideTimerRef.current = null
		}
	}, [])

	const hideNotification = useCallback(() => {
		clearHideTimer()
		setNotification(null)
	}, [clearHideTimer])

	useEffect(() => clearHideTimer, [clearHideTimer])

	useEffect(() => {
		if (isEnabled) {
			return
		}

		notifiedKeysRef.current.clear()
		hideNotification()
	}, [hideNotification, isEnabled])

	const showAnalysisNotification = useCallback(
		(params: ShowAnalysisNotificationParams) => {
			const nextNotification = buildAnalysisNotification(params)

			if (!nextNotification) {
				return
			}

			const notificationKey = `${nextNotification.recordId}-${nextNotification.status}`
			if (notifiedKeysRef.current.has(notificationKey)) {
				return
			}

			notifiedKeysRef.current.add(notificationKey)
			clearHideTimer()
			setNotification(nextNotification)
			hideTimerRef.current = setTimeout(() => {
				setNotification(null)
				hideTimerRef.current = null
			}, AUTO_HIDE_MS)
		},
		[clearHideTimer],
	)

	const openNotificationRecord = useCallback(() => {
		if (!notification) {
			return
		}

		const recordId = notification.recordId
		hideNotification()
		onOpenRecord(recordId)
	}, [hideNotification, notification, onOpenRecord])

	const value = useMemo(
		() => ({ showAnalysisNotification }),
		[showAnalysisNotification],
	)

	return (
		<InAppNotificationContext.Provider value={value}>
			{children}
			{notification ? (
				<InAppNotificationBanner
					title={notification.title}
					message={notification.message}
					variant={notification.variant}
					onPress={openNotificationRecord}
					onClose={hideNotification}
				/>
			) : null}
		</InAppNotificationContext.Provider>
	)
}

export function useInAppNotification() {
	const context = useContext(InAppNotificationContext)

	if (!context) {
		throw new Error('useInAppNotification must be used within InAppNotificationProvider')
	}

	return context
}
