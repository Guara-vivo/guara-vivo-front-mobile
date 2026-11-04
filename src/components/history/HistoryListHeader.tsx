import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { SortOrder } from '../../utils/historyRecords'
import { formatDate, formatTime } from '../../utils/recordFormatters'
import { colors } from '../../constants/theme'

type Props = {
	staleSince: number | null
	searchTerm: string
	onSearchChange: (value: string) => void
	onOpenFilters: () => void
	sortOrder: SortOrder
	onToggleSort: () => void
	disabled: boolean
}

// Topo da lista: aviso de dados offline, busca, filtros e ordenação.
function HistoryListHeaderBase({
	staleSince,
	searchTerm,
	onSearchChange,
	onOpenFilters,
	sortOrder,
	onToggleSort,
	disabled,
}: Props) {
	const staleIso = staleSince !== null ? new Date(staleSince).toISOString() : null

	return (
		<View style={appStyles.historyHeaderGroup}>
			{staleIso !== null ? (
				<Text style={appStyles.historyEmptyText}>
					{`Sem conexão com o servidor. Mostrando dados de ${formatDate(staleIso)} às ${formatTime(staleIso)}.`}
				</Text>
			) : null}

			<View style={appStyles.historySearchRow}>
				<View style={appStyles.historySearchInputWrap}>
					<Ionicons name="search-outline" size={20} color={colors.muted} />
					<TextInput
						value={searchTerm}
						onChangeText={onSearchChange}
						accessibilityLabel="Buscar registros"
						placeholder="Buscar por local ou data"
						placeholderTextColor={colors.placeholder}
						style={appStyles.historySearchInput}
					/>
				</View>
				<Pressable
					onPress={onOpenFilters}
					accessibilityRole="button"
					accessibilityLabel="Filtros"
					accessibilityState={{ disabled: !!disabled }}
					disabled={disabled}
					style={[
						appStyles.historyFilterButton,
						disabled && appStyles.historyFilterButtonDisabled,
					]}
				>
					<Ionicons name="options-outline" size={22} color={colors.text} />
				</Pressable>
			</View>

			<Pressable
				onPress={onToggleSort}
				accessibilityRole="button"
				accessibilityLabel={
					sortOrder === 'desc'
						? 'Ordenação: mais recentes primeiro. Alternar'
						: 'Ordenação: mais antigos primeiro. Alternar'
				}
				accessibilityState={{ disabled: !!disabled }}
				disabled={disabled}
				style={[
					appStyles.historySortPill,
					disabled && appStyles.historyFilterButtonDisabled,
				]}
			>
				<Ionicons name="swap-vertical" size={16} color={colors.secondary} />
				<Text style={appStyles.historySortPillText}>
					{sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
				</Text>
			</Pressable>
		</View>
	)
}

export const HistoryListHeader = React.memo(HistoryListHeaderBase)
