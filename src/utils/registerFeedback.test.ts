import { saveErrorFeedback, savedFeedback, toApiBehaviors } from './registerFeedback'

jest.mock('../services/offlineQueue', () => {
	class UploadLimitError extends Error {
		kind: string
		constructor(kind: string) {
			super('limite')
			this.kind = kind
		}
	}
	return { UploadLimitError }
})

jest.mock('./deviceLocation', () => {
	class LocationUnavailableError extends Error {}
	return { LocationUnavailableError }
})

describe('toApiBehaviors', () => {
	it('converte os rótulos da tela nos valores da API', () => {
		expect(
			toApiBehaviors(['Alimentando', 'Ninhando', 'Voando', 'Vocalizando']),
		).toEqual(['alimentando-se', 'ninhando', 'voando', 'vocalizando'])
	})

	it('descarta comportamentos desconhecidos', () => {
		expect(toApiBehaviors(['Voando', 'Dormindo'])).toEqual(['voando'])
		expect(toApiBehaviors([])).toEqual([])
	})
})

describe('savedFeedback', () => {
	it('informa envio concluído', () => {
		expect(savedFeedback(true)).toMatchObject({
			title: 'Registro enviado',
			iconName: 'checkmark-circle-outline',
		})
	})

	it('informa que o registro ficou no aparelho', () => {
		const feedback = savedFeedback(false)

		expect(feedback.title).toBe('Registro salvo')
		expect(feedback.message).toContain('salvo no aparelho')
	})
})

describe('saveErrorFeedback', () => {
	it('explica o limite de tamanho por imagem', () => {
		const { UploadLimitError } = jest.requireMock('../services/offlineQueue')

		expect(saveErrorFeedback(new UploadLimitError('image'))).toMatchObject({
			title: 'Imagens muito grandes',
			message: 'Cada imagem deve ter no máximo 5 MB.',
		})
	})

	it('explica o limite de tamanho total', () => {
		const { UploadLimitError } = jest.requireMock('../services/offlineQueue')

		expect(saveErrorFeedback(new UploadLimitError('total')).message).toBe(
			'As imagens somam mais de 10 MB. Remova alguma.',
		)
	})

	it('avisa quando a localização do aparelho não está disponível', () => {
		const { LocationUnavailableError } = jest.requireMock('./deviceLocation')

		expect(saveErrorFeedback(new LocationUnavailableError()).title).toBe(
			'Localização indisponível',
		)
	})

	it('usa a mensagem genérica para qualquer outro erro', () => {
		expect(saveErrorFeedback(new Error('x'))).toMatchObject({
			title: 'Falha no envio',
			iconName: 'alert-circle-outline',
		})
	})
})
