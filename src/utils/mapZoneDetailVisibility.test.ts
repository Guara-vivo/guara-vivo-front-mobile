import {
	shouldRenderMapZoneDeleteConfirmSheet,
	shouldRenderMapZoneDetailSheet,
} from './mapZoneDetailVisibility'
import type { MapZoneRead } from '../types/api'

const selectedZone: MapZoneRead = {
	id: 1,
	type: 'feeding',
	name: 'Alimentação A',
	sequence_index: 0,
	latitude: -23.1,
	longitude: -45.1,
	radius_meters: 100,
	user_id: 1,
	created_at: '2026-06-10T12:00:00Z',
}

describe('map zone detail visibility', () => {
	it('keeps delete confirmation visible after zone detail unmounts', () => {
		expect(shouldRenderMapZoneDetailSheet(null)).toBe(false)
		expect(shouldRenderMapZoneDeleteConfirmSheet(true)).toBe(true)
	})

	it('shows zone detail only while a zone is selected', () => {
		expect(shouldRenderMapZoneDetailSheet(selectedZone)).toBe(true)
		expect(shouldRenderMapZoneDetailSheet(null)).toBe(false)
	})

	it('hides delete confirmation when it is not requested', () => {
		expect(shouldRenderMapZoneDeleteConfirmSheet(false)).toBe(false)
	})
})
