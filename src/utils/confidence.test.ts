import { averageScore, formatPercent, getConfidenceLevel, isLowScore } from './confidence'

describe('getConfidenceLevel', () => {
	it('classifica pelos limites 0,85 e 0,7', () => {
		expect(getConfidenceLevel(0.85)).toBe('alta')
		expect(getConfidenceLevel(1)).toBe('alta')
		expect(getConfidenceLevel(0.8499)).toBe('media')
		expect(getConfidenceLevel(0.7)).toBe('media')
		expect(getConfidenceLevel(0.6999)).toBe('baixa')
		expect(getConfidenceLevel(0)).toBe('baixa')
	})

	it('trata valores fora de 0 a 1 e NaN como baixa', () => {
		expect(getConfidenceLevel(1.2)).toBe('baixa')
		expect(getConfidenceLevel(-0.1)).toBe('baixa')
		expect(getConfidenceLevel(Number.NaN)).toBe('baixa')
	})
})

describe('isLowScore', () => {
	it('é verdadeiro abaixo de 0,7', () => {
		expect(isLowScore(0.69)).toBe(true)
		expect(isLowScore(0.7)).toBe(false)
		expect(isLowScore(1)).toBe(false)
	})
})

describe('formatPercent', () => {
	it('arredonda para porcentagem inteira', () => {
		expect(formatPercent(0.934)).toBe('93%')
		expect(formatPercent(1)).toBe('100%')
		expect(formatPercent(0)).toBe('0%')
	})

	it('nunca mostra NaN%', () => {
		expect(formatPercent(undefined)).toBe('–')
		expect(formatPercent(null)).toBe('–')
		expect(formatPercent(Number.NaN)).toBe('–')
	})
})

describe('averageScore', () => {
	it('tira a média das notas válidas', () => {
		expect(averageScore([0.9, 0.7])).toBeCloseTo(0.8)
		expect(averageScore([0.9, undefined, Number.NaN, 0.5])).toBeCloseTo(0.7)
	})

	it('devolve null quando não há nota válida', () => {
		expect(averageScore([])).toBeNull()
		expect(averageScore([undefined, null, Number.NaN])).toBeNull()
	})
})
