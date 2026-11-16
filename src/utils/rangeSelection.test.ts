import {
	matchesShortcut,
	pickRangeDay,
	rangeCellKind,
	shortcutRange,
	type DateRange,
} from './rangeSelection'

const d = (day: number, month = 10) => new Date(2026, month, day)
const today = d(16)
const empty: DateRange = { start: null, end: null }

describe('pickRangeDay', () => {
	it('o primeiro toque define o início', () => {
		expect(pickRangeDay(empty, d(12))).toEqual({ start: d(12), end: null })
	})

	it('com início definido, um dia depois define o fim', () => {
		expect(pickRangeDay({ start: d(12), end: null }, d(15))).toEqual({ start: d(12), end: d(15) })
	})

	it('tocar no mesmo dia do início vale um dia só', () => {
		expect(pickRangeDay({ start: d(12), end: null }, d(12))).toEqual({ start: d(12), end: d(12) })
	})

	it('tocar antes do início recomeça a faixa nesse dia (nunca início maior que o fim)', () => {
		expect(pickRangeDay({ start: d(12), end: null }, d(10))).toEqual({ start: d(10), end: null })
	})

	it('com a faixa completa, um novo toque recomeça só com o início', () => {
		expect(pickRangeDay({ start: d(12), end: d(15) }, d(14))).toEqual({ start: d(14), end: null })
	})

	it('funciona entre meses', () => {
		expect(pickRangeDay({ start: d(28, 9), end: null }, d(3, 10))).toEqual({
			start: d(28, 9),
			end: d(3, 10),
		})
	})
})

describe('rangeCellKind', () => {
	const range: DateRange = { start: d(12), end: d(15) }

	it('marca início, fim e meio', () => {
		expect(rangeCellKind(range, d(12))).toBe('start')
		expect(rangeCellKind(range, d(15))).toBe('end')
		expect(rangeCellKind(range, d(13))).toBe('middle')
		expect(rangeCellKind(range, d(14))).toBe('middle')
	})

	it('dia fora da faixa é null', () => {
		expect(rangeCellKind(range, d(11))).toBeNull()
		expect(rangeCellKind(range, d(16))).toBeNull()
	})

	it('faixa de um dia é single', () => {
		expect(rangeCellKind({ start: d(12), end: d(12) }, d(12))).toBe('single')
	})

	it('só com início, o início é single e o resto é null', () => {
		expect(rangeCellKind({ start: d(12), end: null }, d(12))).toBe('single')
		expect(rangeCellKind({ start: d(12), end: null }, d(13))).toBeNull()
	})

	it('sem início nada é marcado', () => {
		expect(rangeCellKind(empty, d(12))).toBeNull()
	})

	it('ignora o horário do dia', () => {
		expect(rangeCellKind({ start: d(12), end: d(15) }, new Date(2026, 10, 13, 18, 30))).toBe('middle')
	})
})

describe('shortcutRange', () => {
	it('7 dias: hoje e os 6 anteriores', () => {
		expect(shortcutRange('last7', today)).toEqual({ start: d(10), end: d(16) })
	})

	it('30 dias: hoje e os 29 anteriores', () => {
		expect(shortcutRange('last30', today)).toEqual({ start: d(18, 9), end: d(16) })
	})

	it('este mês: do dia 1 até hoje', () => {
		expect(shortcutRange('thisMonth', today)).toEqual({ start: d(1), end: d(16) })
	})

	it('este mês no dia 1 é um dia só', () => {
		expect(shortcutRange('thisMonth', d(1))).toEqual({ start: d(1), end: d(1) })
	})
})

describe('matchesShortcut', () => {
	it('é true só quando início e fim batem com o atalho', () => {
		expect(matchesShortcut({ start: d(10), end: d(16) }, 'last7', today)).toBe(true)
		expect(matchesShortcut({ start: d(10), end: d(15) }, 'last7', today)).toBe(false)
		expect(matchesShortcut({ start: d(10), end: null }, 'last7', today)).toBe(false)
		expect(matchesShortcut(empty, 'last30', today)).toBe(false)
	})
})
