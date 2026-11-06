import { formatInputDate, parseInputDate } from './inputDate'

describe('parseInputDate', () => {
	it('lê uma data válida', () => {
		const date = parseInputDate('05/11/2026')

		expect(date?.getFullYear()).toBe(2026)
		expect(date?.getMonth()).toBe(10)
		expect(date?.getDate()).toBe(5)
	})

	it('devolve null para vazio, formato errado e datas impossíveis', () => {
		expect(parseInputDate('')).toBeNull()
		expect(parseInputDate('5/11/2026')).toBeNull()
		expect(parseInputDate('32/01/2026')).toBeNull()
		expect(parseInputDate('30/02/2026')).toBeNull()
	})
})

describe('formatInputDate', () => {
	it('formata como dd/mm/aaaa com zeros à esquerda', () => {
		expect(formatInputDate(new Date(2026, 0, 3))).toBe('03/01/2026')
	})

	it('é o inverso de parseInputDate', () => {
		expect(formatInputDate(parseInputDate('31/12/2025') as Date)).toBe('31/12/2025')
	})
})
