import type { MapZoneRead } from '../types/api'

export function shouldRenderMapZoneDetailSheet(selectedZone: MapZoneRead | null) {
	return selectedZone !== null
}

export function shouldRenderMapZoneDeleteConfirmSheet(showDeleteConfirm: boolean) {
	return showDeleteConfirm
}
