import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	View,
	Pressable,
	Text,
	TextInput,
	FlatList,
	RefreshControl,
	Animated,
} from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import { colors } from '../constants/theme'
import useHistoryFilters from '../hooks/useHistoryFilters'
import usePullRefreshAnimation from '../hooks/usePullRefreshAnimation'
import {
	fetchRecords,
	getCachedRecordsSnapshot,
	isRecordsCacheFresh,
} from '../services/recordsService'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'
import type { RecordItem } from '../types/records'

export function HistoryScreen({
	onNavigate,
	onOpenRecord,
}: {
	onNavigate: (screen: ScreenId) => void
	onOpenRecord: (recordId: number) => void
}) {
	const cachedRecords = getCachedRecordsSnapshot()
	const [records, setRecords] = useState<RecordItem[]>(cachedRecords ?? [])
	const [isLoading, setIsLoading] = useState(!cachedRecords)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [loadError, setLoadError] = useState(false)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const { animatedPullStyle, handlePullScroll } =
		usePullRefreshAnimation(isRefreshing)

	useEffect(() => {
		const controller = new AbortController()
		let mounted = true
		const cached = getCachedRecordsSnapshot()
		const hasCachedRecords = Boolean(cached)

		if (cached) {
			setRecords(cached)
		}

		setIsLoading(!hasCachedRecords)
		setLoadError(false)
		fetchRecords(
			{ force: hasCachedRecords && !isRecordsCacheFresh() },
			controller.signal,
		)
			.then((items) => {
				if (mounted) {
					setRecords(items)
				}
			})
			.catch((error) => {
				if (mounted && error.name !== 'AbortError') {
					setLoadError(!hasCachedRecords)
				}
			})
			.finally(() => {
				if (mounted && !hasCachedRecords) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
			controller.abort()
		}
	}, [])

	const handleRefresh = async () => {
		setIsRefreshing(true)
		setLoadError(false)

		try {
			const items = await fetchRecords({ force: true })
			setRecords(items)
		} catch {
			setLoadError(records.length === 0)
		} finally {
			setIsRefreshing(false)
			setIsLoading(false)
		}
	}

	const toggleSortOrder = () => {
		setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
	}

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
	} = useHistoryFilters(records)

	const emptyMessage = isLoading
		? 'Carregando registros...'
		: loadError
			? 'Nao foi possivel carregar os registros.'
			: 'Nenhum registro encontrado com os filtros atuais.'

	return (
		<View style={appStyles.historyScreen}>
			<Header title="Histórico" />
			<Animated.View style={[appStyles.screen, animatedPullStyle]}>
				<FlatList
					contentContainerStyle={appStyles.historyContent}
					data={filteredRecords}
					keyExtractor={(item) => String(item.id)}
					onScroll={handlePullScroll}
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
							progressViewOffset={-50}
						/>
					}
					ListHeaderComponent={
						<ScreenCard style={appStyles.historySearchCard}>
							<View style={appStyles.historySearchInputWrap}>
								<Ionicons name="search-outline" size={19} color="#5C8BD6" />
								<TextInput
									value={searchTerm}
									onChangeText={setSearchTerm}
									placeholder="Buscar por local, data..."
									placeholderTextColor="#8E8E96"
									style={appStyles.historySearchInput}
								/>
							</View>

							<Pressable
								onPress={openFilters}
								disabled={isLoading}
								style={[
									appStyles.historyFilterButton,
									isLoading && appStyles.historyFilterButtonDisabled,
								]}
							>
								<Ionicons name="funnel-outline" size={17} color="#FFFFFF" />
								<Text style={appStyles.historyFilterButtonText}>FILTROS</Text>
							</Pressable>
						</ScreenCard>
					}
					ListEmptyComponent={
						<View style={appStyles.historyEmptyWrap}>
							{isLoading ? (
								<ActivityIndicator
									color={colors.muted}
									size="small"
									style={appStyles.historyLoadingIcon}
								/>
							) : null}
							<Text style={appStyles.historyEmptyText}>{emptyMessage}</Text>
						</View>
					}
					renderItem={({ item }: { item: RecordItem }) => (
						<HistoryRecordCard item={item} onOpenRecord={onOpenRecord} />
					)}
				/>
			</Animated.View>

			<HistoryFilterModal
				visible={isFilterOpen}
				draftFilters={draftFilters}
				setDraftFilters={setDraftFilters}
				toggleBehaviorFilter={toggleBehaviorFilter}
				applyFilters={applyFilters}
				clearFilters={clearFilters}
				onClose={() => setIsFilterOpen(false)}
			/>
		</View>
	)
}

export default HistoryScreen
