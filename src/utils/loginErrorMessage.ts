import i18n from '../i18n'
import { ApiError, RequestTimeoutError, isNetworkFailure } from '../services/apiClient'

export type LoginFeedback = { title: string; message: string }

function feedback(kind: string): LoginFeedback {
	return {
		title: i18n.t(`auth:loginError.${kind}.title`),
		message: i18n.t(`auth:loginError.${kind}.message`),
	}
}

// Traduz a falha do login em texto para a pessoa, separando credenciais, rede, lentidão,
// servidor fora do ar e erro no próprio aparelho. Nunca devolve a mensagem interna do erro.
export function getLoginErrorFeedback(error: unknown): LoginFeedback {
	if (error instanceof ApiError) {
		return feedback(error.status >= 500 ? 'server' : 'credentials')
	}

	if (error instanceof RequestTimeoutError) {
		return feedback('slow')
	}

	if (isNetworkFailure(error)) {
		return feedback('offline')
	}

	return feedback('unknown')
}
