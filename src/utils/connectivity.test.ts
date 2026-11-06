import { isOnlineState } from './connectivity'

describe('isOnlineState', () => {
	it('é online com conexão e internet alcançável ou ainda desconhecida', () => {
		expect(isOnlineState({ isConnected: true, isInternetReachable: true })).toBe(true)
		expect(isOnlineState({ isConnected: true, isInternetReachable: null })).toBe(true)
		expect(isOnlineState({ isConnected: true })).toBe(true)
	})

	it('é offline sem conexão ou com internet inalcançável', () => {
		expect(isOnlineState({ isConnected: false, isInternetReachable: false })).toBe(false)
		expect(isOnlineState({ isConnected: null })).toBe(false)
		expect(isOnlineState({ isConnected: true, isInternetReachable: false })).toBe(false)
	})
})
