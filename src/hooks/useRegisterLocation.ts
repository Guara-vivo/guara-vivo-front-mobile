import { useRef, useState } from 'react'
import * as Location from 'expo-location'
import { getDevicePosition } from '../utils/deviceLocation'

export type Coordinates = { latitude: number; longitude: number }

// Local do avistamento: o escolhido no mapa (selectedLocation) ou, sem escolha, o do aparelho.
export function useRegisterLocation({ isSaving }: { isSaving: boolean }) {
	const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)
	const [tempLocation, setTempLocation] = useState<Coordinates | null>(null)
	const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
	const [showLocationPicker, setShowLocationPicker] = useState(false)
	const locationFetchedRef = useRef(false)

	const openLocationPicker = async () => {
		if (isSaving) {
			return
		}

		setShowLocationPicker(true)

		if (!locationFetchedRef.current) {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync()
				if (status === 'granted') {
					setUserLocation(await getDevicePosition())
					locationFetchedRef.current = true
				}
			} catch {
				// location permission denied or unavailable, map uses default region
			}
		}
	}

	const closeLocationPicker = () => {
		setShowLocationPicker(false)
	}

	const confirmLocationPicker = () => {
		if (!tempLocation) {
			return
		}

		setSelectedLocation(tempLocation)
		setShowLocationPicker(false)
	}

	const clearSelectedLocation = () => {
		setSelectedLocation(null)
		setTempLocation(null)
	}

	// Depois de salvar: volta ao estado inicial (local do aparelho, mapa fechado).
	const resetLocation = () => {
		setSelectedLocation(null)
		setTempLocation(null)
		setShowLocationPicker(false)
	}

	return {
		selectedLocation,
		tempLocation,
		userLocation,
		showLocationPicker,
		setTempLocation,
		openLocationPicker,
		closeLocationPicker,
		confirmLocationPicker,
		clearSelectedLocation,
		resetLocation,
	}
}
