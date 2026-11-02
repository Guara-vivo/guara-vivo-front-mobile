import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import type { MapZoneRecordRead } from '../types/api'

// Mantem os marcadores de registro na tela durante o fade-out e controla a opacidade.
export function useRecordMarkerFade(activeRecordMarkers: MapZoneRecordRead[]) {
	const recordMarkerOpacity = useRef(new Animated.Value(0)).current
	const recordMarkerFadeAnimationRef = useRef<Animated.CompositeAnimation | null>(null)
	const visibleRecordMarkerCountRef = useRef(0)
	const [visibleRecordMarkers, setVisibleRecordMarkers] = useState<MapZoneRecordRead[]>([])
	const activeRecordMarkersRef = useRef(activeRecordMarkers)
	activeRecordMarkersRef.current = activeRecordMarkers

	useEffect(() => {
		return () => {
			recordMarkerFadeAnimationRef.current?.stop()
		}
	}, [])

	useEffect(() => {
		const previousCount = visibleRecordMarkerCountRef.current

		recordMarkerFadeAnimationRef.current?.stop()

		if (activeRecordMarkers.length > 0) {
			setVisibleRecordMarkers(activeRecordMarkers)
			visibleRecordMarkerCountRef.current = activeRecordMarkers.length

			if (previousCount === 0) {
				recordMarkerOpacity.setValue(0)
			}

			const animation = Animated.timing(recordMarkerOpacity, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			})

			recordMarkerFadeAnimationRef.current = animation
			animation.start(({ finished }) => {
				if (finished && recordMarkerFadeAnimationRef.current === animation) {
					recordMarkerFadeAnimationRef.current = null
				}
			})
			return
		}

		if (previousCount === 0) {
			recordMarkerOpacity.setValue(0)
			return
		}

		const animation = Animated.timing(recordMarkerOpacity, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		})

		recordMarkerFadeAnimationRef.current = animation
		animation.start(({ finished }) => {
			if (finished && activeRecordMarkersRef.current.length === 0) {
				visibleRecordMarkerCountRef.current = 0
				setVisibleRecordMarkers([])
			}

			if (recordMarkerFadeAnimationRef.current === animation) {
				recordMarkerFadeAnimationRef.current = null
			}
		})
	}, [activeRecordMarkers, recordMarkerOpacity])

	return { visibleRecordMarkers, recordMarkerOpacity }
}
