import { parseStoredRegion } from './useStoredCameraRegion'

jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: { getItem: jest.fn(), setItem: jest.fn() },
}))

const region = { latitude: -24.5, longitude: -47.8, latitudeDelta: 0.01, longitudeDelta: 0.02 }

describe('parseStoredRegion', () => {
	it('le uma regiao valida', () => {
		expect(parseStoredRegion(JSON.stringify(region))).toEqual(region)
	})

	it('ignora valores ausentes, ilegiveis ou incompletos', () => {
		expect(parseStoredRegion(null)).toBeNull()
		expect(parseStoredRegion('nao e json')).toBeNull()
		expect(parseStoredRegion(JSON.stringify({ latitude: 1, longitude: 2 }))).toBeNull()
		expect(parseStoredRegion(JSON.stringify({ ...region, latitude: 'x' }))).toBeNull()
	})
})
