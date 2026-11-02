import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import { Header } from '../Header'

export function RecordDetailHeader({ onBack }: { onBack: () => void }) {
	return (
		<Header
			title="Detalhes do Registro"
			leftIcon={
				<Pressable
					onPress={onBack}
					hitSlop={8}
					style={appStyles.headerActionButton}
				>
					<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
				</Pressable>
			}
		/>
	)
}
