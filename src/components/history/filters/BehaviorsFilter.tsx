import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { behaviorOptions } from '../../../constants/behaviors'
import { appStyles } from '../../../styles/appStyles'

type Props = {
	selected: string[]
	onToggle: (behavior: string) => void
}

// Conteúdo da seção COMPORTAMENTOS: caixas de seleção por comportamento.
export function BehaviorsFilter({ selected, onToggle }: Props) {
	return (
		<View style={appStyles.historyBehaviorList}>
			{behaviorOptions.map((behavior) => {
				const active = selected.includes(behavior)

				return (
					<Pressable
						key={behavior}
						onPress={() => onToggle(behavior)}
						accessibilityRole="checkbox"
						accessibilityState={{ checked: active }}
						accessibilityLabel={behavior}
						style={appStyles.historyBehaviorItem}
					>
						<View
							style={[
								appStyles.historyBehaviorCheckbox,
								active && appStyles.historyBehaviorCheckboxActive,
							]}
						>
							{active ? (
								<Ionicons name="checkmark" size={12} color="#FFFFFF" />
							) : null}
						</View>
						<Text style={appStyles.historyBehaviorLabel}>{behavior}</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
