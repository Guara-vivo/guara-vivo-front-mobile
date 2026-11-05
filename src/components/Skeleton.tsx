import React, { useEffect, useRef } from 'react'
import { Animated, Easing, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native'
import { appStyles } from '../styles/appStyles'

type SkeletonProps = {
	width?: DimensionValue
	height?: DimensionValue
	radius?: number
	style?: StyleProp<ViewStyle>
}

const PULSE_MS = 800

// Bloco cinza que "respira" no lugar de uma informação que ainda está chegando da API.
// Só anima opacidade (driver nativo), então não pesa na thread JS.
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: SkeletonProps) {
	const pulse = useRef(new Animated.Value(0)).current

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 1,
					duration: PULSE_MS,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(pulse, {
					toValue: 0,
					duration: PULSE_MS,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			]),
		)
		loop.start()

		return () => loop.stop()
	}, [pulse])

	const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] })

	return (
		<Animated.View
			importantForAccessibility="no-hide-descendants"
			accessibilityElementsHidden
			style={[appStyles.skeleton, { width, height, borderRadius: radius, opacity }, style]}
		/>
	)
}

export default Skeleton
