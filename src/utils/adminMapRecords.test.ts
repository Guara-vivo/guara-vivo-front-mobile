import {
	filterRecordsByLayer,
	getRecordMarkerKind,
	focusedMarkerRadius,
	isAdminViewOfRecord,
	shouldShowRecordBalloon,
} from './adminMapRecords'
import type { MapZoneRead, MapZoneRecordRead } from '../types/api'

function makeRecord(overrides: Partial<MapZoneRecordRead> = {}): MapZoneRecordRead {
	return {
		id: 1,
		images: [],
		latitude_camera: -24.5,
		longitude_camera: -47.8,
		behavior: ['voando'],
		date_time: '2026-06-04T10:00:00Z',
		user_id: 7,
		status: 'completed',
		analysis_progress: 100,
		map_zones: [],
		analysis_id: 1,
		ibis_quantity: 2,
		author_name: 'Ana Silva',
		...overrides,
	}
}

describe('filterRecordsByLayer', () => {
	const feeding = makeRecord({ id: 1, map_zones: [{ id: 1, type: 'feeding', name: 'Alimentação A' }] })
	const nest = makeRecord({ id: 2, map_zones: [{ id: 2, type: 'nest', name: 'Ninho A' }] })
	const loose = makeRecord({ id: 3, map_zones: [] })
	const both = makeRecord({
		id: 4,
		map_zones: [
			{ id: 1, type: 'feeding', name: 'Alimentação A' },
			{ id: 2, type: 'nest', name: 'Ninho A' },
		],
	})
	const all = [feeding, nest, loose, both]

	it('em "todas" mantém todos, inclusive os que não estão em nenhuma zona', () => {
		expect(filterRecordsByLayer(all, 'all').map((r) => r.id)).toEqual([1, 2, 3, 4])
	})

	it('em "alimentação" mantém os ligados a uma zona de alimentação', () => {
		expect(filterRecordsByLayer(all, 'feeding').map((r) => r.id)).toEqual([1, 4])
	})

	it('em "ninhos" mantém os ligados a uma zona de ninho', () => {
		expect(filterRecordsByLayer(all, 'nests').map((r) => r.id)).toEqual([2, 4])
	})
})

describe('getRecordMarkerKind', () => {
	it('registro próprio com guará usa o marcador de guará normal', () => {
		expect(getRecordMarkerKind(makeRecord({ user_id: 7 }), 7)).toBe('own-hit')
	})

	it('registro de outra pessoa com guará usa o marcador laranja', () => {
		expect(getRecordMarkerKind(makeRecord({ user_id: 8 }), 7)).toBe('other-hit')
	})

	it('registro sem guará, pendente ou com falha vira ponto simples', () => {
		expect(getRecordMarkerKind(makeRecord({ user_id: 7, ibis_quantity: 0 }), 7)).toBe('own-plain')
		expect(getRecordMarkerKind(makeRecord({ user_id: 7, ibis_quantity: null }), 7)).toBe('own-plain')
		expect(getRecordMarkerKind(makeRecord({ user_id: 8, status: 'pending', ibis_quantity: null }), 7)).toBe('other-plain')
		expect(getRecordMarkerKind(makeRecord({ user_id: 8, status: 'failed', ibis_quantity: 3 }), 7)).toBe('other-plain')
	})

	it('sem usuário conhecido, trata tudo como de outra pessoa', () => {
		expect(getRecordMarkerKind(makeRecord({ user_id: 7 }), null)).toBe('other-hit')
	})
})

describe('isAdminViewOfRecord', () => {
	it('é visão de administrador quando o admin olha o registro de outra pessoa', () => {
		expect(isAdminViewOfRecord(8, { isAdmin: true, id: 7 })).toBe(true)
	})

	it('não é quando o admin olha o próprio registro', () => {
		expect(isAdminViewOfRecord(7, { isAdmin: true, id: 7 })).toBe(false)
	})

	it('não é para quem não é admin, nem sem usuário ou sem dono conhecido', () => {
		expect(isAdminViewOfRecord(8, { isAdmin: false, id: 7 })).toBe(false)
		expect(isAdminViewOfRecord(8, { isAdmin: true, id: null })).toBe(false)
		expect(isAdminViewOfRecord(undefined, { isAdmin: true, id: 7 })).toBe(false)
	})
})

describe('shouldShowRecordBalloon', () => {
	const zone: MapZoneRead = {
		id: 1,
		type: 'feeding',
		name: 'Alimentação A',
		sequence_index: 1,
		latitude: -24.5,
		longitude: -47.8,
		radius_meters: 50,
		user_id: 7,
		created_at: '2026-06-04T10:00:00Z',
	}

	it('shows the balloon when no zone sheet is open', () => {
		expect(shouldShowRecordBalloon(5, null, [])).toBe(true)
	})

	it('shows the balloon when a zone sheet is open but the record is not in its list', () => {
		expect(shouldShowRecordBalloon(5, zone, [makeRecord({ id: 6 })])).toBe(true)
	})

	it('does not show the balloon for a record listed in the open zone sheet', () => {
		expect(shouldShowRecordBalloon(5, zone, [makeRecord({ id: 5 })])).toBe(false)
	})

	it('ignores the zone list when no zone is selected', () => {
		expect(shouldShowRecordBalloon(5, null, [makeRecord({ id: 5 })])).toBe(true)
	})
})

describe('focusedMarkerRadius', () => {
	it('is the radius of the focused marker image: 29 dp for a guará, 15 dp for a plain dot', () => {
		expect(focusedMarkerRadius('own-hit')).toBe(29)
		expect(focusedMarkerRadius('other-hit')).toBe(29)
		expect(focusedMarkerRadius('own-plain')).toBe(15)
		expect(focusedMarkerRadius('other-plain')).toBe(15)
	})
})
