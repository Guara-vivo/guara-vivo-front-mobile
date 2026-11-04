import { formatRelativeDay } from './dayLabels'

const now = new Date(2026, 10, 4, 12, 0, 0)

describe('formatRelativeDay', () => {
	it('usa Hoje e Ontem', () => {
		expect(formatRelativeDay(new Date(2026, 10, 4, 0, 5).toISOString(), now)).toBe('Hoje')
		expect(formatRelativeDay(new Date(2026, 10, 3, 23, 50).toISOString(), now)).toBe('Ontem')
	})

	it('escreve dia e mês, com ano só se diferente do atual', () => {
		expect(formatRelativeDay(new Date(2026, 6, 31, 20, 29).toISOString(), now)).toBe('31 de julho')
		expect(formatRelativeDay(new Date(2025, 6, 31, 20, 29).toISOString(), now)).toBe(
			'31 de julho de 2025',
		)
	})

	it('devolve texto neutro para data inválida', () => {
		expect(formatRelativeDay('lixo', now)).toBe('Data inválida')
	})
})
