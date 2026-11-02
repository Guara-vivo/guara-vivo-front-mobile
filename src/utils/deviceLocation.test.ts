import * as Location from 'expo-location'
import { getDevicePosition, LocationUnavailableError } from './deviceLocation'

jest.mock('expo-location', () => ({
	Accuracy: { Balanced: 3 },
	getCurrentPositionAsync: jest.fn(),
	getLastKnownPositionAsync: jest.fn(),
}))

const current = Location.getCurrentPositionAsync as jest.Mock
const last = Location.getLastKnownPositionAsync as jest.Mock
const at = (latitude: number, longitude: number) => ({ coords: { latitude, longitude } })

beforeEach(() => {
	current.mockReset()
	last.mockReset()
})

describe('getDevicePosition', () => {
	it('returns the current position', async () => {
		current.mockResolvedValue(at(-24.5, -47.8))

		expect(await getDevicePosition(50)).toEqual({ latitude: -24.5, longitude: -47.8 })
		expect(last).not.toHaveBeenCalled()
	})

	it('falls back to the last known position when the GPS never answers', async () => {
		current.mockReturnValue(new Promise(() => {}))
		last.mockResolvedValue(at(-23.1, -45.1))

		expect(await getDevicePosition(20)).toEqual({ latitude: -23.1, longitude: -45.1 })
	})

	it('falls back to the last known position when the current one fails', async () => {
		current.mockRejectedValue(new Error('ERR_CURRENT_LOCATION_IS_UNAVAILABLE'))
		last.mockResolvedValue(at(-23.1, -45.1))

		expect(await getDevicePosition(50)).toEqual({ latitude: -23.1, longitude: -45.1 })
	})

	it('throws when there is no current or last known position', async () => {
		current.mockReturnValue(new Promise(() => {}))
		last.mockResolvedValue(null)

		await expect(getDevicePosition(20)).rejects.toBeInstanceOf(LocationUnavailableError)
	})
})
