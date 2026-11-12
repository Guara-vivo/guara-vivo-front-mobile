import { ApiError, RequestTimeoutError, isNetworkFailure } from '../services/apiClient'

export type LoginFeedback = { title: string; message: string }

// Traduz a falha do login em texto para a pessoa, separando credenciais, rede, lentidão,
// servidor fora do ar e erro no próprio aparelho. Nunca devolve a mensagem interna do erro.
export function getLoginErrorFeedback(error: unknown): LoginFeedback {
	if (error instanceof ApiError) {
		if (error.status >= 500) {
			return {
				title: 'Servidor indisponível',
				message: 'O servidor está indisponível no momento. Tente novamente em instantes.',
			}
		}
		return {
			title: 'Falha no login',
			message: 'Confira e-mail e senha e tente novamente.',
		}
	}

	if (error instanceof RequestTimeoutError) {
		return {
			title: 'Conexão lenta',
			message: 'A conexão demorou demais. Verifique sua internet e tente novamente.',
		}
	}

	if (isNetworkFailure(error)) {
		return {
			title: 'Sem conexão',
			message:
				'Não foi possível acessar o servidor. Verifique o Wi-Fi ou os dados móveis e tente novamente.',
		}
	}

	return {
		title: 'Não foi possível entrar',
		message:
			'Algo deu errado ao concluir o login neste aparelho. Tente novamente; se continuar, feche e abra o app.',
	}
}
