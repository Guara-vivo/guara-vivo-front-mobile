import type { MapZoneRead } from '../types/api'

const METERS_PER_DEGREE_LAT = 111_320

// Distância aproximada (plano local) entre dois pontos próximos, em metros. Vale para raios de
// centenas de metros, que é o caso das zonas.
function distanceMeters(latA: number, lngA: number, latB: number, lngB: number) {
	const dLat = (latB - latA) * METERS_PER_DEGREE_LAT
	const dLng = (lngB - lngA) * METERS_PER_DEGREE_LAT * Math.cos(((latA + latB) / 2) * (Math.PI / 180))

	return Math.hypot(dLat, dLng)
}

// O Circle do react-native-maps não recebe toque, então o toque no mapa é que decide se caiu dentro
// de uma zona. Com zonas sobrepostas, vence a de menor raio (a mais específica).
export function findZoneAtCoordinate(zones: MapZoneRead[], latitude: number, longitude: number): MapZoneRead | null {
	let found: MapZoneRead | null = null

	for (const zone of zones) {
		const inside = distanceMeters(zone.latitude, zone.longitude, latitude, longitude) <= zone.radius_meters

		if (inside && (found === null || zone.radius_meters < found.radius_meters)) {
			found = zone
		}
	}

	return found
}
