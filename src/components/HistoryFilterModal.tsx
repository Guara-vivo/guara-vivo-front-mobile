import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	Pressable,
	Text,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
	type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { behaviorOptions } from '../constants/behaviors'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'
import type { HistoryFilterState } from '../hooks/useHistoryFilters'

type HistoryFilterSection = 'period' | 'location' | 'quantity' | 'behaviors'

type SectionHeaderProps = {
	iconName: React.ComponentProps<typeof Ionicons>['name']
	title: string
	isOpen: boolean
	onPress: () => void
}

function SectionHeader({ iconName, title, isOpen, onPress }: SectionHeaderProps) {
	return (
		<Pressable onPress={onPress} style={appStyles.historyFilterSectionHeader}>
			<View style={appStyles.historyFilterSectionTitleRow}>
				<Ionicons name={iconName} size={15} color="#F2201F" />
				<Text style={appStyles.historyFilterSectionTitle}>{title}</Text>
			</View>
			<Ionicons
				name={isOpen ? 'chevron-up' : 'chevron-down'}
				size={18}
				color={colors.text}
			/>
		</Pressable>
	)
}

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
			<View style={appStyles.historyModalHeader}>
				<Text style={appStyles.historyModalTitle}>FILTROS</Text>
			</View>

			<BottomSheetScrollView
				contentContainerStyle={appStyles.historyModalContent}
				keyboardShouldPersistTaps="handled"
			>
						<View style={appStyles.historyFilterSection}>
							<SectionHeader
								iconName="calendar-outline"
								title="PERÍODO"
								isOpen={openSections.period}
								onPress={() => toggleSection('period')}
							/>

							{openSections.period ? (
								<>
									<View style={appStyles.historyDateLabelsRow}>
										<Text style={appStyles.historySmallLabel}>De</Text>
										<Text style={appStyles.historySmallLabel}>Até</Text>
									</View>

					<View style={appStyles.historyDateRow}>
								<View style={appStyles.historyDateInputWrap}>
									<BottomSheetTextInput
										value={draftFilters.fromDate}
										onChangeText={(value) =>
											setDraftFilters((current: HistoryFilterState) => ({
												...current,
												fromDate: value,
											}))
										}
										placeholder="dd/mm/aaaa"
										placeholderTextColor="#6B6B74"
										style={appStyles.historyDateInput}
									/>
									<Ionicons name="calendar-outline" size={14} color="#1A1A1A" />
								</View>

								<View style={appStyles.historyDateInputWrap}>
									<BottomSheetTextInput
										value={draftFilters.toDate}
										onChangeText={(value) =>
											setDraftFilters((current: HistoryFilterState) => ({
												...current,
												toDate: value,
											}))
										}
										placeholder="dd/mm/aaaa"
										placeholderTextColor="#6B6B74"
										style={appStyles.historyDateInput}
									/>
									<Ionicons name="calendar-outline" size={14} color="#1A1A1A" />
								</View>
									</View>
								</>
							) : null}
						</View>

						<View style={appStyles.historyFilterSection}>
							<SectionHeader
								iconName="location-outline"
								title="LOCALIZAÇÃO"
								isOpen={openSections.location}
								onPress={() => toggleSection('location')}
							/>

							{openSections.location ? (
							<BottomSheetTextInput
								value={draftFilters.location}
								onChangeText={(value) =>
									setDraftFilters((current: HistoryFilterState) => ({
										...current,
										location: value,
									}))
								}
								placeholder="Ex: -24.4959, -47.8431"
								placeholderTextColor="#8E8E96"
								style={appStyles.historySingleInput}
							/>
							) : null}
						</View>

						<View style={appStyles.historyFilterSection}>
							<SectionHeader
								iconName="people-outline"
								title="QUANTIDADE DE INDIVÍDUOS"
								isOpen={openSections.quantity}
								onPress={() => toggleSection('quantity')}
							/>

							{openSections.quantity ? (
								<>
									<View style={appStyles.historyDateLabelsRow}>
										<Text style={appStyles.historySmallLabel}>Mínimo</Text>
										<Text style={appStyles.historySmallLabel}>Máximo</Text>
									</View>

									<View style={appStyles.historyDateRow}>
								<BottomSheetTextInput
									value={draftFilters.minQuantity}
									onChangeText={(value) =>
										setDraftFilters((current: HistoryFilterState) => ({
											...current,
											minQuantity: value,
										}))
									}
									placeholder="Min"
									placeholderTextColor="#6B6B74"
									keyboardType="numeric"
									style={appStyles.historyHalfInput}
								/>

								<BottomSheetTextInput
									value={draftFilters.maxQuantity}
									onChangeText={(value) =>
										setDraftFilters((current: HistoryFilterState) => ({
											...current,
											maxQuantity: value,
										}))
									}
									placeholder="Max"
									placeholderTextColor="#6B6B74"
									keyboardType="numeric"
									style={appStyles.historyHalfInput}
								/>
									</View>
								</>
							) : null}
						</View>

						<View style={appStyles.historyFilterSection}>
							<SectionHeader
								iconName="walk-outline"
								title="COMPORTAMENTOS"
								isOpen={openSections.behaviors}
								onPress={() => toggleSection('behaviors')}
							/>

							{openSections.behaviors ? (
								<View style={appStyles.historyBehaviorList}>
								{behaviorOptions.map((behavior) => {
									const active = draftFilters.behaviors.includes(behavior)

									return (
										<Pressable
											key={behavior}
											onPress={() => toggleBehaviorFilter(behavior)}
											style={appStyles.historyBehaviorItem}
										>
											<View
												style={[
													appStyles.historyBehaviorCheckbox,
													active && appStyles.historyBehaviorCheckboxActive,
												]}
											>
												{active ? (
													<Ionicons
														name="checkmark"
														size={12}
														color="#FFFFFF"
													/>
												) : null}
											</View>
											<Text style={appStyles.historyBehaviorLabel}>
												{behavior}
											</Text>
										</Pressable>
									)
								})}
							</View>
							) : null}
						</View>
					</BottomSheetScrollView>

					<View style={appStyles.historyModalActions}>
						<Pressable
							onPress={clearFilters}
							style={appStyles.historyClearButton}
						>
							<Text style={appStyles.historyClearButtonText}>LIMPAR</Text>
						</Pressable>

						<Pressable
							onPress={applyFilters}
							style={appStyles.historyApplyButton}
						>
							<Text style={appStyles.historyApplyButtonText}>
								APLICAR FILTROS
							</Text>
						</Pressable>
					</View>
		</BottomSheetModal>
	)
}

export default HistoryFilterModal
