import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import type { Region } from 'react-native-maps'
import { DEFAULT_REGION, MAP_REGION_DELTA } from '../config/map'

const LOCATION_TIMEOUT_MS = 5000

// Posicao atual do aparelho para centralizar o mapa. Se demorar mais que o prazo, libera
// o mapa sem a posicao (locationReady) em vez de deixar a tela esperando.
export function useCurrentLocationTarget() {
	const locationTimedOutRef = useRef(false)
	const [cameraTargetRegion, setCameraTargetRegion] = useState<Region>(DEFAULT_REGION)
	const [hasLocationTarget, setHasLocationTarget] = useState(false)
	const [locationReady, setLocationReady] = useState(false)

	useEffect(() => {
		let isMounted = true
		const locationTimeout = setTimeout(() => {
			locationTimedOutRef.current = true

			if (isMounted) {
				setLocationReady(true)
			}
		}, LOCATION_TIMEOUT_MS)

		const loadCurrentLocation = async () => {
			try {
				const permission = await Location.requestForegroundPermissionsAsync()

				if (!permission.granted) {
					if (isMounted) {
						clearTimeout(locationTimeout)
						setLocationReady(true)
					}
					return
				}

				const position = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				})

				if (isMounted && !locationTimedOutRef.current) {
					clearTimeout(locationTimeout)
					setCameraTargetRegion({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: MAP_REGION_DELTA,
						longitudeDelta: MAP_REGION_DELTA,
					})
					setHasLocationTarget(true)
					setLocationReady(true)
				}
			} catch {
				if (isMounted) {
					clearTimeout(locationTimeout)
					setLocationReady(true)
				}
			}
		}

		loadCurrentLocation()

		return () => {
			isMounted = false
			clearTimeout(locationTimeout)
		}
	}, [])

	return { cameraTargetRegion, hasLocationTarget, locationReady }
}
