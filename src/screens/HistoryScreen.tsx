import React, { useCallback, useMemo, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import { HistoryListEmpty } from '../components/history/HistoryListEmpty'
import { HistoryListHeader } from '../components/history/HistoryListHeader'
import { colors } from '../constants/theme'
import { useAdminRecords } from '../contexts/AdminRecordsContext'
import useHistoryFilters from '../hooks/useHistoryFilters'
import { useHistoryRecords } from '../hooks/useHistoryRecords'
import { discardPendingRecord } from '../services/offlineQueue'
import { appStyles } from '../styles/appStyles'
import type { MainTabNavigationProp } from '../types/navigation'
import { useIsOnline } from '../hooks/useIsOnline'
import { mergeAdminHistoryRecords } from '../utils/adminHistory'
import { groupRecordsByDay, type HistoryRow } from '../utils/dayGroups'
import { sortRecordsByRecency, type SortOrder } from '../utils/historyRecords'

export function HistoryScreen() {
	const { t, i18n } = useTranslation('history')
	const navigation = useNavigation<MainTabNavigationProp>()
	const {
		allRecords: ownRecords,
		isLoading,
		isRefreshing,
		loadError,
		staleSince,
		handleRefresh: refreshOwnRecords,
	} = useHistoryRecords()
	// Conta de admin: o histórico também lista os registros das outras pessoas. Essa lista fica só em
	// memória (ver AdminRecordsContext); para as demais contas o contexto fica vazio.
	const {
		isAdmin,
		viewerId,
		records: adminRecords,
		reload: reloadAdminRecords,
		refreshIfStale: refreshAdminRecords,
	} = useAdminRecords()
	const allRecords = useMemo(
		() => (isAdmin ? mergeAdminHistoryRecords(ownRecords, adminRecords, viewerId) : ownRecords),
		[isAdmin, ownRecords, adminRecords, viewerId],
	)
	const handleRefresh = useCallback(async () => {
		await Promise.all([refreshOwnRecords(), reloadAdminRecords()])
	}, [refreshOwnRecords, reloadAdminRecords])
	// O andamento ao vivo só chega para os registros do próprio admin: ao abrir a aba, atualiza se a lista passou de 1 minuto.
	useFocusEffect(
		useCallback(() => {
			refreshAdminRecords()
		}, [refreshAdminRecords]),
	)
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
	const online = useIsOnline()

	const {
		searchTerm,
		setSearchTerm,
		isFilterOpen,
		draftFilters,
		setDraftFilters,
		toggleBehaviorFilter,
		openFilters,
		applyFilters,
		clearFilters,
		filteredRecords,
		setIsFilterOpen,
	} = useHistoryFilters(allRecords)

	const orderedRecords = useMemo(
		() => sortRecordsByRecency(filteredRecords, sortOrder),
		[filteredRecords, sortOrder],
	)

	const toggleSortOrder = useCallback(() => {
		setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
	}, [])

	const openRecord = useCallback(
		(recordId: number) => {
			navigation.navigate('RecordDetail', { recordId })
		},
		[navigation],
	)

	const closeFilters = useCallback(() => setIsFilterOpen(false), [setIsFilterOpen])

	const rows = useMemo(
		() => groupRecordsByDay(orderedRecords, new Date()),
		// O idioma entra nas dependências porque os rótulos dos dias (Hoje/Today) mudam com ele.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[orderedRecords, i18n.language],
	)

	const renderItem = useCallback(
		({ item }: { item: HistoryRow }) =>
			item.kind === 'header' ? (
				<Text style={appStyles.historyDayHeader} accessibilityRole="header">
					{item.label}
				</Text>
			) : (
				<HistoryRecordCard
					item={item.item}
					analysisProgress={item.item.analysis_progress}
					onOpenRecord={openRecord}
					onDiscard={discardPendingRecord}
				/>
			),
		[openRecord],
	)

	return (
		<View style={appStyles.historyScreen}>
			<Header title={t('title')} />
			<View style={appStyles.screen}>
				<FlatList
					contentContainerStyle={appStyles.historyContent}
					data={rows}
					keyExtractor={(row) => row.key}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
					ListHeaderComponent={
						<HistoryListHeader
							staleSince={staleSince}
							offline={!online}
							searchTerm={searchTerm}
							onSearchChange={setSearchTerm}
							onOpenFilters={openFilters}
							sortOrder={sortOrder}
							onToggleSort={toggleSortOrder}
							disabled={isLoading}
						/>
					}
					ListEmptyComponent={
						<HistoryListEmpty isLoading={isLoading} loadError={loadError} />
					}
					renderItem={renderItem}
					initialNumToRender={6}
					maxToRenderPerBatch={6}
					windowSize={7}
					removeClippedSubviews
				/>
			</View>

			{isFilterOpen ? (
				<HistoryFilterModal
					draftFilters={draftFilters}
					setDraftFilters={setDraftFilters}
					toggleBehaviorFilter={toggleBehaviorFilter}
					applyFilters={applyFilters}
					clearFilters={clearFilters}
					onClose={closeFilters}
				/>
			) : null}
		</View>
	)
}

export default HistoryScreen
