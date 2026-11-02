import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../constants/theme'
import { appStyles } from '../../../styles/appStyles'
import type { HistoryFilterState } from '../../../hooks/useHistoryFilters'

export type FilterFieldSetter = <K extends keyof HistoryFilterState>(
	field: K,
	value: HistoryFilterState[K],
) => void

type Props = {
	iconName: React.ComponentProps<typeof Ionicons>['name']
	title: string
	isOpen: boolean
	onToggle: () => void
	children: React.ReactNode
}

// Seção recolhível do modal de filtros: cabeçalho clicável e conteúdo só quando aberta.
export function FilterSection({ iconName, title, isOpen, onToggle, children }: Props) {
	return (
		<View style={appStyles.historyFilterSection}>
			<Pressable onPress={onToggle} style={appStyles.historyFilterSectionHeader}>
				<View style={appStyles.historyFilterSectionTitleRow}>
					<Ionicons name={iconName} size={15} color="#F2201F" />
					<Text style={appStyles.historyFilterSectionTitle}>{title}</Text>
				</View>
				<Ionicons
					name={isOpen ? 'chevron-up' : 'chevron-down'}
					size={18}
					color={colors.text}
				/>
			</Pressable>

			{isOpen ? children : null}
		</View>
	)
}
