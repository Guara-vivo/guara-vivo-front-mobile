import { ApiError, RequestTimeoutError } from '../services/apiClient'

// Traduz falhas de carregamento em texto para o usuario. Mensagens internas do React
// Native ou da API (ex.: "The specified blob is invalid") nao devem chegar a tela.
export function getLoadErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof RequestTimeoutError) {
		return 'A conexão demorou demais. Verifique sua internet e tente atualizar.'
	}

	if (error instanceof ApiError) {
		if (error.status === 401 || error.status === 403) {
			return 'Sua sessão não permite carregar estes dados. Entre novamente.'
		}
		if (error.status >= 500) {
			return 'O servidor está indisponível no momento. Tente atualizar em instantes.'
		}
		return fallback
	}

	if (error instanceof TypeError && /network request failed/i.test(error.message)) {
		return 'Sem conexão com a internet. Verifique sua rede e tente atualizar.'
	}

	return fallback
}
