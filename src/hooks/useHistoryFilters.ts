import { useCallback, useMemo, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'
import {
	formatDate,
	formatTime,
	formatLocationLabel,
} from '../utils/recordFormatters'
import type { RecordItem } from '../types/records'
import { parseInputDate } from '../utils/inputDate'

const SEARCH_DEBOUNCE_MS = 250

export type HistoryFilterState = {
	fromDate: string
	toDate: string
	location: string
	minQuantity: string
	maxQuantity: string
	behaviors: string[]
}

const defaultFilters: HistoryFilterState = {
	fromDate: '',
	toDate: '',
	location: '',
	minQuantity: '',
	maxQuantity: '',
	behaviors: [],
}

const parseBehaviorTags = (value: string) =>
	value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

export function useHistoryFilters(records: RecordItem[]) {
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [appliedFilters, setAppliedFilters] =
		useState<HistoryFilterState>(defaultFilters)
	const [draftFilters, setDraftFilters] =
		useState<HistoryFilterState>(defaultFilters)

	const toggleBehaviorFilter = (behavior: string) => {
		setDraftFilters((current) => ({
			...current,
			behaviors: current.behaviors.includes(behavior)
				? current.behaviors.filter((item) => item !== behavior)
				: [...current.behaviors, behavior],
		}))
	}

	const openFilters = useCallback(() => {
		setDraftFilters(appliedFilters)
		setIsFilterOpen(true)
	}, [appliedFilters])

	const applyFilters = () => {
		setAppliedFilters(draftFilters)
		setIsFilterOpen(false)
	}

	const clearFilters = () => {
		setDraftFilters(defaultFilters)
		setAppliedFilters(defaultFilters)
		setIsFilterOpen(false)
	}

	const filteredRecords = useMemo(() => {
		const query = debouncedSearchTerm.trim().toLowerCase()
		const fromDate = parseInputDate(appliedFilters.fromDate)
		const toDate = parseInputDate(appliedFilters.toDate)
		const locationQuery = appliedFilters.location.trim().toLowerCase()
		const minQuantity = Number(appliedFilters.minQuantity)
		const maxQuantity = Number(appliedFilters.maxQuantity)
		const hasMinQuantity =
			appliedFilters.minQuantity.trim() !== '' && !Number.isNaN(minQuantity)
		const hasMaxQuantity =
			appliedFilters.maxQuantity.trim() !== '' && !Number.isNaN(maxQuantity)
		const selectedBehaviors = appliedFilters.behaviors.map((behavior) =>
			behavior.toLowerCase(),
		)

		return records.filter((record) => {
			const recordDate = new Date(record.datetime)
			const recordDateOnly = new Date(
				recordDate.getFullYear(),
				recordDate.getMonth(),
				recordDate.getDate(),
			)
			const locationLabel = formatLocationLabel(
				record.latitude,
				record.longitude,
			).toLowerCase()
			const behaviorTags = parseBehaviorTags(record.flock_size).map((tag) =>
				tag.toLowerCase(),
			)
			const zoneNames = record.map_zones.map((zone) => zone.name.toLowerCase())

			if (query) {
				const searchableContent = [
					`#${String(record.id).padStart(3, '0')}`,
					formatDate(record.datetime),
					formatTime(record.datetime),
					locationLabel,
					record.flock_size,
					String(record.ibis_quantity),
					...zoneNames,
				]
					.join(' ')
					.toLowerCase()

				if (!searchableContent.includes(query)) {
					return false
				}
			}

			if (fromDate && recordDateOnly < fromDate) {
				return false
			}

			if (toDate) {
				const endOfDay = new Date(toDate)
				endOfDay.setHours(23, 59, 59, 999)

				if (recordDate > endOfDay) {
					return false
				}
			}

			if (locationQuery && !zoneNames.includes(locationQuery)) {
				return false
			}

			if (hasMinQuantity && record.ibis_quantity < minQuantity) {
				return false
			}

			if (hasMaxQuantity && record.ibis_quantity > maxQuantity) {
				return false
			}

			if (
				selectedBehaviors.length > 0 &&
				!behaviorTags.some((tag) => selectedBehaviors.includes(tag))
			) {
				return false
			}

			return true
		})
	}, [appliedFilters, records, debouncedSearchTerm])

	return {
		searchTerm,
		setSearchTerm,
		isFilterOpen,
		setIsFilterOpen,
		appliedFilters,
		draftFilters,
		setDraftFilters,
		toggleBehaviorFilter,
		openFilters,
		applyFilters,
		clearFilters,
		filteredRecords,
	}
}

export default useHistoryFilters
