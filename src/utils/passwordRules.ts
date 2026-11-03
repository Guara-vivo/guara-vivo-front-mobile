// Regra única de senha do app (cadastro e troca de senha).
export const MIN_PASSWORD_LENGTH = 6

export const PASSWORD_RULE_HINT = `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`

export function isPasswordLongEnough(password: string) {
	return password.length >= MIN_PASSWORD_LENGTH
}

// Mensagem de apoio sob o campo de nova senha; vazia enquanto nada foi digitado.
export function getPasswordHint(password: string) {
	if (!password) return ''
	return isPasswordLongEnough(password) ? 'Senha válida' : PASSWORD_RULE_HINT
}
