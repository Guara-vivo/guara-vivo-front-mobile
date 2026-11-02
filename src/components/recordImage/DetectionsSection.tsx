import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { ImageAnalysisItem } from '../../types/records'
import { DetectionCard } from './DetectionCard'

export function DetectionsSection({ analysis }: { analysis: ImageAnalysisItem }) {
	return (
		<View style={appStyles.recordImageModalSection}>
			<View style={appStyles.recordImageModalSectionTitleRow}>
				<Ionicons name="search-outline" size={16} color="#125ED0" />
				<Text style={appStyles.recordImageModalSectionTitle}>
					{`DETECÇÕES (${analysis.ibis_quantity})`}
				</Text>
			</View>

			{analysis.ibis_quantity === 0 ? (
				<View style={appStyles.recordImageModalEmptyState}>
					<Text style={appStyles.recordImageModalEmptyText}>
						Nenhuma detecção nesta imagem.
					</Text>
				</View>
			) : (
				<View style={appStyles.recordImageModalIbisList}>
					{analysis.detections.map((detection, idx) => (
						<DetectionCard key={detection.id} detection={detection} index={idx} />
					))}
				</View>
			)}
		</View>
	)
}
