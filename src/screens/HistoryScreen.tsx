import React, { useMemo, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import Header from '../components/Header'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import { HistoryListEmpty } from '../components/history/HistoryListEmpty'
import { HistoryListHeader } from '../components/history/HistoryListHeader'
import { colors } from '../constants/theme'
import useHistoryFilters from '../hooks/useHistoryFilters'
import { useHistoryRecords } from '../hooks/useHistoryRecords'
import { discardPendingRecord } from '../services/offlineQueue'
import { appStyles } from '../styles/appStyles'
import type { MainTabParamList } from '../types/navigation'
import type { RecordItem } from '../types/records'
import { sortRecordsByDate, type SortOrder } from '../utils/historyRecords'
import { recordKey } from '../utils/pendingRecords'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

export function HistoryScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { allRecords, isLoading, isRefreshing, loadError, staleSince, handleRefresh } =
		useHistoryRecords()
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

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
		() => sortRecordsByDate(filteredRecords, sortOrder),
		[filteredRecords, sortOrder],
	)

	const toggleSortOrder = () => {
		setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
	}

	const openRecord = (recordId: number) => {
		navigation.navigate('RecordDetail', { recordId })
	}

	return (
		<View style={appStyles.historyScreen}>
			<Header title="Histórico" />
			<View style={appStyles.screen}>
				<FlatList
					contentContainerStyle={appStyles.historyContent}
					data={orderedRecords}
					keyExtractor={recordKey}
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
					renderItem={({ item }: { item: RecordItem }) => (
						<HistoryRecordCard
							item={item}
							analysisProgress={item.analysis_progress}
							onOpenRecord={openRecord}
							onDiscard={discardPendingRecord}
						/>
					)}
				/>
			</View>

			{isFilterOpen ? (
				<HistoryFilterModal
					draftFilters={draftFilters}
					setDraftFilters={setDraftFilters}
					toggleBehaviorFilter={toggleBehaviorFilter}
					applyFilters={applyFilters}
					clearFilters={clearFilters}
					onClose={() => setIsFilterOpen(false)}
				/>
			) : null}
		</View>
	)
}

export default HistoryScreen
