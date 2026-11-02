import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'

// Card "COMPORTAMENTOS OBSERVADOS": `flockSize` chega da API como lista separada por vírgula.
export function BehaviorsCard({ flockSize }: { flockSize: string | number }) {
	const behaviorTags = String(flockSize)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

	return (
		<View style={appStyles.recordDetailCard}>
			<View style={appStyles.recordDetailSectionTitleRow}>
				<Ionicons name="pulse-outline" size={16} color="#125ED0" />
				<Text style={appStyles.recordDetailSectionTitle}>
					COMPORTAMENTOS OBSERVADOS
				</Text>
			</View>

			<View style={appStyles.recordDetailChipRow}>
				{behaviorTags.map((behavior) => (
					<View key={behavior} style={appStyles.recordDetailChip}>
						<Text style={appStyles.recordDetailChipText}>
							{behavior.toUpperCase()}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}
