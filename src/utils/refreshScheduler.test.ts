import { createRefreshScheduler } from './refreshScheduler'

describe('createRefreshScheduler', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		jest.setSystemTime(new Date('2026-01-01T10:00:00Z'))
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('executa na hora quando passou o intervalo mínimo', () => {
		const run = jest.fn()
		const scheduler = createRefreshScheduler(run, 5000)

		scheduler.trigger()

		expect(run).toHaveBeenCalledTimes(1)
	})

	it('adia (não descarta) um pedido que chega dentro do intervalo', () => {
		const run = jest.fn()
		const scheduler = createRefreshScheduler(run, 5000)

		scheduler.trigger()
		jest.advanceTimersByTime(2000)
		scheduler.trigger()
		expect(run).toHaveBeenCalledTimes(1)

		jest.advanceTimersByTime(3000)
		expect(run).toHaveBeenCalledTimes(2)
	})

	it('junta vários pedidos do intervalo em uma só execução', () => {
		const run = jest.fn()
		const scheduler = createRefreshScheduler(run, 5000)

		scheduler.trigger()
		scheduler.trigger()
		scheduler.trigger()
		jest.advanceTimersByTime(10000)

		expect(run).toHaveBeenCalledTimes(2)
	})

	it('cancel impede a execução adiada', () => {
		const run = jest.fn()
		const scheduler = createRefreshScheduler(run, 5000)

		scheduler.trigger()
		scheduler.trigger()
		scheduler.cancel()
		jest.advanceTimersByTime(10000)

		expect(run).toHaveBeenCalledTimes(1)
	})

	it('triggerIn agenda uma execução depois do atraso', () => {
		const run = jest.fn()
		const scheduler = createRefreshScheduler(run, 1000)

		scheduler.triggerIn(4000)
		expect(run).not.toHaveBeenCalled()

		jest.advanceTimersByTime(4000)
		expect(run).toHaveBeenCalledTimes(1)
	})
})
