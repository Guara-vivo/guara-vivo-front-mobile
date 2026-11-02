import AsyncStorage from '@react-native-async-storage/async-storage'
import type { RecordItem } from '../types/records'

// Ultima lista de registros devolvida pela API, guardada no aparelho para o historico
// abrir sem conexao. So o resumo (/records/summary) e guardado, nunca como detalhe.
const STORAGE_KEY = 'guara_vivo_records_list'

type PersistedRecords = {
	userId: number
	savedAt: number
	records: RecordItem[]
}

let activeUserId: number | null = null

// Usuario logado: a lista so e gravada e lida para ele.
export function setRecordsStoreOwner(userId: number | null) {
	activeUserId = userId
}

export async function savePersistedRecords(records: RecordItem[]) {
	if (activeUserId === null) return

	const payload: PersistedRecords = {
		userId: activeUserId,
		savedAt: Date.now(),
		records,
	}

	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
	} catch {
		// Sem a copia local o historico so perde a abertura offline.
	}
}

export async function loadPersistedRecords(): Promise<{
	records: RecordItem[]
	savedAt: number
} | null> {
	if (activeUserId === null) return null

	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY)
		const parsed = raw ? (JSON.parse(raw) as Partial<PersistedRecords>) : null

		if (
			!parsed ||
			parsed.userId !== activeUserId ||
			typeof parsed.savedAt !== 'number' ||
			!Array.isArray(parsed.records) ||
			!parsed.records.every((record) => record && typeof record.id === 'number')
		) {
			return null
		}

		return { records: parsed.records, savedAt: parsed.savedAt }
	} catch {
		return null
	}
}

export async function clearPersistedRecords() {
	await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {})
}
