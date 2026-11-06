import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { colors } from '../constants/theme'
import { useMapZoneOptions } from '../hooks/useMapZoneOptions'
import type { HistoryFilterState } from '../hooks/useHistoryFilters'
import { appStyles } from '../styles/appStyles'
import { ActionButton } from './common'
import { BehaviorsFilter } from './history/filters/BehaviorsFilter'
import { FilterSection, type FilterFieldSetter } from './history/filters/FilterSection'
import { LocationFilter } from './history/filters/LocationFilter'
import { PeriodFilter } from './history/filters/PeriodFilter'
import { QuantityFilter } from './history/filters/QuantityFilter'

type HistoryFilterSection = 'period' | 'location' | 'quantity' | 'behaviors'

export function HistoryFilterModal({
	draftFilters,
	setDraftFilters,
	toggleBehaviorFilter,
	applyFilters,
	clearFilters,
	onClose,
}: {
	draftFilters: HistoryFilterState
	setDraftFilters: React.Dispatch<React.SetStateAction<HistoryFilterState>>
	toggleBehaviorFilter: (behavior: string) => void
	applyFilters: () => void
	clearFilters: () => void
	onClose: () => void
}) {
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const zones = useMapZoneOptions()
	const [openSections, setOpenSections] = useState<Record<HistoryFilterSection, boolean>>({
		period: false,
		location: false,
		quantity: false,
		behaviors: false,
	})

	useEffect(() => {
		bottomSheetRef.current?.present()
	}, [])

	const toggleSection = (section: HistoryFilterSection) => {
		setOpenSections((current) => ({
			...current,
			[section]: !current[section],
		}))
	}

	const setField: FilterFieldSetter = (field, value) => {
		setDraftFilters((current: HistoryFilterState) => ({ ...current, [field]: value }))
	}

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	)

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={['88%']}
			enableDynamicSizing={false}
			enablePanDownToClose
			stackBehavior="push"
			backdropComponent={renderBackdrop}
			backgroundStyle={appStyles.historyBottomSheetBackground}
			handleIndicatorStyle={appStyles.historyBottomSheetIndicator}
			onChange={(index) => {
				if (index === -1) {
					onClose()
				}
			}}
		>
			<View style={appStyles.filterHeader}>
				<Text style={appStyles.filterTitle} accessibilityRole="header">
					Filtros
				</Text>
				<Pressable
					onPress={() => bottomSheetRef.current?.dismiss()}
					accessibilityRole="button"
					accessibilityLabel="Fechar filtros"
					style={appStyles.filterClose}
				>
					<Ionicons name="close" size={22} color={colors.text} />
				</Pressable>
			</View>

			<BottomSheetScrollView
				contentContainerStyle={appStyles.filterContent}
				keyboardShouldPersistTaps="handled"
			>
				<FilterSection
					iconName="calendar-outline"
					title="Período"
					isOpen={openSections.period}
					onToggle={() => toggleSection('period')}
				>
					<PeriodFilter draftFilters={draftFilters} setField={setField} />
				</FilterSection>

				<FilterSection
					iconName="location-outline"
					title="Localização"
					isOpen={openSections.location}
					onToggle={() => toggleSection('location')}
				>
					<LocationFilter draftFilters={draftFilters} setField={setField} zones={zones} />
				</FilterSection>

				<FilterSection
					iconName="people-outline"
					title="Quantidade de guarás"
					isOpen={openSections.quantity}
					onToggle={() => toggleSection('quantity')}
				>
					<QuantityFilter draftFilters={draftFilters} setField={setField} />
				</FilterSection>

				<FilterSection
					iconName="walk-outline"
					title="Comportamentos"
					isOpen={openSections.behaviors}
					onToggle={() => toggleSection('behaviors')}
				>
					<BehaviorsFilter
						selected={draftFilters.behaviors}
						onToggle={toggleBehaviorFilter}
					/>
				</FilterSection>
			</BottomSheetScrollView>

			<View style={appStyles.filterActions}>
				<ActionButton
					title="Limpar"
					variant="outline"
					fullWidth={false}
					containerStyle={appStyles.filterAction}
					onPress={clearFilters}
				/>
				<ActionButton
					title="Aplicar filtros"
					fullWidth={false}
					containerStyle={appStyles.filterAction}
					onPress={applyFilters}
				/>
			</View>
		</BottomSheetModal>
	)
}

export default HistoryFilterModal
