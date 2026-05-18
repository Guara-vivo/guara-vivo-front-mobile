import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
	ActivityIndicator,
	View,
	Pressable,
	Text,
	TextInput,
	FlatList,
} from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import { colors } from '../constants/theme'
import useHistoryFilters from '../hooks/useHistoryFilters'
import { fetchRecords } from '../services/recordsService'
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
	const [records, setRecords] = useState<RecordItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	useEffect(() => {
		let mounted = true

		setIsLoading(true)
		setLoadError(false)
		fetchRecords()
			.then((items) => {
				if (mounted) {
					setRecords(items)
				}
			})
			.catch(() => {
				if (mounted) {
					setLoadError(true)
				}
			})
			.finally(() => {
				if (mounted) {
					setIsLoading(false)
				}
			})

		return () => {
			mounted = false
		}
	}, [])

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
			<FlatList
				contentContainerStyle={appStyles.historyContent}
				data={filteredRecords}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
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
