import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { appStyles } from '../styles/appStyles'

export function RegisterBehaviorList({
	behaviorOrder,
	behaviors,
	toggleBehavior,
}: {
	behaviorOrder: string[]
	behaviors: string[]
	toggleBehavior: (b: string) => void
}) {
	return (
		<View style={appStyles.registerBehaviorList}>
			{behaviorOrder.map((behavior) => {
				const active = behaviors.includes(behavior)
				return (
					<Pressable
						key={behavior}
						onPress={() => toggleBehavior(behavior)}
						style={appStyles.registerBehaviorItem}
					>
						<View
							style={[
								appStyles.registerCheckbox,
								active && appStyles.registerCheckboxActive,
							]}
						>
							{active ? (
								<Ionicons name="checkmark" size={12} color="#FFFFFF" />
							) : null}
						</View>
						<Text style={appStyles.registerBehaviorLabel}>{behavior}</Text>
					</Pressable>
				)
			})}
		</View>
	)
}

export default RegisterBehaviorList
