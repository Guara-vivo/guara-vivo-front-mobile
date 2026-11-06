import type { RecordItem } from '../types/records'
import {
	isActiveAnalysisStatus,
	isAnalysisInProgress,
	mergeProgressUpdates,
	needsRecordsRefresh,
	getLatestRecord,
	sortRecordsByRecency,
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

describe('contagem após o fim da análise', () => {
	const active = record(1, '2026-01-01T10:00:00Z')

	it('marca a contagem como pendente quando a análise termina em tempo real', () => {
		const [result] = mergeProgressUpdates([active], [
			{ id: 1, status: 'completed', analysis_progress: 100 },
		] as never)

		expect(result.count_pending).toBe(true)
		expect(isAnalysisInProgress(result)).toBe(true)
	})

	it('não marca quando o registro já estava concluído', () => {
		const done = { ...active, status: 'completed' } as RecordItem
		const [result] = mergeProgressUpdates([done], [
			{ id: 1, status: 'completed', analysis_progress: 100 },
		] as never)

		expect(result.count_pending).toBeUndefined()
		expect(isAnalysisInProgress(result)).toBe(false)
	})

	it('considera em análise enquanto ativo e não considera registro só do aparelho', () => {
		expect(isAnalysisInProgress(active)).toBe(true)
		expect(isAnalysisInProgress({ ...active, sync_state: 'pending' } as RecordItem)).toBe(false)
	})
})

describe('sortRecordsByRecency', () => {
	// A data do avistamento pode ser retroativa; a ordem vale pela criação (id).
	const list = [
		record(1, '2026-01-02T10:00:00Z'),
		record(3, '2026-01-01T10:00:00Z'),
		record(2, '2026-01-03T10:00:00Z'),
	]

	it('ordena do mais recente para o mais antigo pelo id em desc', () => {
		expect(sortRecordsByRecency(list, 'desc').map((item) => item.id)).toEqual([3, 2, 1])
	})

	it('ordena do mais antigo para o mais recente pelo id em asc', () => {
		expect(sortRecordsByRecency(list, 'asc').map((item) => item.id)).toEqual([1, 2, 3])
	})

	it('coloca o registro ainda não enviado como o mais recente', () => {
		const pending = { ...record(0, '2025-12-01T10:00:00Z'), sync_state: 'pending' } as unknown as RecordItem

		expect(sortRecordsByRecency([...list, pending], 'desc')[0]).toBe(pending)
		expect(sortRecordsByRecency([...list, pending], 'asc').at(-1)).toBe(pending)
	})

	it('não altera a lista original', () => {
		sortRecordsByRecency(list, 'asc')
		expect(list.map((item) => item.id)).toEqual([1, 3, 2])
	})
})

describe('getLatestRecord', () => {
	it('devolve o registro criado por último, mesmo com data retroativa', () => {
		const list = [record(5, '2026-01-01T10:00:00Z'), record(4, '2026-01-09T10:00:00Z')]

		expect(getLatestRecord(list)?.id).toBe(5)
	})

	it('devolve null sem registros', () => {
		expect(getLatestRecord([])).toBeNull()
	})
})
describe("needsRecordsRefresh", () => {
	const known = [record(1, "2026-01-01T10:00:00Z")] // processing

	it("pede recarregar quando a análise de um registro conhecido termina", () => {
		expect(
			needsRecordsRefresh(known, [{ id: 1, status: "completed", analysis_progress: 100 }]),
		).toBe(true)
		expect(
			needsRecordsRefresh(known, [{ id: 1, status: "failed", analysis_progress: 40 }]),
		).toBe(true)
	})

	it("pede recarregar quando chega um registro que a lista não tem", () => {
		expect(
			needsRecordsRefresh(known, [{ id: 9, status: "processing", analysis_progress: 5 }]),
		).toBe(true)
	})

	it("não recarrega só por avanço de progresso", () => {
		expect(
			needsRecordsRefresh(known, [{ id: 1, status: "processing", analysis_progress: 60 }]),
		).toBe(false)
	})

	it("não recarrega quando o registro já estava concluído", () => {
		const done = [{ ...known[0], status: "completed" }] as unknown as RecordItem[]
		expect(
			needsRecordsRefresh(done, [{ id: 1, status: "completed", analysis_progress: 100 }]),
		).toBe(false)
	})

	it("não recarrega sem atualizações", () => {
		expect(needsRecordsRefresh(known, [])).toBe(false)
	})
})
