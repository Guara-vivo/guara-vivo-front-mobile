import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import type { MapZoneRead, MapZoneRecordRead } from '../types/api'
import { getMapZoneRecords, deleteMapZone } from '../services/mapZonesApi'

interface MapZoneDetailContextType {
	selectedZone: MapZoneRead | null
	zoneRecords: MapZoneRecordRead[]
	isZoneRecordsLoading: boolean
	zoneRecordsError: string | null
	selectedRecordId: number | null
	showDeleteConfirm: boolean
	isDeleting: boolean

	openSheet: (zone: MapZoneRead) => void
	closeSheet: () => void
	setSelectedRecordId: (id: number | null) => void
	onRecordMarkerPress: (recordId: number) => void
	openDeleteConfirm: () => void
	closeDeleteConfirm: () => void
	deleteZone: () => Promise<number | null>
	registerScrollToRecord: (fn: (id: number) => void) => void
	scrollToRecord: (recordId: number) => void
	registerOnZoneDeleted: (fn: (zoneId: number) => void) => void
}

const MapZoneDetailContext = createContext<MapZoneDetailContextType | null>(null)

export function MapZoneDetailProvider({ children }: { children: React.ReactNode }) {
	const [selectedZone, setSelectedZone] = useState<MapZoneRead | null>(null)
	const [zoneRecords, setZoneRecords] = useState<MapZoneRecordRead[]>([])
	const [isZoneRecordsLoading, setIsZoneRecordsLoading] = useState(false)
	const [zoneRecordsError, setZoneRecordsError] = useState<string | null>(null)
	const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const scrollToRecordRef = useRef<((id: number) => void) | null>(null)
	const onZoneDeletedRef = useRef<((zoneId: number) => void) | null>(null)

	const registerScrollToRecord = useCallback((fn: (id: number) => void) => {
		scrollToRecordRef.current = fn
	}, [])

	const registerOnZoneDeleted = useCallback((fn: (zoneId: number) => void) => {
		onZoneDeletedRef.current = fn
	}, [])

	const scrollToRecord = useCallback((recordId: number) => {
		scrollToRecordRef.current?.(recordId)
	}, [])

	useEffect(() => {
		if (!selectedZone) {
			setZoneRecords([])
			setZoneRecordsError(null)
			setIsZoneRecordsLoading(false)
			setSelectedRecordId(null)
			return
		}

		const controller = new AbortController()
		let mounted = true

		setIsZoneRecordsLoading(true)
		setZoneRecordsError(null)
		setZoneRecords([])
		setSelectedRecordId(null)

		getMapZoneRecords(selectedZone.id, controller.signal)
			.then((records) => {
				if (mounted) setZoneRecords(records)
			})
			.catch((error: unknown) => {
				if (mounted && error instanceof Error && error.name !== 'AbortError') {
					setZoneRecordsError(error.message)
				}
			})
			.finally(() => {
				if (mounted) setIsZoneRecordsLoading(false)
			})

		return () => {
			mounted = false
			controller.abort()
		}
	}, [selectedZone])

	const openSheet = useCallback((zone: MapZoneRead) => {
		setSelectedZone(zone)
		setShowDeleteConfirm(false)
		setIsDeleting(false)
	}, [])

	const closeSheet = useCallback(() => {
		setSelectedZone(null)
		setShowDeleteConfirm(false)
		setIsDeleting(false)
	}, [])

	const onRecordMarkerPress = useCallback((recordId: number) => {
		setSelectedRecordId(recordId)
		scrollToRecordRef.current?.(recordId)
	}, [])

	const openDeleteConfirm = useCallback(() => {
		setShowDeleteConfirm(true)
	}, [])

	const closeDeleteConfirm = useCallback(() => {
		setShowDeleteConfirm(false)
	}, [])

	const deleteZone = useCallback(async (): Promise<number | null> => {
		if (!selectedZone) return null

		setIsDeleting(true)
		try {
			await deleteMapZone(selectedZone.id)
			const deletedId = selectedZone.id
			onZoneDeletedRef.current?.(deletedId)
			setSelectedZone(null)
			setShowDeleteConfirm(false)
			return deletedId
		} catch (error) {
			setShowDeleteConfirm(false)
			throw error
		} finally {
			setIsDeleting(false)
		}
	}, [selectedZone])

	const value = useMemo<MapZoneDetailContextType>(
		() => ({
			selectedZone,
			zoneRecords,
			isZoneRecordsLoading,
			zoneRecordsError,
			selectedRecordId,
			showDeleteConfirm,
			isDeleting,
			openSheet,
			closeSheet,
			setSelectedRecordId,
			onRecordMarkerPress,
			openDeleteConfirm,
			closeDeleteConfirm,
			deleteZone,
			registerScrollToRecord,
			scrollToRecord,
			registerOnZoneDeleted,
		}),
		[
			selectedZone, zoneRecords, isZoneRecordsLoading, zoneRecordsError,
			selectedRecordId, showDeleteConfirm, isDeleting,
			openSheet, closeSheet, setSelectedRecordId, onRecordMarkerPress,
			openDeleteConfirm, closeDeleteConfirm, deleteZone,
			registerScrollToRecord, scrollToRecord, registerOnZoneDeleted,
		],
	)

	return (
		<MapZoneDetailContext.Provider value={value}>
			{children}
		</MapZoneDetailContext.Provider>
	)
}

export function useMapZoneDetail(): MapZoneDetailContextType {
	const ctx = useContext(MapZoneDetailContext)
	if (!ctx) throw new Error('useMapZoneDetail must be used within MapZoneDetailProvider')
	return ctx
}
