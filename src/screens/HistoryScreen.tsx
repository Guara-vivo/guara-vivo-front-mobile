import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, Pressable, Text, TextInput, FlatList } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import HistoryFilterModal from '../components/HistoryFilterModal'
import HistoryRecordCard from '../components/HistoryRecordCard'
import useHistoryFilters from '../hooks/useHistoryFilters'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function HistoryScreen({
	onNavigate,
	onOpenRecord,
}: {
	onNavigate: (screen: ScreenId) => void
	onOpenRecord: (recordId: number) => void
}) {
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
	} = useHistoryFilters()

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
							style={appStyles.historyFilterButton}
						>
							<Ionicons name="funnel-outline" size={17} color="#FFFFFF" />
							<Text style={appStyles.historyFilterButtonText}>FILTROS</Text>
						</Pressable>
					</ScreenCard>
				}
				ListEmptyComponent={
					<View style={appStyles.historyEmptyWrap}>
						<Text style={appStyles.historyEmptyText}>
							Nenhum registro encontrado com os filtros atuais.
						</Text>
					</View>
				}
				renderItem={({ item }: { item: any }) => (
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
