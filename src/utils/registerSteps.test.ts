import { canAdvance } from './registerSteps'

const base = { imageCount: 1, behaviors: ['Ninhando'], hasLocation: true, dateTimeValid: true }

describe('canAdvance', () => {
	it('passo 1 exige pelo menos uma foto', () => {
		expect(canAdvance(1, { ...base, imageCount: 0 })).toBe(false)
		expect(canAdvance(1, { ...base, imageCount: 1 })).toBe(true)
	})

	it('passo 2 exige pelo menos um comportamento', () => {
		expect(canAdvance(2, { ...base, behaviors: [] })).toBe(false)
		expect(canAdvance(2, base)).toBe(true)
	})

	it('passo 3 exige local e data/hora válidos', () => {
		expect(canAdvance(3, { ...base, hasLocation: false })).toBe(false)
		expect(canAdvance(3, { ...base, dateTimeValid: false })).toBe(false)
		expect(canAdvance(3, base)).toBe(true)
	})

	it('cada passo olha só os seus requisitos', () => {
		expect(canAdvance(1, { imageCount: 2, behaviors: [], hasLocation: false, dateTimeValid: false })).toBe(true)
	})
})
