import { shouldCloseOnRelease } from './sheetClose'

const base = { sheetHeight: 500 }

describe('shouldCloseOnRelease', () => {
	it('fecha ao soltar 200 px abaixo da parada baixa (limite de 40% da folha)', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 0, toIndex: 0, fromPosition: 1000, toPosition: 800 }),
		).toBe(true)
	})

	it('não fecha com arrasto curto (150 px) a partir da parada baixa', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 0, toIndex: 0, fromPosition: 950, toPosition: 800 }),
		).toBe(false)
	})

	it('não fecha ao vir de 80% e passar só 100 px da parada baixa', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 1, toIndex: 0, fromPosition: 900, toPosition: 800 }),
		).toBe(false)
	})

	it('fecha em arrasto longo e deliberado a partir de 80%', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 1, toIndex: 0, fromPosition: 1100, toPosition: 800 }),
		).toBe(true)
	})

	it('não fecha ao subir', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 0, toIndex: 1, fromPosition: 900, toPosition: 300 }),
		).toBe(false)
	})

	it('não fecha quando não houve arrasto', () => {
		expect(
			shouldCloseOnRelease({ ...base, fromIndex: 0, toIndex: 0, fromPosition: 800, toPosition: 800 }),
		).toBe(false)
	})
})
