import {
	getPasswordByteLength,
	getPasswordHint,
	isPasswordLongEnough,
	isPasswordValid,
	isPasswordWithinLimit,
	MAX_PASSWORD_BYTES,
	MIN_PASSWORD_LENGTH,
	PASSWORD_RULE_HINT,
	PASSWORD_TOO_LONG_HINT,
} from './passwordRules'

describe('passwordRules', () => {
	it('exige o tamanho mínimo', () => {
		expect(isPasswordLongEnough('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe(false)
		expect(isPasswordLongEnough('a'.repeat(MIN_PASSWORD_LENGTH))).toBe(true)
	})

	it('conta o tamanho em bytes UTF-8', () => {
		expect(getPasswordByteLength('abc')).toBe(3)
		expect(getPasswordByteLength('ação')).toBe(6)
		expect(getPasswordByteLength('€')).toBe(3)
		expect(getPasswordByteLength('😀')).toBe(4)
	})

	it('limita a senha a 72 bytes', () => {
		expect(isPasswordWithinLimit('a'.repeat(MAX_PASSWORD_BYTES))).toBe(true)
		expect(isPasswordWithinLimit('a'.repeat(MAX_PASSWORD_BYTES + 1))).toBe(false)
		// 40 caracteres, mas 80 bytes.
		expect(isPasswordWithinLimit('ã'.repeat(40))).toBe(false)
		expect(isPasswordValid('ã'.repeat(40))).toBe(false)
		expect(isPasswordValid('senha1234')).toBe(true)
		expect(isPasswordValid('curta')).toBe(false)
	})

	it('só mostra dica depois de digitar', () => {
		expect(getPasswordHint('')).toBe('')
		expect(getPasswordHint('abc')).toBe(PASSWORD_RULE_HINT)
		expect(getPasswordHint('abcdefgh')).toBe('Senha válida')
		expect(getPasswordHint('ã'.repeat(40))).toBe(PASSWORD_TOO_LONG_HINT)
	})
})
