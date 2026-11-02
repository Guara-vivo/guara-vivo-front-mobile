import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveAccessToken,
	saveTokens,
} from './tokenStorage'

const mockSecure = new Map<string, string>()
const mockAsync = new Map<string, string>()
let mockSecureReadsEmpty = false
let mockSecureThrows = false

jest.mock('expo-secure-store', () => ({
	setItemAsync: jest.fn(async (key: string, value: string) => {
		if (mockSecureThrows) throw new Error('keystore unavailable')
		mockSecure.set(key, value)
	}),
	getItemAsync: jest.fn(async (key: string) => {
		if (mockSecureThrows) throw new Error('keystore unavailable')
		return mockSecureReadsEmpty ? null : (mockSecure.get(key) ?? null)
	}),
	deleteItemAsync: jest.fn(async (key: string) => {
		mockSecure.delete(key)
	}),
}))
jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		getItem: jest.fn(async (key: string) => mockAsync.get(key) ?? null),
		setItem: jest.fn(async (key: string, value: string) => {
			mockAsync.set(key, value)
		}),
		removeItem: jest.fn(async (key: string) => {
			mockAsync.delete(key)
		}),
		multiRemove: jest.fn(async (keys: string[]) => {
			keys.forEach((key) => mockAsync.delete(key))
		}),
	},
}))

beforeEach(async () => {
	await clearTokens()
	mockSecure.clear()
	mockAsync.clear()
	mockSecureReadsEmpty = false
	mockSecureThrows = false
})

describe('tokenStorage', () => {
	it('keeps tokens in SecureStore when it reads them back', async () => {
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })

		expect(await getAccessToken()).toBe('a')
		expect(await getRefreshToken()).toBe('r')
		expect(mockAsync.size).toBe(0)
	})

	it('never writes tokens to AsyncStorage when SecureStore reads back empty', async () => {
		mockSecureReadsEmpty = true
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })

		expect(mockAsync.size).toBe(0)
		expect(await getAccessToken()).toBe('a')
		expect(await getRefreshToken()).toBe('r')
	})

	it('never writes tokens to AsyncStorage when SecureStore throws', async () => {
		mockSecureThrows = true
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })

		expect(mockAsync.size).toBe(0)
		expect(await getAccessToken()).toBe('a')
	})

	it('keeps an access token refreshed while SecureStore is unavailable', async () => {
		mockSecureThrows = true
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })
		await saveAccessToken('a2')

		expect(await getAccessToken()).toBe('a2')
		expect(await getRefreshToken()).toBe('r')
		expect(mockAsync.size).toBe(0)
	})

	it('migrates a legacy AsyncStorage token to SecureStore and removes the plaintext copy', async () => {
		mockAsync.set('guara_vivo_access_token', 'legacy')

		expect(await getAccessToken()).toBe('legacy')
		expect(mockSecure.get('guara_vivo_access_token')).toBe('legacy')
		expect(mockAsync.size).toBe(0)
	})

	it('removes the legacy plaintext copy even when SecureStore cannot take it', async () => {
		mockSecureThrows = true
		mockAsync.set('guara_vivo_refresh_token', 'legacy')

		expect(await getRefreshToken()).toBe('legacy')
		expect(mockAsync.size).toBe(0)
	})

	it('clears SecureStore, memory and legacy copies on logout', async () => {
		mockSecureThrows = true
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })
		mockAsync.set('guara_vivo_access_token', 'old')

		await clearTokens()
		mockSecureThrows = false

		expect(await getAccessToken()).toBeNull()
		expect(await getRefreshToken()).toBeNull()
		expect(mockAsync.size).toBe(0)
	})

	it('rejects empty tokens', async () => {
		await expect(
			saveTokens({ accessToken: '  ', refreshToken: 'r' }),
		).rejects.toThrow('Missing token')
	})
})
