import i18n from '../i18n'

// Regra única de senha do app (cadastro e troca de senha), alinhada à API:
// mínimo de 8 caracteres e máximo de 72 BYTES em UTF-8 (acentos contam mais de 1).
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_BYTES = 72

// Textos em função (e não em constante) para acompanharem o idioma ativo.
export const getPasswordRuleHint = () => i18n.t('auth:hint.minLength', { min: MIN_PASSWORD_LENGTH })
export const getPasswordTooLongHint = () => i18n.t('auth:hint.tooLong', { max: MAX_PASSWORD_BYTES })

// Tamanho em bytes UTF-8, sem depender de TextEncoder (nem sempre presente no Hermes).
export function getPasswordByteLength(password: string) {
	let bytes = 0

	for (const char of password) {
		const codePoint = char.codePointAt(0) ?? 0

		if (codePoint < 0x80) bytes += 1
		else if (codePoint < 0x800) bytes += 2
		else if (codePoint < 0x10000) bytes += 3
		else bytes += 4
	}

	return bytes
}

export function isPasswordLongEnough(password: string) {
	return password.length >= MIN_PASSWORD_LENGTH
}

export function isPasswordWithinLimit(password: string) {
	return getPasswordByteLength(password) <= MAX_PASSWORD_BYTES
}

export function isPasswordValid(password: string) {
	return isPasswordLongEnough(password) && isPasswordWithinLimit(password)
}

// Mensagem de apoio sob o campo de nova senha; vazia enquanto nada foi digitado.
export function getPasswordHint(password: string) {
	if (!password) return ''
	if (!isPasswordLongEnough(password)) return getPasswordRuleHint()
	return isPasswordWithinLimit(password) ? i18n.t('auth:hint.valid') : getPasswordTooLongHint()
}

export type PasswordRuleStatus = {
	minLength: boolean
	matches: boolean
	withinByteLimit: boolean
}

// Estado de cada regra para a lista que acende no cadastro e na troca de senha.
export function getPasswordRuleStatus(password: string, confirm: string): PasswordRuleStatus {
	return {
		minLength: isPasswordLongEnough(password),
		matches: password.length > 0 && password === confirm,
		withinByteLimit: isPasswordWithinLimit(password),
	}
}
