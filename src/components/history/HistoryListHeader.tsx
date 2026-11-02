import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { SortOrder } from '../../utils/historyRecords'
import { formatDate, formatTime } from '../../utils/recordFormatters'
import { ScreenCard } from '../common'

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
export function HistoryListHeader({
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
		<>
			{staleIso !== null ? (
				<Text style={appStyles.historyEmptyText}>
					{`Sem conexão com o servidor. Mostrando dados de ${formatDate(staleIso)} às ${formatTime(staleIso)}.`}
				</Text>
			) : null}
			<ScreenCard style={appStyles.historySearchCard}>
				<View style={appStyles.historySearchInputWrap}>
					<Ionicons name="search-outline" size={19} color="#5C8BD6" />
					<TextInput
						value={searchTerm}
						onChangeText={onSearchChange}
						placeholder="Buscar por local, data..."
						placeholderTextColor="#8E8E96"
						style={appStyles.historySearchInput}
					/>
				</View>

				<Pressable
					onPress={onOpenFilters}
					disabled={disabled}
					style={[
						appStyles.historyFilterButton,
						disabled && appStyles.historyFilterButtonDisabled,
					]}
				>
					<Ionicons name="funnel-outline" size={17} color="#FFFFFF" />
					<Text style={appStyles.historyFilterButtonText}>FILTROS</Text>
				</Pressable>

				<Pressable
					onPress={onToggleSort}
					disabled={disabled}
					style={[
						appStyles.historyFilterButton,
						disabled && appStyles.historyFilterButtonDisabled,
					]}
				>
					<Ionicons name="swap-vertical" size={17} color="#FFFFFF" />
					<Text style={appStyles.historyFilterButtonText}>
						{sortOrder === 'desc' ? 'MAIS RECENTES' : 'MAIS ANTIGOS'}
					</Text>
				</Pressable>
			</ScreenCard>
		</>
	)
}
