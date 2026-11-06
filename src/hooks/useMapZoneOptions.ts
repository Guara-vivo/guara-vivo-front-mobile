import { useEffect, useState } from 'react'
import { getMapZones } from '../services/mapZonesApi'
import type { MapZoneRead } from '../types/api'
import { useIsOnline } from './useIsOnline'

// Áreas do mapa para o seletor de localização. Em caso de falha (ex.: sem internet) a lista fica
// vazia e `failed` fica true; tenta de novo sozinho quando a internet volta.
export function useMapZoneOptions() {
	const online = useIsOnline()
	const [zones, setZones] = useState<MapZoneRead[]>([])
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		// Sem internet nem tenta: já sabemos que vai falhar.
		if (!online) {
			setFailed(true)
			return
		}

		let mounted = true

		getMapZones()
			.then((data) => {
				if (mounted) {
					setZones(data)
					setFailed(false)
				}
			})
			.catch(() => {
				if (mounted) {
					setFailed(true)
				}
			})

		return () => {
			mounted = false
		}
	}, [online])

	return { zones, failed }
}
