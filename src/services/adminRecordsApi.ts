import type { MapZoneRecordRead } from '../types/api'
import { apiGetJson } from './apiClient'
import { getAccessToken } from './tokenStorage'
import { fetchAllPages } from '../utils/fetchAllPages'

// Registros de todos os usuários (só admin; a API responde 404 aos demais), para o mapa.
export async function getAdminMapRecords(signal?: AbortSignal): Promise<MapZoneRecordRead[]> {
	const token = await getAccessToken()

	return fetchAllPages((skip, limit) =>
		apiGetJson<MapZoneRecordRead[]>(`/records/admin/summary?skip=${skip}&limit=${limit}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			signal,
		}),
	)
}
