import i18n from '../i18n'
import { WARNING_CODES } from './analysisWarningCodes'

// A API manda só códigos (`status_analise`, `avisos`); o texto ao usuário é daqui.

export type AnalysisStatus = 'ok' | 'atencao' | 'sem_ave' | 'sem_guara'

const WARNING_KEYS: Record<string, string> = {
	[WARNING_CODES.noBird]: 'noBird',
	[WARNING_CODES.noIbis]: 'noIbis',
	[WARNING_CODES.lifeStageUncertain]: 'lifeStageUncertain',
	[WARNING_CODES.birdTooSmall]: 'birdTooSmall',
	[WARNING_CODES.maskUnavailable]: 'maskUnavailable',
}

export function getWarningMessage(code: string): string {
	return i18n.t(`detail:warnings.${WARNING_KEYS[code] ?? 'generic'}`)
}

// Aceita lista ausente, nula ou com itens inválidos (registros antigos não têm o campo).
export function normalizeWarnings(avisos: unknown): string[] {
	if (!Array.isArray(avisos)) return []
	return avisos.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

// Mensagens sem repetição, na ordem em que a API mandou.
export function getWarningMessages(avisos: unknown): string[] {
	const messages = normalizeWarnings(avisos).map(getWarningMessage)
	return messages.filter((message, index) => messages.indexOf(message) === index)
}

export function normalizeAnalysisStatus(status: unknown): AnalysisStatus | null {
	return status === 'ok' || status === 'atencao' || status === 'sem_ave' || status === 'sem_guara'
		? status
		: null
}

// `raw_result` da imagem é um texto JSON; a raiz da análise fica em `result`.
export function parseImageResult(rawResult: unknown): {
	status: AnalysisStatus | null
	avisos: string[]
} {
	let parsed: unknown = rawResult
	if (typeof rawResult === 'string') {
		try {
			parsed = JSON.parse(rawResult)
		} catch {
			parsed = null
		}
	}
	const result =
		parsed && typeof parsed === 'object' ? (parsed as { result?: unknown }).result : null
	const root = result && typeof result === 'object' ? (result as Record<string, unknown>) : {}
	return {
		status: normalizeAnalysisStatus(root.status_analise),
		avisos: normalizeWarnings(root.avisos),
	}
}

// Status que pede aviso na tela. Sem status (registro antigo) com avisos também conta.
export function needsAttention(status: unknown, avisos: unknown): boolean {
	const normalized = normalizeAnalysisStatus(status)
	if (normalized) return normalized !== 'ok'
	return normalizeWarnings(avisos).length > 0
}
