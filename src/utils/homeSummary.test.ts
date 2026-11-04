import { summarizeRecords } from './homeSummary'

const now = new Date(2026, 10, 4, 12, 0, 0)

function record(datetime: Date, ibis = 1, zoneIds: number[] = []) {
	return {
		datetime: datetime.toISOString(),
		ibis_quantity: ibis,
		map_zones: zoneIds.map((id) => ({ id })),
	}
}

describe('summarizeRecords', () => {
	it('retorna zeros sem registros', () => {
		expect(summarizeRecords([], now)).toEqual({ weekRecords: 0, ibis: 0, areas: 0 })
	})

	it('conta um registro de exatamente 7 dias atrás', () => {
		const sevenDaysAgo = new Date(2026, 10, 4 - 7, 12, 0, 0)
		expect(summarizeRecords([record(sevenDaysAgo)], now).weekRecords).toBe(1)
	})

	it('ignora um registro de 8 dias atrás', () => {
		const eightDaysAgo = new Date(2026, 10, 4 - 8, 12, 0, 0)
		expect(summarizeRecords([record(eightDaysAgo, 5, [1])], now)).toEqual({
			weekRecords: 0,
			ibis: 0,
			areas: 0,
		})
	})

	it('soma guarás e conta áreas distintas', () => {
		const yesterday = new Date(2026, 10, 3, 9, 0, 0)
		const today = new Date(2026, 10, 4, 8, 0, 0)
		expect(
			summarizeRecords([record(yesterday, 2, [1, 2]), record(today, 3, [2])], now),
		).toEqual({ weekRecords: 2, ibis: 5, areas: 2 })
	})

	it('ignora datas inválidas', () => {
		expect(
			summarizeRecords([{ datetime: 'lixo', ibis_quantity: 4, map_zones: [] }], now).weekRecords,
		).toBe(0)
	})
})
