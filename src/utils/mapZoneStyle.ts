import type { MapLayerId } from '../config/map'
import type { MapZoneRead } from '../types/api'

export function filterZonesByLayer(zones: MapZoneRead[], layer: MapLayerId) {
	return zones.filter((zone) => {
		if (layer === 'all') {
			return true
		}

		if (layer === 'feeding') {
			return zone.type === 'feeding'
		}

		return zone.type === 'nest'
	})
}

// Sem zona selecionada, todas aparecem na cor do tipo; com uma selecionada, ela destaca
// e as outras ficam cinza.
export function getZoneCircleColors(
	zone: Pick<MapZoneRead, 'id' | 'type'>,
	selectedZoneId?: number | null,
) {
	const hasSelectedZone = selectedZoneId !== null && selectedZoneId !== undefined
	const selected = zone.id === selectedZoneId
	const isNest = zone.type === 'nest'

	if (!hasSelectedZone) {
		return {
			fill: isNest ? '#2f6ee43a' : '#e5383556',
			stroke: isNest ? 'rgba(47, 111, 228, 0.4)' : 'rgba(229, 57, 53, 0.4)',
		}
	}

	if (selected) {
		return {
			fill: isNest ? '#2f6ee466' : '#e5383566',
			stroke: isNest ? '#2f6ee4' : '#e53835',
		}
	}

	return {
		fill: 'rgba(107, 114, 128, 0.18)',
		stroke: 'rgba(107, 114, 128, 0.36)',
	}
}

export function getLayerBadgeText(layer: MapLayerId) {
	if (layer === 'all') {
		return 'áreas'
	}

	return layer === 'feeding' ? 'alimentação' : 'ninhos'
}
