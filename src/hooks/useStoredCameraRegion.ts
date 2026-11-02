import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react'
import type { Region } from 'react-native-maps'
import { DEFAULT_REGION } from '../config/map'

const CAMERA_STORAGE_DEBOUNCE_MS = 600
const MAP_CAMERA_STORAGE_KEY = 'guara_vivo:last_map_camera_region'

export function parseStoredRegion(value: string | null): Region | null {
	if (!value) {
		return null
	}

	try {
		const region = JSON.parse(value) as Partial<Region>
		const values = [
			region.latitude,
			region.longitude,
			region.latitudeDelta,
			region.longitudeDelta,
		]

		if (values.every((item) => typeof item === 'number' && Number.isFinite(item))) {
			return {
				latitude: region.latitude as number,
				longitude: region.longitude as number,
				latitudeDelta: region.latitudeDelta as number,
				longitudeDelta: region.longitudeDelta as number,
			}
		}
	} catch {
		return null
	}

	return null
}

// Ultima regiao vista no mapa: reabre na mesma posicao e grava (com atraso) a cada mudanca.
export function useStoredCameraRegion() {
	const cameraStorageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [initialRegion, setInitialRegion] = useState<Region>(DEFAULT_REGION)
	const [initialRegionReady, setInitialRegionReady] = useState(false)

	useEffect(() => {
		let isMounted = true

		AsyncStorage.getItem(MAP_CAMERA_STORAGE_KEY)
			.then((value) => {
				if (!isMounted) {
					return
				}

				const storedRegion = parseStoredRegion(value)
				setInitialRegion(storedRegion ?? DEFAULT_REGION)
			})
			.catch(() => {})
			.finally(() => {
				if (isMounted) {
					setInitialRegionReady(true)
				}
			})

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		return () => {
			if (cameraStorageTimerRef.current) {
				clearTimeout(cameraStorageTimerRef.current)
			}
		}
	}, [])

	const persistCameraRegion = (region: Region) => {
		if (cameraStorageTimerRef.current) {
			clearTimeout(cameraStorageTimerRef.current)
		}

		cameraStorageTimerRef.current = setTimeout(() => {
			void AsyncStorage.setItem(
				MAP_CAMERA_STORAGE_KEY,
				JSON.stringify(region),
			).catch(() => {})
		}, CAMERA_STORAGE_DEBOUNCE_MS)
	}

	return { initialRegion, initialRegionReady, persistCameraRegion }
}
