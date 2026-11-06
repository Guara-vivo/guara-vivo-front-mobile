import { formatLongDate } from './timeFormatters'

describe('formatLongDate', () => {
	it('escreve dia da semana, dia e mês por extenso', () => {
		expect(formatLongDate(new Date(2026, 10, 4))).toBe('Quarta-feira, 4 de novembro')
	})

	it('cobre domingo e sábado', () => {
		expect(formatLongDate(new Date(2026, 10, 1))).toBe('Domingo, 1 de novembro')
		expect(formatLongDate(new Date(2026, 7, 1))).toBe('Sábado, 1 de agosto')
	})
})
