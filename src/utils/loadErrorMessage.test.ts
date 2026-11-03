import { ApiError, RequestTimeoutError } from '../services/apiClient'
import { getLoadErrorMessage } from './loadErrorMessage'

jest.mock('../services/tokenStorage', () => ({
	getRefreshToken: jest.fn(),
	saveTokens: jest.fn(),
	clearTokens: jest.fn(),
}))

const FALLBACK = 'Não foi possível carregar as áreas. Toque em atualizar para tentar de novo.'

describe('getLoadErrorMessage', () => {
	it('esconde mensagens internas do React Native', () => {
		const message = getLoadErrorMessage(new Error('The specified blob is invalid'), FALLBACK)

		expect(message).toBe(FALLBACK)
	})

	it('explica timeout e falta de rede', () => {
		expect(getLoadErrorMessage(new RequestTimeoutError(), FALLBACK)).toContain('demorou demais')
		expect(getLoadErrorMessage(new TypeError('Network request failed'), FALLBACK)).toContain(
			'Sem conexão',
		)
	})

	it('diferencia erros do servidor e de sessão', () => {
		expect(getLoadErrorMessage(new ApiError(503, 'x'), FALLBACK)).toContain('indisponível')
		expect(getLoadErrorMessage(new ApiError(401, 'x'), FALLBACK)).toContain('Entre novamente')
		expect(getLoadErrorMessage(new ApiError(404, 'x'), FALLBACK)).toBe(FALLBACK)
	})
})
