import { WARNING_CODES } from './analysisWarningCodes'

// A API manda só códigos (`status_analise`, `avisos`); o texto ao usuário é daqui.

export type AnalysisStatus = 'ok' | 'atencao' | 'sem_ave' | 'sem_guara'

const GENERIC_WARNING =
	'A foto não está nas melhores condições. Tente uma mais próxima e com boa luz.'

const WARNING_MESSAGES: Record<string, string> = {
	[WARNING_CODES.noBird]:
		'Não encontramos nenhuma ave nesta foto. Tente uma foto mais próxima e com boa luz.',
	[WARNING_CODES.noIbis]:
		'Encontramos aves, mas nenhum guará-vermelho. Tente uma foto mais próxima e com boa luz.',
	[WARNING_CODES.lifeStageUncertain]: 'Não deu para saber a fase da vida deste guará.',
	[WARNING_CODES.birdTooSmall]: 'A ave está muito pequena na foto. Chegue mais perto para fotografar.',
	[WARNING_CODES.maskUnavailable]: 'Não conseguimos analisar a plumagem deste guará.',
}

export function getWarningMessage(code: string): string {
	return WARNING_MESSAGES[code] ?? GENERIC_WARNING
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
