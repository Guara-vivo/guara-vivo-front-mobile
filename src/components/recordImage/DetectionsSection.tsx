import React from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import type { ImageAnalysisItem } from '../../types/records'
import { DetectionCard } from './DetectionCard'

// Lista de guarás detectados na imagem.
export function DetectionsSection({ analysis }: { analysis: ImageAnalysisItem }) {
	// O aviso "Sem detecções" já aparece no ConfidenceBanner.
	if (analysis.detections.length === 0) {
		return null
	}

	return (
		<View style={appStyles.recordImageList}>
			<Text style={appStyles.recordImageModalSectionTitle} accessibilityRole="header">
				{`Guarás detectados (${analysis.detections.length})`}
			</Text>
			{analysis.detections.map((detection, idx) => (
				<DetectionCard key={detection.id} detection={detection} index={idx} />
			))}
		</View>
	)
}
