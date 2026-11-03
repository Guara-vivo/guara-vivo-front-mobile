import type { MapZoneRead, MapZoneRecordRead, MapZoneType } from '../types/api'
import { apiFetch, apiGetJson } from './apiClient'
import { getAccessToken } from './tokenStorage'

export async function getMapZones(signal?: AbortSignal): Promise<MapZoneRead[]> {
	const token = await getAccessToken()
	return apiGetJson<MapZoneRead[]>('/map-zones/', {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		signal,
	})
}

export async function getMapZoneRecords(
	zoneId: number,
	signal?: AbortSignal,
): Promise<MapZoneRecordRead[]> {
	const token = await getAccessToken()
	return apiGetJson<MapZoneRecordRead[]>(`/map-zones/${zoneId}/records`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		signal,
	})
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

	const response = await apiFetch('/map-zones/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify(payload),
		signal,
	})


	return response.json()
}

export async function deleteMapZone(zone_id: number, signal?: AbortSignal): Promise<{ detail: string }> {
	const token = await getAccessToken()
	const response = await apiFetch(`/map-zones/${zone_id}`, {
		method: 'DELETE',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		signal,
	})


	return response.json()
}
