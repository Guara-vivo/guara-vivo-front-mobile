import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../../styles/appStyles'
import type { SortOrder } from '../../utils/historyRecords'
import { formatDateAtTime } from '../../utils/recordFormatters'
import { colors } from '../../constants/theme'

type Props = {
	staleSince: number | null
	// Sem internet agora (mesmo que a lista tenha vindo da rede há pouco).
	offline?: boolean
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
	offline = false,
	searchTerm,
	onSearchChange,
	onOpenFilters,
	sortOrder,
	onToggleSort,
	disabled,
}: Props) {
	const { t } = useTranslation('history')
	const staleIso = staleSince !== null ? new Date(staleSince).toISOString() : null

	return (
		<View style={appStyles.historyHeaderGroup}>
			{staleIso !== null ? (
				<Text style={appStyles.historyEmptyText}>
					{t('staleServer', { when: formatDateAtTime(staleIso) })}
				</Text>
			) : offline ? (
				<Text style={appStyles.historyEmptyText}>
					{t('offline')}
				</Text>
			) : null}

			<View style={appStyles.historySearchRow}>
				<View style={appStyles.historySearchInputWrap}>
					<Ionicons name="search-outline" size={20} color={colors.muted} />
					<TextInput
						value={searchTerm}
						onChangeText={onSearchChange}
						accessibilityLabel={t('searchLabel')}
						placeholder={t('searchPlaceholder')}
						placeholderTextColor={colors.placeholder}
						style={appStyles.historySearchInput}
					/>
				</View>
				<Pressable
					onPress={onOpenFilters}
					accessibilityRole="button"
					accessibilityLabel={t('filtersButton')}
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
						? t('sort.descA11y')
						: t('sort.ascA11y')
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
					{sortOrder === 'desc' ? t('sort.desc') : t('sort.asc')}
				</Text>
			</Pressable>
		</View>
	)
}

export const HistoryListHeader = React.memo(HistoryListHeaderBase)
