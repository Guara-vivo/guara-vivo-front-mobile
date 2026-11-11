// Lê o `exp` de um JWT sem validar a assinatura (quem valida é o servidor). Serve só para
// decidir se vale renovar o token antes de uma requisição pesada, como o envio da fila.

function decodeBase64Url(value: string): string | null {
	try {
		const padded = value.replace(/-/g, '+').replace(/_/g, '/')
		return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
	} catch {
		return null
	}
}

// Instante de expiração em ms, ou null se o token não for um JWT legível.
export function getTokenExpiryMs(token: string): number | null {
	const payload = token.split('.')[1]
	if (!payload) {
		return null
	}

	const json = decodeBase64Url(payload)
	if (!json) {
		return null
	}

	try {
		const exp = (JSON.parse(json) as { exp?: unknown }).exp
		return typeof exp === 'number' ? exp * 1000 : null
	} catch {
		return null
	}
}

// Token ilegível conta como vencido: renovar a mais é inofensivo, enviar com token
// vencido não é (um upload de 120 s que volta 401).
export function isAccessTokenFresh(token: string, now: number, marginMs = 60000) {
	const expiry = getTokenExpiryMs(token)
	return expiry !== null && expiry - marginMs > now
}
