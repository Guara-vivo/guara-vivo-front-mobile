export type DateRange = { start: Date | null; end: Date | null }
export type RangeShortcut = 'last7' | 'last30' | 'thisMonth'
export type RangeCellKind = 'start' | 'end' | 'single' | 'middle'

const dayKey = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

// Toque num dia do calendário de faixa. Nunca produz início maior que o fim.
export function pickRangeDay(range: DateRange, day: Date): DateRange {
	const picked = startOfDay(day)
	const { start, end } = range

	if (start === null || end !== null || dayKey(picked) < dayKey(start)) {
		return { start: picked, end: null }
	}

	return { start, end: picked }
}

// Como o dia aparece dentro da faixa (null = fora dela). Só com o início, o início é 'single'.
export function rangeCellKind(range: DateRange, day: Date): RangeCellKind | null {
	if (range.start === null) return null

	const key = dayKey(day)
	const startKey = dayKey(range.start)
	const endKey = range.end === null ? startKey : dayKey(range.end)

	if (key < startKey || key > endKey) return null
	if (startKey === endKey) return 'single'
	if (key === startKey) return 'start'
	if (key === endKey) return 'end'
	return 'middle'
}

// Atalhos terminam hoje: "7 dias" e "30 dias" contam com hoje (hoje menos 6 e menos 29 dias).
export function shortcutRange(shortcut: RangeShortcut, today: Date): { start: Date; end: Date } {
	const end = startOfDay(today)
	const daysBack = { last7: 6, last30: 29, thisMonth: end.getDate() - 1 }[shortcut]

	return { start: new Date(end.getFullYear(), end.getMonth(), end.getDate() - daysBack), end }
}

export function matchesShortcut(range: DateRange, shortcut: RangeShortcut, today: Date): boolean {
	if (range.start === null || range.end === null) return false

	const expected = shortcutRange(shortcut, today)
	return dayKey(range.start) === dayKey(expected.start) && dayKey(range.end) === dayKey(expected.end)
}
