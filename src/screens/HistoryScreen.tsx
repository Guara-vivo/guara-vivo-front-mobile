import React, { useEffect, useState, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	View,
	Pressable,
	Text,
	TextInput,
	FlatList,
	RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import { colors } from '../constants/theme'
import { useRecordProgress } from '../contexts/RecordProgressContext'
import useHistoryFilters from '../hooks/useHistoryFilters'
import {
	fetchRecords,
	getCachedRecordsSnapshot,
	isRecordsCacheFresh,
} from '../services/recordsService'
import type { RecordProgressUpdate } from '../services/recordProgressService'
import { appStyles } from '../styles/appStyles'
import type { RecordItem } from '../types/records'
import type { MainTabParamList } from '../types/navigation'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>


function isActiveAnalysisStatus(status?: RecordItem['status']) {
	return !status || status === 'pending' || status === 'processing'
}

function mergeProgressUpdates(
	records: RecordItem[],
	updates: RecordProgressUpdate[],
) {
	if (updates.length === 0) {
		return records
	}

	const updatesById = new Map(updates.map((update) => [update.id, update]))
	return records.map((record) => {
		const update = updatesById.get(record.id)

		if (!update) {
			return record
		}

		return {
			...record,
			status: update.status,
			analysis_progress: update.analysis_progress,
		}
	})
}

export function HistoryScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { addRecordProgressListener } = useRecordProgress()
	const cachedRecords = getCachedRecordsSnapshot()
	const [records, setRecords] = useState<RecordItem[]>(cachedRecords ?? [])
	const [isLoading, setIsLoading] = useState(!cachedRecords)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [loadError, setLoadError] = useState(false)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')


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

	const hasActiveAnalysis = useMemo(
		() => records.some((record) => isActiveAnalysisStatus(record.status)),
		[records],
	)

	useEffect(() => {
		if (!hasActiveAnalysis) {
			return
		}

		return addRecordProgressListener({
			onSnapshot: (snapshot) => {
				setRecords((current) => mergeProgressUpdates(current, snapshot))
			},
			onProgress: (progress) => {
				setRecords((current) => mergeProgressUpdates(current, [progress]))
			},
		})
	}, [addRecordProgressListener, hasActiveAnalysis])


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

	const orderedRecords = useMemo(() => {
		if (sortOrder === 'desc') {
			return [...filteredRecords].sort(
				(a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
			)
		}
		return [...filteredRecords].sort(
			(a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
		)
	}, [filteredRecords, sortOrder])
	
	const openRecord = (recordId: number) => {
		navigation.navigate('RecordDetail', { recordId })
	}

	const emptyMessage = isLoading
		? 'Carregando registros...'
		: loadError
			? 'Não foi possível carregar os registros.'
			: 'Nenhum registro encontrado com os filtros atuais.'

	return (
		<View style={appStyles.historyScreen}>
			<Header title="Histórico" />
			<View style={appStyles.screen}>
				<FlatList
					contentContainerStyle={appStyles.historyContent}
					data={orderedRecords}
					keyExtractor={(item) => String(item.id)}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
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

							<Pressable
								onPress={toggleSortOrder}
								disabled={isLoading}
								style={[
									appStyles.historyFilterButton,
									isLoading && appStyles.historyFilterButtonDisabled,
								]}
							>
								<Ionicons name="swap-vertical" size={17} color="#FFFFFF" />
								<Text style={appStyles.historyFilterButtonText}>
									{sortOrder === 'desc' ? 'MAIS RECENTES' : 'MAIS ANTIGOS'}
								</Text>
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
						<HistoryRecordCard
							item={item}
							analysisProgress={item.analysis_progress}
							onOpenRecord={openRecord}
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
