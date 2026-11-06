import { MONTHS } from './timeFormatters'

function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// "Hoje", "Ontem" ou "31 de julho" (com o ano quando não é o atual).
export function formatRelativeDay(datetime: string, now: Date): string {
	const date = new Date(datetime)
	if (Number.isNaN(date.getTime())) {
		return 'Data inválida'
	}

	const diffDays = Math.round(
		(startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000,
	)
	if (diffDays === 0) return 'Hoje'
	if (diffDays === 1) return 'Ontem'

	const label = `${date.getDate()} de ${MONTHS[date.getMonth()]}`
	return date.getFullYear() === now.getFullYear() ? label : `${label} de ${date.getFullYear()}`
}
