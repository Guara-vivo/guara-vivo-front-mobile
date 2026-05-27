import { MapZoneRead, MapZoneType } from '../types/api'
import { apiFetch } from './apiClient'

export async function getMapZones(signal?: AbortSignal): Promise<MapZoneRead[]> {
	const response = await apiFetch('/map-zones', {
		method: 'GET',
		signal,
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch map zones: ${response.statusText}`)
	}

	return response.json()
}

export async function createMapZone(
	type: MapZoneType,
	latitude: number,
	longitude: number,
	radius_meters: number,
	user_id: number,
	signal?: AbortSignal
): Promise<MapZoneRead> {
	const payload = {
		type,
		latitude,
		longitude,
		radius_meters,
		user_id,
	}

	const response = await apiFetch('/map-zones', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
		signal,
	})

	if (!response.ok) {
		throw new Error(`Failed to create map zone: ${response.statusText}`)
	}

	return response.json()
}

export async function deleteMapZone(zone_id: number, signal?: AbortSignal): Promise<{ detail: string }> {
	const response = await apiFetch(`/map-zones/${zone_id}`, {
		method: 'DELETE',
		signal,
	})

	if (!response.ok) {
		throw new Error(`Failed to delete map zone: ${response.statusText}`)
	}

	return response.json()
}
