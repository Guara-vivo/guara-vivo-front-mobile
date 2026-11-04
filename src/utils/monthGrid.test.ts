import { buildMonthGrid } from './monthGrid'

const today = new Date(2026, 10, 4)

function days(grid: ReturnType<typeof buildMonthGrid>) {
	return grid.filter((cell) => cell !== null)
}

describe('buildMonthGrid', () => {
	it('novembro de 2026 começa no domingo e tem 30 dias', () => {
		const grid = buildMonthGrid(2026, 10, today, null)
		expect(grid.length % 7).toBe(0)
		expect(grid[0]).toMatchObject({ day: 1 })
		expect(days(grid)).toHaveLength(30)
	})

	it('desabilita os dias depois de hoje', () => {
		const cells = days(buildMonthGrid(2026, 10, today, null))
		cells.forEach((cell) => {
			expect(cell!.disabled).toBe(cell!.day > 4)
		})
	})

	it('fevereiro de 2028 tem 29 dias', () => {
		expect(days(buildMonthGrid(2028, 1, new Date(2030, 0, 1), null))).toHaveLength(29)
	})

	it('agosto de 2026 começa no sábado (coluna 6)', () => {
		const grid = buildMonthGrid(2026, 7, today, null)
		expect(grid.slice(0, 6).every((cell) => cell === null)).toBe(true)
		expect(grid[6]).toMatchObject({ day: 1 })
	})

	it('marca só o dia selecionado', () => {
		const cells = days(buildMonthGrid(2026, 10, today, new Date(2026, 10, 3)))
		expect(cells.filter((cell) => cell!.selected).map((cell) => cell!.day)).toEqual([3])
	})

	it('não marca seleção de outro mês', () => {
		const cells = days(buildMonthGrid(2026, 10, today, new Date(2026, 9, 3)))
		expect(cells.some((cell) => cell!.selected)).toBe(false)
	})

	it('nunca passa de 6 linhas', () => {
		expect(buildMonthGrid(2026, 7, today, null).length).toBeLessThanOrEqual(42)
	})
})
