import { colors } from '../constants/theme'
import i18n from '../i18n'
import { UploadLimitError } from '../services/offlineQueue'
import type { BirdBehavior } from '../types/api'
import { LocationUnavailableError } from './deviceLocation'

export type RegisterFeedback = {
	title: string
	message: string
	iconName: 'alert-circle-outline' | 'checkmark-circle-outline'
	iconColor: string
}

const behaviorApiMap: Partial<Record<string, BirdBehavior>> = {
	Alimentando: 'alimentando-se',
	Ninhando: 'ninhando',
	Voando: 'voando',
	Vocalizando: 'vocalizando',
}

// Converte os rótulos da tela nos valores da API, descartando os desconhecidos.
export function toApiBehaviors(behaviors: string[]): BirdBehavior[] {
	return behaviors
		.map((behavior) => behaviorApiMap[behavior])
		.filter((behavior): behavior is BirdBehavior => Boolean(behavior))
}

export function errorFeedback(title: string, message: string): RegisterFeedback {
	return {
		title,
		message,
		iconName: 'alert-circle-outline',
		iconColor: colors.primary,
	}
}

export function savedFeedback(wasSent: boolean): RegisterFeedback {
	const key = wasSent ? 'register:feedback.sent' : 'register:feedback.saved'

	return {
		title: i18n.t(`${key}.title`),
		message: i18n.t(`${key}.message`),
		iconName: 'checkmark-circle-outline',
		iconColor: colors.secondary,
	}
}

// Traduz uma falha do envio na mensagem mostrada ao usuário.
export function saveErrorFeedback(error: unknown): RegisterFeedback {
	if (error instanceof UploadLimitError) {
		return keyedErrorFeedback(
			error.kind === 'image' ? 'register:feedback.uploadImage' : 'register:feedback.uploadTotal',
		)
	}

	if (error instanceof LocationUnavailableError) {
		return keyedErrorFeedback('register:feedback.locationUnavailable')
	}

	return keyedErrorFeedback('register:feedback.sendFailed')
}

// Mensagem de erro a partir de um par de textos `<chave>.title` e `<chave>.message`.
function keyedErrorFeedback(key: string): RegisterFeedback {
	return errorFeedback(i18n.t(`${key}.title`), i18n.t(`${key}.message`))
}
