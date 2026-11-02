import { getAccessToken, saveTokens } from './tokenStorage'

const mockSecure = new Map<string, string>()
const mockAsync = new Map<string, string>()
let mockSecureReadsEmpty = false

jest.mock('expo-secure-store', () => ({
	setItemAsync: jest.fn(async (key: string, value: string) => {
		mockSecure.set(key, value)
	}),
	getItemAsync: jest.fn(async (key: string) =>
		mockSecureReadsEmpty ? null : (mockSecure.get(key) ?? null),
	),
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

beforeEach(() => {
	mockSecure.clear()
	mockAsync.clear()
	mockSecureReadsEmpty = false
})

describe('tokenStorage', () => {
	it('keeps tokens in SecureStore when it reads them back', async () => {
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })

		expect(await getAccessToken()).toBe('a')
		expect(mockAsync.size).toBe(0)
	})

	it('falls back to AsyncStorage when SecureStore saves but reads back empty', async () => {
		mockSecureReadsEmpty = true
		await saveTokens({ accessToken: 'a', refreshToken: 'r' })

		expect(await getAccessToken()).toBe('a')
		expect(mockAsync.size).toBe(2)
	})
})
