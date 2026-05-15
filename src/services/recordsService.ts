import { mockRecords } from '../data/mockRecords'

export function fetchRecords() {
	// placeholder for async fetching; kept synchronous to preserve behavior
	return mockRecords
}

export default { fetchRecords }
