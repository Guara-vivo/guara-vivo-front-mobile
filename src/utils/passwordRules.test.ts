import {
	getPasswordRuleStatus,
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

describe('getPasswordRuleStatus', () => {
	it('minLength é falso com 7 caracteres e verdadeiro com 8', () => {
		expect(getPasswordRuleStatus('1234567', '1234567').minLength).toBe(false)
		expect(getPasswordRuleStatus('12345678', '12345678').minLength).toBe(true)
	})

	it('withinByteLimit é falso com 73 bytes ASCII', () => {
		expect(getPasswordRuleStatus('a'.repeat(73), '').withinByteLimit).toBe(false)
		expect(getPasswordRuleStatus('a'.repeat(72), '').withinByteLimit).toBe(true)
	})

	it('withinByteLimit conta bytes UTF-8: 37 caracteres "ç" são 74 bytes', () => {
		expect(getPasswordRuleStatus('ç'.repeat(37), '').withinByteLimit).toBe(false)
		expect(getPasswordRuleStatus('ç'.repeat(36), '').withinByteLimit).toBe(true)
	})

	it('matches é falso com confirmação vazia e verdadeiro com senhas iguais', () => {
		expect(getPasswordRuleStatus('12345678', '').matches).toBe(false)
		expect(getPasswordRuleStatus('12345678', '12345679').matches).toBe(false)
		expect(getPasswordRuleStatus('12345678', '12345678').matches).toBe(true)
	})

	it('senha vazia não casa com confirmação vazia', () => {
		expect(getPasswordRuleStatus('', '').matches).toBe(false)
	})
})
