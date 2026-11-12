import { ApiError, RequestTimeoutError } from '../services/apiClient'
import { getLoginErrorFeedback } from './loginErrorMessage'

// apiClient importa tokenStorage, que usa o AsyncStorage nativo (indisponível no Jest).
jest.mock('../services/tokenStorage', () => ({
	getRefreshToken: jest.fn(),
	saveTokens: jest.fn(),
	clearTokens: jest.fn(),
}))

describe('getLoginErrorFeedback', () => {
	it('trata resposta da API abaixo de 500 como credenciais erradas', () => {
		for (const status of [400, 401, 403, 422]) {
			expect(getLoginErrorFeedback(new ApiError(status, 'x')).title).toBe('Falha no login')
		}
	})

	it('trata 5xx como servidor indisponível', () => {
		for (const status of [500, 502, 503]) {
			expect(getLoginErrorFeedback(new ApiError(status, 'x')).title).toBe(
				'Servidor indisponível',
			)
		}
	})

	it('trata timeout como conexão lenta', () => {
		expect(getLoginErrorFeedback(new RequestTimeoutError()).title).toBe('Conexão lenta')
	})

	it('trata falha de rede como sem conexão', () => {
		expect(getLoginErrorFeedback(new TypeError('Network request failed')).title).toBe(
			'Sem conexão',
		)
	})

	it('trata erro local (ex.: gravar tokens) sem culpar a internet', () => {
		const feedback = getLoginErrorFeedback(new Error('SecureStore falhou'))

		expect(feedback.title).toBe('Não foi possível entrar')
		expect(feedback.message).not.toMatch(/internet|conexão/i)
	})

	it('trata valores que não são Error como erro local', () => {
		expect(getLoginErrorFeedback('boom').title).toBe('Não foi possível entrar')
		expect(getLoginErrorFeedback(undefined).title).toBe('Não foi possível entrar')
	})

	it('usa um texto diferente para cada situação e nunca expõe a mensagem interna', () => {
		const feedbacks = [
			getLoginErrorFeedback(new ApiError(401, 'segredo-interno')),
			getLoginErrorFeedback(new ApiError(503, 'segredo-interno')),
			getLoginErrorFeedback(new RequestTimeoutError()),
			getLoginErrorFeedback(new TypeError('Network request failed')),
			getLoginErrorFeedback(new Error('segredo-interno')),
		]

		expect(new Set(feedbacks.map((f) => f.message)).size).toBe(feedbacks.length)
		for (const f of feedbacks) {
			expect(`${f.title} ${f.message}`).not.toMatch(/segredo-interno|Network request failed/)
		}
	})
})
