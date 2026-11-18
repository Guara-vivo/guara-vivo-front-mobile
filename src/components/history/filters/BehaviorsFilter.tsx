import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { behaviorOptions } from '../../../constants/behaviors'
import { behaviorLabel } from '../../../utils/behaviorLabel'
import { appStyles } from '../../../styles/appStyles'
import { colors } from '../../../constants/theme'

type Props = {
	selected: string[]
	onToggle: (behavior: string) => void
}

// Conteúdo da seção Comportamentos: chips que se marcam e desmarcam (vários ao mesmo tempo).
export function BehaviorsFilter({ selected, onToggle }: Props) {
	// Só para re-renderizar quando o idioma muda; os rótulos vêm de behaviorLabel.
	useTranslation('records')
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
						accessibilityLabel={behaviorLabel(behavior)}
						style={[appStyles.filterChip, active && appStyles.filterChipActive]}
					>
						{active ? <Ionicons name="checkmark" size={16} color={colors.onColor} /> : null}
						<Text style={[appStyles.filterChipText, active && appStyles.filterChipTextActive]}>
							{behaviorLabel(behavior)}
						</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
