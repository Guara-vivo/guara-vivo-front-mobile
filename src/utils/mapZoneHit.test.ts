import { findZoneAtCoordinate } from './mapZoneHit'
import type { MapZoneRead } from '../types/api'

function makeZone(overrides: Partial<MapZoneRead> = {}): MapZoneRead {
	return {
		id: 1,
		type: 'feeding',
		name: 'Alimentação 1',
		sequence_index: 1,
		latitude: -24.5,
		longitude: -47.8,
		radius_meters: 100,
		user_id: 1,
		created_at: '2026-06-04T10:00:00Z',
		...overrides,
	}
}

// 0,001 grau de latitude vale cerca de 111 m.
const DEG_LAT_PER_METER = 1 / 111_320

describe('findZoneAtCoordinate', () => {
	it('returns the zone when the tap is inside its radius', () => {
		const zone = makeZone({ radius_meters: 100 })

		const hit = findZoneAtCoordinate([zone], zone.latitude + 60 * DEG_LAT_PER_METER, zone.longitude)

		expect(hit).toBe(zone)
	})

	it('returns null when the tap is outside every zone', () => {
		const zone = makeZone({ radius_meters: 100 })

		const hit = findZoneAtCoordinate([zone], zone.latitude + 140 * DEG_LAT_PER_METER, zone.longitude)

		expect(hit).toBeNull()
	})

	it('returns null when there are no zones', () => {
		expect(findZoneAtCoordinate([], -24.5, -47.8)).toBeNull()
	})

	it('prefers the smallest zone when zones overlap', () => {
		const big = makeZone({ id: 1, radius_meters: 300 })
		const small = makeZone({ id: 2, radius_meters: 50 })

		const hit = findZoneAtCoordinate([big, small], big.latitude, big.longitude)

		expect(hit).toBe(small)
	})

	it('falls back to the larger zone when the tap is outside the smaller one', () => {
		const big = makeZone({ id: 1, radius_meters: 300 })
		const small = makeZone({ id: 2, radius_meters: 50 })

		const hit = findZoneAtCoordinate([big, small], big.latitude + 200 * DEG_LAT_PER_METER, big.longitude)

		expect(hit).toBe(big)
	})

	it('accounts for longitude shrinking with latitude', () => {
		// A -24,5° um grau de longitude vale ~101 km, não 111 km.
		const zone = makeZone({ radius_meters: 100 })
		const metersPerDegLng = 111_320 * Math.cos((zone.latitude * Math.PI) / 180)

		const inside = findZoneAtCoordinate([zone], zone.latitude, zone.longitude + 90 / metersPerDegLng)
		const outside = findZoneAtCoordinate([zone], zone.latitude, zone.longitude + 110 / metersPerDegLng)

		expect(inside).toBe(zone)
		expect(outside).toBeNull()
	})
})
