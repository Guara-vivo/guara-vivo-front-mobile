import AsyncStorage from '@react-native-async-storage/async-storage'
import type { RecordItem } from '../types/records'

// Ultima lista de registros devolvida pela API, guardada no aparelho para o historico
// abrir sem conexao. So o resumo (/records/summary) e guardado, nunca como detalhe.
const STORAGE_KEY = 'guara_vivo_records_list'

// Muda quando o formato de RecordItem muda: uma copia de outra versao e descartada.
const STORE_VERSION = 1

type PersistedRecords = {
	version: number
	userId: number
	savedAt: number
	records: RecordItem[]
}

let activeUserId: number | null = null

// Grava e apaga em fila: um clear nunca e desfeito por uma gravacao que ja estava a caminho.
let writeChain: Promise<void> = Promise.resolve()

function enqueueWrite(task: () => Promise<void>) {
	writeChain = writeChain.then(task, task).catch(() => {})
	return writeChain
}

// Usuario logado: a lista so e gravada e lida para ele.
export function setRecordsStoreOwner(userId: number | null) {
	activeUserId = userId
}

export async function savePersistedRecords(records: RecordItem[]) {
	const userId = activeUserId
	if (userId === null) return

	await enqueueWrite(async () => {
		// Quem saiu (ou trocou) enquanto a gravacao esperava na fila nao tem a lista regravada.
		if (activeUserId !== userId) return

		const payload: PersistedRecords = {
			version: STORE_VERSION,
			userId,
			savedAt: Date.now(),
			records,
		}

		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
		} catch {
			// Sem a copia local o historico so perde a abertura offline.
		}
	})
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
			parsed.version !== STORE_VERSION ||
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
	// Primeiro tira o dono: buscas ainda em andamento deixam de regravar a lista.
	activeUserId = null

	await enqueueWrite(async () => {
		await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {})
	})
}
