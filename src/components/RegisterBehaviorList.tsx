import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../styles/appStyles'
import { behaviorLabel } from '../utils/behaviorLabel'
import { colors } from '../constants/theme'

export function RegisterBehaviorList({
	behaviorOrder,
	behaviors,
	toggleBehavior,
}: {
	behaviorOrder: string[]
	behaviors: string[]
	toggleBehavior: (b: string) => void
}) {
	// Só para re-renderizar quando o idioma muda; os rótulos vêm de behaviorLabel.
	useTranslation('records')

	return (
		<View style={appStyles.registerBehaviorList}>
			{behaviorOrder.map((behavior) => {
				const active = behaviors.includes(behavior)
				return (
					<Pressable
						key={behavior}
						onPress={() => toggleBehavior(behavior)}
						accessibilityRole="checkbox"
						accessibilityState={{ checked: active }}
						accessibilityLabel={behaviorLabel(behavior)}
						style={[
							appStyles.registerBehaviorItem,
							active && appStyles.registerBehaviorItemActive,
						]}
					>
						<View
							style={[
								appStyles.registerCheckbox,
								active && appStyles.registerCheckboxActive,
							]}
						>
							{active ? (
								<Ionicons name="checkmark" size={14} color={colors.onColor} />
							) : null}
						</View>
						<Text style={appStyles.registerBehaviorLabel}>{behaviorLabel(behavior)}</Text>
					</Pressable>
				)
			})}
		</View>
	)
}

export default RegisterBehaviorList
