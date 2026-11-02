import type { RecordItem } from '../types/records'
import {
	isActiveAnalysisStatus,
	mergeProgressUpdates,
	sortRecordsByDate,
} from './historyRecords'

const record = (id: number, datetime: string) =>
	({ id, datetime, status: 'processing', analysis_progress: 10 }) as unknown as RecordItem

describe('isActiveAnalysisStatus', () => {
	it('considera ativo quando sem status, pending ou processing', () => {
		expect(isActiveAnalysisStatus(undefined)).toBe(true)
		expect(isActiveAnalysisStatus('pending')).toBe(true)
		expect(isActiveAnalysisStatus('processing')).toBe(true)
	})

	it('considera finalizado nos demais status', () => {
		expect(isActiveAnalysisStatus('completed')).toBe(false)
	})
})

describe('mergeProgressUpdates', () => {
	const list = [record(1, '2026-01-01T10:00:00Z'), record(2, '2026-01-02T10:00:00Z')]

	it('devolve a mesma lista quando não há atualizações', () => {
		expect(mergeProgressUpdates(list, [])).toBe(list)
	})

	it('atualiza apenas o registro correspondente', () => {
		const result = mergeProgressUpdates(list, [
			{ id: 2, status: 'completed', analysis_progress: 100 },
		] as never)

		expect(result[0]).toBe(list[0])
		expect(result[1]).toMatchObject({ id: 2, status: 'completed', analysis_progress: 100 })
	})
})

describe('sortRecordsByDate', () => {
	const list = [
		record(1, '2026-01-02T10:00:00Z'),
		record(2, '2026-01-03T10:00:00Z'),
		record(3, '2026-01-01T10:00:00Z'),
	]

	it('ordena do mais recente para o mais antigo em desc', () => {
		expect(sortRecordsByDate(list, 'desc').map((item) => item.id)).toEqual([2, 1, 3])
	})

	it('ordena do mais antigo para o mais recente em asc', () => {
		expect(sortRecordsByDate(list, 'asc').map((item) => item.id)).toEqual([3, 1, 2])
	})

	it('não altera a lista original', () => {
		sortRecordsByDate(list, 'asc')
		expect(list.map((item) => item.id)).toEqual([1, 2, 3])
	})
})
