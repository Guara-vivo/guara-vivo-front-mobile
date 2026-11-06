import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { behaviorOptions } from '../../../constants/behaviors'
import { appStyles } from '../../../styles/appStyles'
import { colors } from '../../../constants/theme'

type Props = {
	selected: string[]
	onToggle: (behavior: string) => void
}

// Conteúdo da seção Comportamentos: chips que se marcam e desmarcam (vários ao mesmo tempo).
export function BehaviorsFilter({ selected, onToggle }: Props) {
	return (
		<View style={appStyles.filterChipRow}>
			{behaviorOptions.map((behavior) => {
				const active = selected.includes(behavior)

				return (
					<Pressable
						key={behavior}
						onPress={() => onToggle(behavior)}
						accessibilityRole="checkbox"
						accessibilityState={{ checked: active }}
						accessibilityLabel={behavior}
						style={[appStyles.filterChip, active && appStyles.filterChipActive]}
					>
						{active ? <Ionicons name="checkmark" size={16} color={colors.onColor} /> : null}
						<Text style={[appStyles.filterChipText, active && appStyles.filterChipTextActive]}>
							{behavior}
						</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
