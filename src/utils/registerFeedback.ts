import { colors } from '../constants/theme'
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
	return {
		title: wasSent ? 'Registro enviado' : 'Registro salvo',
		message: wasSent
			? 'Registro enviado para processamento com sucesso.'
			: 'Não foi possível enviar agora. O registro foi salvo no aparelho e será enviado automaticamente.',
		iconName: 'checkmark-circle-outline',
		iconColor: colors.secondary,
	}
}

// Traduz uma falha do envio na mensagem mostrada ao usuário.
export function saveErrorFeedback(error: unknown): RegisterFeedback {
	if (error instanceof UploadLimitError) {
		return errorFeedback(
			'Imagens muito grandes',
			error.kind === 'image'
				? 'Cada imagem deve ter no máximo 5 MB.'
				: 'As imagens somam mais de 10 MB. Remova alguma.',
		)
	}

	if (error instanceof LocationUnavailableError) {
		return errorFeedback(
			'Localização indisponível',
			'Não foi possível obter a localização do aparelho. Escolha o local no mapa ou tente de novo em um lugar com sinal de GPS.',
		)
	}

	return errorFeedback(
		'Falha no envio',
		'Não foi possível enviar o registro. Tente novamente.',
	)
}
