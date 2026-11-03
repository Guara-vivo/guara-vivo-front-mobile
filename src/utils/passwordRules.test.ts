import {
	getPasswordHint,
	isPasswordLongEnough,
	MIN_PASSWORD_LENGTH,
	PASSWORD_RULE_HINT,
} from './passwordRules'

describe('passwordRules', () => {
	it('exige o tamanho mínimo', () => {
		expect(isPasswordLongEnough('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe(false)
		expect(isPasswordLongEnough('a'.repeat(MIN_PASSWORD_LENGTH))).toBe(true)
	})

	it('só mostra dica depois de digitar', () => {
		expect(getPasswordHint('')).toBe('')
		expect(getPasswordHint('abc')).toBe(PASSWORD_RULE_HINT)
		expect(getPasswordHint('abcdef')).toBe('Senha válida')
	})
})
