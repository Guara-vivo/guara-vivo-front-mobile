import i18n from '../i18n'
import { ApiError, RequestTimeoutError, isNetworkFailure } from '../services/apiClient'

// Traduz falhas de carregamento em texto para o usuario. Mensagens internas do React
// Native ou da API (ex.: "The specified blob is invalid") nao devem chegar a tela.
export function getLoadErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof RequestTimeoutError) {
		return i18n.t('common:loadError.timeout')
	}

	if (error instanceof ApiError) {
		if (error.status === 401 || error.status === 403) {
			return i18n.t('common:loadError.session')
		}
		if (error.status >= 500) {
			return i18n.t('common:loadError.server')
		}
		return fallback
	}

	if (isNetworkFailure(error)) {
		return i18n.t('common:loadError.offline')
	}

	return fallback
}
