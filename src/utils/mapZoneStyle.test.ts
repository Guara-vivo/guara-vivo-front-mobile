import {
	filterZonesByLayer,
	getLayerBadgeText,
	getZoneCircleColors,
} from './mapZoneStyle'
import type { MapZoneRead } from '../types/api'

const feeding = { id: 1, type: 'feeding' } as MapZoneRead
const nest = { id: 2, type: 'nest' } as MapZoneRead

describe('filterZonesByLayer', () => {
	it('mostra todas as zonas na camada "all"', () => {
		expect(filterZonesByLayer([feeding, nest], 'all')).toEqual([feeding, nest])
	})

	it('separa alimentacao e ninhos', () => {
		expect(filterZonesByLayer([feeding, nest], 'feeding')).toEqual([feeding])
		expect(filterZonesByLayer([feeding, nest], 'nests')).toEqual([nest])
	})
})

describe('getZoneCircleColors', () => {
	it('usa a cor do tipo quando nada esta selecionado', () => {
		expect(getZoneCircleColors(nest, null).fill).toBe('#2f6ee43a')
		expect(getZoneCircleColors(feeding, undefined).fill).toBe('#e5383556')
	})

	it('destaca a selecionada e deixa as outras cinza', () => {
		expect(getZoneCircleColors(nest, 2)).toEqual({ fill: '#2f6ee466', stroke: '#2f6ee4' })
		expect(getZoneCircleColors(feeding, 2)).toEqual({
			fill: 'rgba(107, 114, 128, 0.18)',
			stroke: 'rgba(107, 114, 128, 0.36)',
		})
	})
})

describe('getLayerBadgeText', () => {
	it('descreve cada camada', () => {
		expect(getLayerBadgeText('all')).toBe('áreas')
		expect(getLayerBadgeText('feeding')).toBe('alimentação')
		expect(getLayerBadgeText('nests')).toBe('ninhos')
	})
})
