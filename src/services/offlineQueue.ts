import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { Directory, File, Paths } from 'expo-file-system'
import { ApiError } from './apiClient'
import { uploadRecord } from './recordsApi'
import { invalidateRecordsCache } from './recordsCache'
import { getAccessToken } from './tokenStorage'
import type { BirdBehavior, ReactNativeFile } from '../types/api'

// Fila local de registros: o app guarda o registro (e as fotos) no aparelho e envia
// quando houver conexao. O client_uuid torna o reenvio seguro (a API nao duplica).

const STORAGE_KEY = 'guara_vivo_pending_records'
const PENDING_DIR = 'pending-records'

export type PendingRecord = {
	clientUuid: string
	userId: number
	latitude: number
	longitude: number
	behavior: BirdBehavior[]
	dateTime: string
	images: ReactNativeFile[]
	// 'failed' = a API recusou o registro (4xx); nao e reenviado automaticamente.
	status: 'pending' | 'failed'
	attempts: number
	lastError: string | null
	createdAt: string
}

export type EnqueueParams = {
	latitude: number
	longitude: number
	behavior: BirdBehavior[]
	dateTime: Date
	images: ReactNativeFile[]
}

// Limites da API: 5 MB por imagem e 10 MB no total. Validar ao salvar evita guardar um
// registro que seria recusado depois, quando o usuario ja nao esta na tela.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 10 * 1024 * 1024

export class UploadLimitError extends Error {
	constructor(public kind: 'image' | 'total') {
		super(kind === 'image' ? 'Imagem acima de 5 MB' : 'Imagens somam mais de 10 MB')
	}
}

function assertWithinUploadLimits(images: ReactNativeFile[]) {
	let total = 0
	for (const image of images) {
		const size = new File(image.uri).size ?? 0
		if (size > MAX_IMAGE_BYTES) throw new UploadLimitError('image')
		total += size
	}
	if (total > MAX_TOTAL_BYTES) throw new UploadLimitError('total')
}

export type FlushOutcome = 'sent' | 'rejected' | 'retry'

export type FlushResult = {
	outcomes: Record<string, FlushOutcome>
	// true se parou antes de acabar (sem rede, sessao expirada, servidor fora)
	stopped: boolean
}

let activeUserId: number | null = null

// Usuario logado: a fila so envia os registros dele (evita enviar na conta errada).
export function setQueueOwner(userId: number | null) {
	activeUserId = userId
}

// Serializa leituras/escritas do AsyncStorage (salvar e sincronizar em paralelo).
let lock: Promise<unknown> = Promise.resolve()

function withLock<T>(task: () => Promise<T>): Promise<T> {
	const run = lock.then(task, task)
	lock = run.catch(() => undefined)
	return run
}

async function readAll(): Promise<PendingRecord[]> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY)
	if (!raw) return []
	try {
		const parsed: unknown = JSON.parse(raw)
		return Array.isArray(parsed) ? (parsed as PendingRecord[]) : []
	} catch {
		return []
	}
}

async function writeAll(records: PendingRecord[]) {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function recordDirectory(clientUuid: string) {
	return new Directory(Paths.document, PENDING_DIR, clientUuid)
}

function removeFiles(clientUuid: string) {
	try {
		const dir = recordDirectory(clientUuid)
		if (dir.exists) dir.delete()
	} catch {
		// Arquivo sobrando e inofensivo; nao deve quebrar o fluxo.
	}
}

// O seletor de imagens devolve arquivos de cache, que o sistema pode apagar.
function persistImages(clientUuid: string, images: ReactNativeFile[]) {
	const dir = recordDirectory(clientUuid)
	dir.create({ intermediates: true, idempotent: true })

	return images.map((image, index) => {
		const extension = image.name.includes('.') ? image.name.split('.').pop() : 'jpg'
		const target = new File(dir, `${index}.${extension}`)
		new File(image.uri).copy(target)
		return { uri: target.uri, name: image.name, type: image.type }
	})
}

export async function enqueueRecord(params: EnqueueParams): Promise<PendingRecord> {
	if (activeUserId === null) {
		throw new Error('Sem usuário ativo para salvar o registro.')
	}

	assertWithinUploadLimits(params.images)

	const clientUuid = randomUUID()
	const userId = activeUserId

	let images: ReactNativeFile[]
	try {
		images = persistImages(clientUuid, params.images)
	} catch (error) {
		removeFiles(clientUuid)
		throw error
	}

	const record: PendingRecord = {
		clientUuid,
		userId,
		latitude: params.latitude,
		longitude: params.longitude,
		behavior: params.behavior,
		dateTime: params.dateTime.toISOString(),
		images,
		status: 'pending',
		attempts: 0,
		lastError: null,
		createdAt: new Date().toISOString(),
	}

	try {
		await withLock(async () => writeAll([...(await readAll()), record]))
	} catch (error) {
		removeFiles(clientUuid)
		throw error
	}

	return record
}

export async function getPendingRecords(userId: number): Promise<PendingRecord[]> {
	return withLock(async () => (await readAll()).filter((r) => r.userId === userId))
}

export async function discardPendingRecord(clientUuid: string) {
	await withLock(async () => {
		const all = await readAll()
		await writeAll(all.filter((r) => r.clientUuid !== clientUuid))
	})
	removeFiles(clientUuid)
}

async function updateRecord(clientUuid: string, patch: Partial<PendingRecord>) {
	await withLock(async () => {
		const all = await readAll()
		await writeAll(
			all.map((r) => (r.clientUuid === clientUuid ? { ...r, ...patch } : r)),
		)
	})
}

// Erros de rede, sessao, timeout, limite e servidor: tenta de novo mais tarde.
// Outros 4xx (ex.: 422): a API recusou o registro, reenviar nao adianta.
function isRetryable(error: unknown) {
	if (!(error instanceof ApiError)) return true
	return error.status === 401 || error.status === 408 || error.status === 429 || error.status >= 500
}

function describeError(error: unknown) {
	return error instanceof ApiError ? `${error.status}: ${error.body}` : 'Sem conexão'
}

let flushing: Promise<FlushResult> | null = null
let flushAgain = false

// Envia os registros pendentes do usuario ativo, um por vez. Uma execucao por vez:
// chamadas simultaneas (rede volta + app abre) compartilham o resultado. Se alguem pede
// um envio durante outro, ele roda de novo ao terminar, para pegar registros que entraram
// na fila depois que o envio em andamento leu a lista.
export function flushPendingRecords(): Promise<FlushResult> {
	if (flushing) {
		flushAgain = true
		return flushing
	}

	flushing = (async () => {
		const merged: FlushResult = { outcomes: {}, stopped: false }
		try {
			do {
				flushAgain = false
				const result = await runFlush()
				Object.assign(merged.outcomes, result.outcomes)
				merged.stopped = result.stopped
			} while (flushAgain && !merged.stopped)
			return merged
		} finally {
			// Sincrono com a checagem acima: quem chegar depois inicia um envio novo.
			flushing = null
		}
	})()

	return flushing
}

async function runFlush(): Promise<FlushResult> {
	const userId = activeUserId
	const result: FlushResult = { outcomes: {}, stopped: false }
	if (userId === null) return result

	const queue = (await getPendingRecords(userId)).filter((r) => r.status === 'pending')

	for (const record of queue) {
		const token = await getAccessToken()
		if (!token) {
			result.stopped = true
			break
		}

		try {
			await uploadRecord({
				token,
				images: record.images,
				latitude: record.latitude,
				longitude: record.longitude,
				behavior: record.behavior,
				dateTime: new Date(record.dateTime),
				clientUuid: record.clientUuid,
			})
		} catch (error) {
			const message = describeError(error)
			const attempts = record.attempts + 1

			if (isRetryable(error)) {
				await updateRecord(record.clientUuid, { attempts, lastError: message })
				result.outcomes[record.clientUuid] = 'retry'
				result.stopped = true
				break
			}

			await updateRecord(record.clientUuid, {
				status: 'failed',
				attempts,
				lastError: message,
			})
			result.outcomes[record.clientUuid] = 'rejected'
			continue
		}

		await discardPendingRecord(record.clientUuid)
		invalidateRecordsCache()
		result.outcomes[record.clientUuid] = 'sent'
	}

	return result
}
