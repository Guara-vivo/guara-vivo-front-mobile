import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'

type AnalysisProgressIndicatorProps = {
	progress: number
	status?: RecordItem['status']
}

const SIZE = 30
const STROKE_WIDTH = 5
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getProgressColor(status?: RecordItem['status']) {
	if (status === 'failed') {
		return colors.primary
	}

	if (status === 'completed') {
		return colors.secondary
	}

	return colors.muted
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
			? 'Identificação falhou'
			: `Identificação ${normalizedProgress}% concluída`

	return (
		<View
			accessible
			accessibilityRole="progressbar"
			accessibilityLabel={accessibilityLabel}
			style={appStyles.analysisProgressWrap}
		>
			{status !== 'failed' && normalizedProgress !== 100 && (
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
			)}
			<View
				style={[
					appStyles.analysisProgressText,
					{ top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
				]}
			>
				{status === 'failed' ? (
					<Ionicons name="alert-circle" size={24} color={colors.primary} />
				) : normalizedProgress === 100 ? (
					<Ionicons name="checkmark-circle" size={24} color={colors.secondary} />
				) : (
					<Text style={appStyles.analysisProgressText}>
						{`${normalizedProgress}%`}
					</Text>
				)}
			</View>
		</View>
	)
}

export default AnalysisProgressIndicator
