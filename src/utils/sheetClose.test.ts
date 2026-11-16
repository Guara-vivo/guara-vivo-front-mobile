import { shouldCloseOnRelease } from './sheetClose'

// Contêiner de 1600 px: `toPosition` da parada "fechada" é 1600. A parada baixa (35%) fica em 1040
// e a folha tem 560 px ali; o limite de fechamento é 40% disso (224 px abaixo de 1040).
const closing = { toIndex: -1, toPosition: 1600 }

describe('shouldCloseOnRelease', () => {
	it('fecha ao soltar 260 px abaixo da parada baixa (acima do limite de 224 px)', () => {
		expect(shouldCloseOnRelease({ ...closing, fromIndex: 0, fromPosition: 1300 })).toBe(true)
	})

	it('cancela o fechamento num arrasto curto (160 px) a partir da parada baixa', () => {
		expect(shouldCloseOnRelease({ ...closing, fromIndex: 0, fromPosition: 1200 })).toBe(false)
	})

	it('cancela o fechamento de um arrasto rápido que veio de 80% e soltou acima da parada baixa', () => {
		expect(shouldCloseOnRelease({ ...closing, fromIndex: 1, fromPosition: 900 })).toBe(false)
	})

	it('cancela quando soltou exatamente na parada baixa', () => {
		expect(shouldCloseOnRelease({ ...closing, fromIndex: 0, fromPosition: 1040 })).toBe(false)
	})

	it('fecha num arrasto longo e deliberado vindo de 80%', () => {
		expect(shouldCloseOnRelease({ ...closing, fromIndex: 1, fromPosition: 1300 })).toBe(true)
	})

	it('não interfere na animação de abertura (índice -1 para 0)', () => {
		expect(
			shouldCloseOnRelease({ fromIndex: -1, toIndex: 0, fromPosition: 1600, toPosition: 1040 }),
		).toBe(false)
	})

	it('não interfere ao subir ou trocar de parada', () => {
		expect(
			shouldCloseOnRelease({ fromIndex: 0, toIndex: 1, fromPosition: 1100, toPosition: 320 }),
		).toBe(false)
	})
})
