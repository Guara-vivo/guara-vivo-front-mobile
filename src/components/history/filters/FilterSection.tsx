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

// Seção recolhível do modal de filtros: cartão com cabeçalho clicável e conteúdo só quando aberta.
export function FilterSection({ iconName, title, isOpen, onToggle, children }: Props) {
	return (
		<View style={appStyles.filterSection}>
			<Pressable
				onPress={onToggle}
				accessibilityRole="button"
				accessibilityLabel={title}
				accessibilityState={{ expanded: isOpen }}
				style={appStyles.filterSectionHeader}
			>
				<View style={appStyles.filterSectionIcon}>
					<Ionicons name={iconName} size={20} color={colors.secondary} />
				</View>
				<Text style={appStyles.filterSectionTitle}>{title}</Text>
				<Ionicons
					name={isOpen ? 'chevron-up' : 'chevron-down'}
					size={20}
					color={colors.muted}
				/>
			</Pressable>

			{isOpen ? <View style={appStyles.filterSectionBody}>{children}</View> : null}
		</View>
	)
}
