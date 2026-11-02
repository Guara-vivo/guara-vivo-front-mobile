import { useEffect, useState } from 'react'
import { getMapZones } from '../services/mapZonesApi'
import type { MapZoneRead } from '../types/api'

// Áreas do mapa para o seletor de localização; em caso de falha a lista fica vazia.
export function useMapZoneOptions() {
	const [zones, setZones] = useState<MapZoneRead[]>([])

	useEffect(() => {
		const loadZones = async () => {
			try {
				const data = await getMapZones()
				setZones(data)
			} catch {
				if (__DEV__) {
					console.error('[HistoryFilterModal] Failed to load zones:')
				}
			}
		}
		loadZones()
	}, [])

	return zones
}
