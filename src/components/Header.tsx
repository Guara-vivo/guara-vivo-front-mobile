import React, { useLayoutEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import { appStyles } from '../styles/appStyles'

const headerAnimationConfig = {
	duration: 100,
	easing: Easing.out(Easing.cubic),
}

// remember if previous header render had a left icon (module-level persistence)
let prevHadLeftIcon = false

interface HeaderProps {
	title: string
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

export function Header({ title, leftIcon, rightIcon }: HeaderProps) {
	const hasLeftIcon = Boolean(leftIcon)
	const [renderLeftIcon, setRenderLeftIcon] = useState(hasLeftIcon)
	const backButtonAnim = useSharedValue(0)
	const titleAnim = useSharedValue(0)
	const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useLayoutEffect(() => {
		if (exitTimerRef.current) {
			clearTimeout(exitTimerRef.current)
			exitTimerRef.current = null
		}

		// if previous header had a left icon and current doesn't, ensure title starts shifted
		if (prevHadLeftIcon && !hasLeftIcon) {
			titleAnim.value = 1
		}

		// remember for next mount (set before possible early return)
		prevHadLeftIcon = hasLeftIcon

		if (hasLeftIcon) {
			setRenderLeftIcon(true)
			backButtonAnim.value = withTiming(1, headerAnimationConfig)
			titleAnim.value = withTiming(1, headerAnimationConfig)
			return
		}

		backButtonAnim.value = withTiming(0, headerAnimationConfig)
		titleAnim.value = withTiming(0, headerAnimationConfig)
		exitTimerRef.current = setTimeout(() => {
			setRenderLeftIcon(false)
		}, headerAnimationConfig.duration)

		return () => {
			if (exitTimerRef.current) {
				clearTimeout(exitTimerRef.current)
				exitTimerRef.current = null
			}
		}
	}, [backButtonAnim, hasLeftIcon, titleAnim])

	const leftIconAnimatedStyle = useAnimatedStyle(() => {
		const progress = backButtonAnim.value

		return {
			opacity: progress,
			transform: [{ translateX: interpolate(progress, [0, 1], [-18, 0]) }],
		}
	})

	const titleAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: interpolate(titleAnim.value, [0, 1], [-14, 0]) }],
	}))

	return (
		<View style={appStyles.header}>
			{renderLeftIcon && leftIcon ? (
				<View style={appStyles.headerLeft}>
					<Animated.View style={[appStyles.headerLeft, leftIconAnimatedStyle]}>
						{leftIcon}
					</Animated.View>
				</View>
			) : null}
			<Animated.View
				pointerEvents="none"
				style={[appStyles.headerTitle, titleAnimatedStyle]}
			>
				<Text numberOfLines={1} style={appStyles.appHeaderTitle}>
					{title}
				</Text>
			</Animated.View>
			{rightIcon ? (
				<View style={appStyles.headerRight}>{rightIcon}</View>
			) : null}
		</View>
	)
}

export default Header
