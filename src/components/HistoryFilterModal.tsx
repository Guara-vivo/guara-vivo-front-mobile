import React from 'react'
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { behaviorOptions } from '../constants/behaviors'
import { colors } from '../constants/theme'
import { appStyles } from '../styles/appStyles'

interface HistoryFilterState {
	fromDate: string
	toDate: string
	location: string
	minQuantity: string
	maxQuantity: string
	behaviors: string[]
}

type HistoryFilterField =
	| 'fromDate'
	| 'toDate'
	| 'location'
	| 'minQuantity'
	| 'maxQuantity'
	| null

export function HistoryFilterModal({
	visible,
	draftFilters,
	setDraftFilters,
	toggleBehaviorFilter,
	applyFilters,
	clearFilters,
	onClose,
}: {
	visible: boolean
	draftFilters: HistoryFilterState
	setDraftFilters: React.Dispatch<React.SetStateAction<HistoryFilterState>>
	toggleBehaviorFilter: (behavior: string) => void
	applyFilters: () => void
	clearFilters: () => void
	onClose: () => void
}) {
	const [focusedField, setFocusedField] =
		React.useState<HistoryFilterField>(null)

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={appStyles.historyModalBackdrop}>
				<View style={appStyles.historyModalCard}>
					<View style={appStyles.historyModalHeader}>
						<Text style={appStyles.historyModalTitle}>FILTROS</Text>
						<Pressable onPress={onClose}>
							<Ionicons name="close" size={22} color="#1A1A1A" />
						</Pressable>
					</View>

					<ScrollView contentContainerStyle={appStyles.historyModalContent}>
						<View style={appStyles.historyFilterSection}>
							<View style={appStyles.historyFilterSectionTitleRow}>
								<Ionicons name="calendar-outline" size={15} color="#F2201F" />
								<Text style={appStyles.historyFilterSectionTitle}>PERÍODO</Text>
							</View>

							<View style={appStyles.historyDateLabelsRow}>
								<Text style={appStyles.historySmallLabel}>De</Text>
								<Text style={appStyles.historySmallLabel}>Até</Text>
							</View>

							<View style={appStyles.historyDateRow}>
								<View
									style={[
										appStyles.historyDateInputWrap,
										{
											borderColor:
												focusedField === 'fromDate'
													? colors.secondaryLight
													: colors.border,
										},
									]}
								>
									<TextInput
										value={draftFilters.fromDate}
										onChangeText={(value) =>
											setDraftFilters((current: any) => ({
												...current,
												fromDate: value,
											}))
										}
										onFocus={() => setFocusedField('fromDate')}
										onBlur={() => setFocusedField(null)}
										placeholder="dd/mm/aaaa"
										placeholderTextColor="#6B6B74"
										style={appStyles.historyDateInput}
									/>
									<Ionicons name="calendar-outline" size={14} color="#1A1A1A" />
								</View>

								<View
									style={[
										appStyles.historyDateInputWrap,
										{
											borderColor:
												focusedField === 'toDate'
													? colors.secondaryLight
													: colors.border,
										},
									]}
								>
									<TextInput
										value={draftFilters.toDate}
										onChangeText={(value) =>
											setDraftFilters((current: any) => ({
												...current,
												toDate: value,
											}))
										}
										onFocus={() => setFocusedField('toDate')}
										onBlur={() => setFocusedField(null)}
										placeholder="dd/mm/aaaa"
										placeholderTextColor="#6B6B74"
										style={appStyles.historyDateInput}
									/>
									<Ionicons name="calendar-outline" size={14} color="#1A1A1A" />
								</View>
							</View>
						</View>

						<View style={appStyles.historyFilterSection}>
							<View style={appStyles.historyFilterSectionTitleRow}>
								<Ionicons name="location-outline" size={15} color="#F2201F" />
								<Text style={appStyles.historyFilterSectionTitle}>
									LOCALIZAÇÃO
								</Text>
							</View>

							<TextInput
								value={draftFilters.location}
								onChangeText={(value) =>
									setDraftFilters((current: any) => ({
										...current,
										location: value,
									}))
								}
								onFocus={() => setFocusedField('location')}
								onBlur={() => setFocusedField(null)}
								placeholder="Ex: -24.4959, -47.8431"
								placeholderTextColor="#8E8E96"
								style={[
									appStyles.historySingleInput,
									{
										borderColor:
											focusedField === 'location'
												? colors.secondaryLight
												: colors.border,
									},
								]}
							/>
						</View>

						<View style={appStyles.historyFilterSection}>
							<View style={appStyles.historyFilterSectionTitleRow}>
								<Ionicons name="people-outline" size={15} color="#F2201F" />
								<Text style={appStyles.historyFilterSectionTitle}>
									QUANTIDADE DE INDIVÍDUOS
								</Text>
							</View>

							<View style={appStyles.historyDateLabelsRow}>
								<Text style={appStyles.historySmallLabel}>Mínimo</Text>
								<Text style={appStyles.historySmallLabel}>Máximo</Text>
							</View>

							<View style={appStyles.historyDateRow}>
								<TextInput
									value={draftFilters.minQuantity}
									onChangeText={(value) =>
										setDraftFilters((current: any) => ({
											...current,
											minQuantity: value,
										}))
									}
									onFocus={() => setFocusedField('minQuantity')}
									onBlur={() => setFocusedField(null)}
									placeholder="Min"
									placeholderTextColor="#6B6B74"
									keyboardType="numeric"
									style={[
										appStyles.historyHalfInput,
										{
											borderColor:
												focusedField === 'minQuantity'
													? colors.secondaryLight
													: colors.border,
										},
									]}
								/>

								<TextInput
									value={draftFilters.maxQuantity}
									onChangeText={(value) =>
										setDraftFilters((current: any) => ({
											...current,
											maxQuantity: value,
										}))
									}
									onFocus={() => setFocusedField('maxQuantity')}
									onBlur={() => setFocusedField(null)}
									placeholder="Max"
									placeholderTextColor="#6B6B74"
									keyboardType="numeric"
									style={[
										appStyles.historyHalfInput,
										{
											borderColor:
												focusedField === 'maxQuantity'
													? colors.secondaryLight
													: colors.border,
										},
									]}
								/>
							</View>
						</View>

						<View style={appStyles.historyFilterSection}>
							<Text style={appStyles.historyFilterSectionTitle}>
								COMPORTAMENTOS
							</Text>

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
						</View>
					</ScrollView>

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
				</View>
			</View>
		</Modal>
	)
}

export default HistoryFilterModal
