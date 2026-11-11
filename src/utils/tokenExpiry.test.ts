import { getTokenExpiryMs, isAccessTokenFresh } from './tokenExpiry'

function jwt(payload: object) {
	const encode = (value: object) =>
		Buffer.from(JSON.stringify(value)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
	return `${encode({ alg: 'HS256' })}.${encode(payload)}.assinatura`
}

describe('tokenExpiry', () => {
	it('lê o exp em milissegundos', () => {
		expect(getTokenExpiryMs(jwt({ exp: 2000 }))).toBe(2000000)
	})

	it('devolve null para token que não é JWT', () => {
		expect(getTokenExpiryMs('opaco')).toBeNull()
		expect(getTokenExpiryMs('a.%%%.c')).toBeNull()
		expect(getTokenExpiryMs(jwt({ sub: '1' }))).toBeNull()
	})

	it('considera vencido o token dentro da margem ou ilegível', () => {
		const now = 1000000
		expect(isAccessTokenFresh(jwt({ exp: 2000 }), now)).toBe(true)
		expect(isAccessTokenFresh(jwt({ exp: 1030 }), now)).toBe(false)
		expect(isAccessTokenFresh(jwt({ exp: 900 }), now)).toBe(false)
		expect(isAccessTokenFresh('opaco', now)).toBe(false)
	})
})
