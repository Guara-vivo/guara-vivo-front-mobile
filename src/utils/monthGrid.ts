export type DayCell = { day: number; disabled: boolean; selected: boolean } | null

// Grade de um mês (começa no domingo): células vazias são null; dias depois de hoje ficam desabilitados.
export function buildMonthGrid(
	year: number,
	month: number,
	today: Date,
	selected: Date | null,
): DayCell[] {
	const firstWeekday = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
	const cells: DayCell[] = Array.from({ length: firstWeekday }, () => null)

	for (let day = 1; day <= daysInMonth; day += 1) {
		cells.push({
			day,
			disabled: new Date(year, month, day).getTime() > todayStart,
			selected:
				selected !== null &&
				selected.getFullYear() === year &&
				selected.getMonth() === month &&
				selected.getDate() === day,
		})
	}

	while (cells.length % 7 !== 0) {
		cells.push(null)
	}

	return cells
}
