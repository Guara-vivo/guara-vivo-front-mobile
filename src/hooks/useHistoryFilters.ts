import { useMemo, useState } from 'react'
import {
	mockRecords,
	formatDate,
	formatTime,
	formatLocationLabel,
} from '../data/mockRecords'

type HistoryFilters = {
	fromDate: string
	toDate: string
	location: string
	minQuantity: string
	maxQuantity: string
	behaviors: string[]
}

const defaultFilters: HistoryFilters = {
	fromDate: '',
	toDate: '',
	location: '',
	minQuantity: '',
	maxQuantity: '',
	behaviors: [],
}

function parseInputDate(value: string) {
	const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

	if (!match) {
		return null
	}

	const day = Number(match[1])
	const month = Number(match[2])
	const year = Number(match[3])
	const parsed = new Date(year, month - 1, day, 0, 0, 0, 0)

	if (Number.isNaN(parsed.getTime())) {
		return null
	}

	return parsed
}

const parseBehaviorTags = (value: string) =>
	value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

export function useHistoryFilters() {
	const [searchTerm, setSearchTerm] = useState('')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [appliedFilters, setAppliedFilters] =
		useState<HistoryFilters>(defaultFilters)
	const [draftFilters, setDraftFilters] =
		useState<HistoryFilters>(defaultFilters)

	const toggleBehaviorFilter = (behavior: string) => {
		setDraftFilters((current) => ({
			...current,
			behaviors: current.behaviors.includes(behavior)
				? current.behaviors.filter((item) => item !== behavior)
				: [...current.behaviors, behavior],
		}))
	}

	const openFilters = () => {
		setDraftFilters(appliedFilters)
		setIsFilterOpen(true)
	}

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
		const query = searchTerm.trim().toLowerCase()
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

		return mockRecords.filter((record) => {
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

			if (query) {
				const searchableContent = [
					`#${String(record.id).padStart(3, '0')}`,
					formatDate(record.datetime),
					formatTime(record.datetime),
					locationLabel,
					record.flock_size,
					String(record.ibis_quantity),
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

			if (locationQuery && !locationLabel.includes(locationQuery)) {
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
	}, [appliedFilters, searchTerm])

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
