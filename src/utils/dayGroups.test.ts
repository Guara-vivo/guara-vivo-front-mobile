import type { RecordItem } from '../types/records'
import { groupRecordsByDay } from './dayGroups'

const now = new Date(2026, 10, 4, 12, 0, 0)

function rec(id: number, date: Date, extra: Partial<RecordItem> = {}): RecordItem {
	return {
		id,
		ibis_quantity: 1,
		flock_size: 'Alimentação',
		latitude: 0,
		longitude: 0,
		datetime: date.toISOString(),
		analysis_progress: 100,
		map_zones: [],
		...extra,
	}
}

describe('groupRecordsByDay', () => {
	it('retorna lista vazia sem registros', () => {
		expect(groupRecordsByDay([], now)).toEqual([])
	})

	it('junta dois registros de ontem sob um cabeçalho', () => {
		const rows = groupRecordsByDay(
			[rec(2, new Date(2026, 10, 3, 20, 0)), rec(1, new Date(2026, 10, 3, 9, 0))],
			now,
		)
		expect(rows.map((row) => row.kind)).toEqual(['header', 'record', 'record'])
		expect(rows[0]).toMatchObject({ kind: 'header', label: 'Ontem · 3 de novembro' })
	})

	it('rotula hoje como Hoje', () => {
		const rows = groupRecordsByDay([rec(1, new Date(2026, 10, 4, 8, 0))], now)
		expect(rows[0]).toMatchObject({ kind: 'header', label: 'Hoje' })
	})

	it('omite o ano quando é o atual e o mostra quando é outro', () => {
		const current = groupRecordsByDay([rec(1, new Date(2026, 6, 31, 20, 29))], now)
		const past = groupRecordsByDay([rec(1, new Date(2025, 6, 31, 20, 29))], now)
		expect(current[0]).toMatchObject({ label: '31 de julho' })
		expect(past[0]).toMatchObject({ label: '31 de julho de 2025' })
	})

	it('mantém a ordem recebida e abre novo grupo ao mudar o dia', () => {
		const rows = groupRecordsByDay(
			[
				rec(1, new Date(2026, 10, 4, 8, 0)),
				rec(2, new Date(2026, 10, 3, 8, 0)),
				rec(3, new Date(2026, 10, 4, 7, 0)),
			],
			now,
		)
		expect(rows.map((row) => (row.kind === 'header' ? row.label : row.item.id))).toEqual([
			'Hoje',
			1,
			'Ontem · 3 de novembro',
			2,
			'Hoje',
			3,
		])
	})

	it('põe registro pendente no grupo da sua data com chave única', () => {
		const rows = groupRecordsByDay(
			[rec(0, new Date(2026, 10, 4, 9, 0), { sync_state: 'pending', client_uuid: 'abc' })],
			now,
		)
		expect(rows[1]).toMatchObject({ kind: 'record', key: 'abc' })
	})
})
