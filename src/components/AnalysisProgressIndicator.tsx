import React from 'react'
import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'

type AnalysisProgressIndicatorProps = {
	progress: number
	status?: RecordItem['status']
}

const SIZE = 36
const STROKE_WIDTH = 6
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getProgressColor(status?: RecordItem['status']) {
	if (status === 'failed') {
		return colors.primary
	}

	if (status === 'completed') {
		return '#2E9D57'
	}

	return colors.secondary
}

export function AnalysisProgressIndicator({
	progress,
	status,
}: AnalysisProgressIndicatorProps) {
	const normalizedProgress = Math.min(Math.max(Math.round(progress), 0), 100)
	const strokeDashoffset =
		CIRCUMFERENCE - (normalizedProgress / 100) * CIRCUMFERENCE
	const progressColor = getProgressColor(status)
	const accessibilityLabel =
		status === 'failed'
			? 'Identificacao falhou'
			: `Identificacao ${normalizedProgress}% concluida`

	return (
		<View
			accessible
			accessibilityRole="progressbar"
			accessibilityLabel={accessibilityLabel}
			style={appStyles.analysisProgressWrap}
		>
			<Svg width={SIZE} height={SIZE}>
				<Circle
					cx={SIZE / 2}
					cy={SIZE / 2}
					r={RADIUS}
					stroke={colors.border}
					strokeWidth={STROKE_WIDTH}
					fill="none"
				/>
				<Circle
					cx={SIZE / 2}
					cy={SIZE / 2}
					r={RADIUS}
					stroke={progressColor}
					strokeWidth={STROKE_WIDTH}
					fill="none"
					strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					rotation="-90"
					originX={SIZE / 2}
					originY={SIZE / 2}
				/>
			</Svg>
			<Text style={appStyles.analysisProgressText}>
				{status === 'failed' ? '!' : `${normalizedProgress}%`}
			</Text>
		</View>
	)
}

export default AnalysisProgressIndicator
