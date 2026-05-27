import { MapZoneRead, MapZoneType } from '../types/api'
import { apiFetch } from './apiClient'
import { getAccessToken } from './tokenStorage'

export async function getMapZones(signal?: AbortSignal): Promise<MapZoneRead[]> {
	const token = await getAccessToken()
	const response = await apiFetch('/map-zones', {
		method: 'GET',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
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
	signal?: AbortSignal
): Promise<MapZoneRead> {
	const token = await getAccessToken()
	const payload = {
		type,
		latitude,
		longitude,
		radius_meters,
	}

	const response = await apiFetch('/map-zones', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
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
	const token = await getAccessToken()
	const response = await apiFetch(`/map-zones/${zone_id}`, {
		method: 'DELETE',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		signal,
	})

	if (!response.ok) {
		throw new Error(`Failed to delete map zone: ${response.statusText}`)
	}

	return response.json()
}
