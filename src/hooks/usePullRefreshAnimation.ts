import { useEffect, useRef } from 'react'
import {
	Animated,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from 'react-native'

const maxPullDistance = 56
const refreshingOffset = 36
const pullResponsiveness = 0.8

export function usePullRefreshAnimation(refreshing: boolean) {
	const pullDistance = useRef(new Animated.Value(0)).current
	const isPulling = useRef(false)

	useEffect(() => {
		Animated.spring(pullDistance, {
			toValue: refreshing ? refreshingOffset : 0,
			useNativeDriver: true,
			damping: 18,
			stiffness: 180,
			mass: 0.7,
		}).start()
	}, [pullDistance, refreshing])

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = event.nativeEvent.contentOffset.y

		if (offsetY < 0 && !refreshing) {
			isPulling.current = true
			pullDistance.setValue(
				Math.min(Math.abs(offsetY) * pullResponsiveness, maxPullDistance),
			)
			return
		}

		if (isPulling.current && !refreshing) {
			isPulling.current = false
			Animated.spring(pullDistance, {
				toValue: 0,
				useNativeDriver: true,
				damping: 18,
				stiffness: 180,
				mass: 0.7,
			}).start()
		}
	}

	return {
		animatedPullStyle: {
			transform: [{ translateY: pullDistance }],
		},
		handlePullScroll: handleScroll,
	}
}

export default usePullRefreshAnimation
