import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import i18n from '../i18n'
import type { MapZoneRecordRead } from '../types/api'
import { getAdminMapRecords } from '../services/adminRecordsApi'
import { getLoadErrorMessage } from '../utils/loadErrorMessage'

// A lista é só do mapa do admin e fica só em memória: nunca vai para o aparelho
// (seria a localização de todos os usuários gravada no celular) e some ao sair da conta.
const STALE_AFTER_MS = 60 * 1000

type AdminRecordsContextType = {
	// Conta de admin com sessão aberta; para as demais o contexto fica vazio e inerte.
	isAdmin: boolean
	viewerId: number | null
	records: MapZoneRecordRead[]
	isLoading: boolean
	error: string | null
	reload: () => Promise<void>
	// Recarrega só se a última carga passou de 1 minuto (o andamento ao vivo não chega para registros alheios).
	refreshIfStale: () => void
}

const AdminRecordsContext = createContext<AdminRecordsContextType | null>(null)

export function AdminRecordsProvider({
	isAdmin,
	viewerId,
	children,
}: {
	isAdmin: boolean
	viewerId: number | null
	children: React.ReactNode
}) {
	const [records, setRecords] = useState<MapZoneRecordRead[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const generationRef = useRef(0)
	const loadedAtRef = useRef<number | null>(null)
	const loadingRef = useRef(false)

	const reload = useCallback(async () => {
		if (!isAdmin) return

		const generation = ++generationRef.current
		loadingRef.current = true
		setIsLoading(true)
		setError(null)

		try {
			const data = await getAdminMapRecords()
			if (generation !== generationRef.current) return
			setRecords(data)
			loadedAtRef.current = Date.now()
		} catch (loadError) {
			if (generation !== generationRef.current) return
			// Mantém o que já estava no mapa; só avisa que a atualização falhou.
			setError(getLoadErrorMessage(loadError, i18n.t('map:adminRecords.loadError')))
		} finally {
			if (generation === generationRef.current) {
				loadingRef.current = false
				setIsLoading(false)
			}
		}
	}, [isAdmin])

	const refreshIfStale = useCallback(() => {
		if (!isAdmin || loadingRef.current) return

		const loadedAt = loadedAtRef.current
		if (loadedAt === null || Date.now() - loadedAt > STALE_AFTER_MS) {
			void reload()
		}
	}, [isAdmin, reload])

	// Perdeu o acesso de admin (ou saiu da conta): descarta a lista e as respostas em andamento.
	useEffect(() => {
		if (isAdmin) return

		generationRef.current += 1
		loadedAtRef.current = null
		loadingRef.current = false
		setRecords([])
		setIsLoading(false)
		setError(null)
	}, [isAdmin])

	const value = useMemo<AdminRecordsContextType>(
		() => ({ isAdmin, viewerId, records, isLoading, error, reload, refreshIfStale }),
		[isAdmin, viewerId, records, isLoading, error, reload, refreshIfStale],
	)

	return <AdminRecordsContext.Provider value={value}>{children}</AdminRecordsContext.Provider>
}

export function useAdminRecords(): AdminRecordsContextType {
	const ctx = useContext(AdminRecordsContext)
	if (!ctx) throw new Error('useAdminRecords must be used within AdminRecordsProvider')
	return ctx
}
