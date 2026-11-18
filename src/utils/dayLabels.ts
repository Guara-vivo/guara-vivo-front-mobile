import i18n from '../i18n'
import { formatDayMonth, formatDayMonthYear } from './timeFormatters'

function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// "Hoje", "Ontem" ou "31 de julho" (com o ano quando não é o atual); em inglês, "Today",
// "Yesterday" ou "July 31".
export function formatRelativeDay(datetime: string, now: Date): string {
	const date = new Date(datetime)
	if (Number.isNaN(date.getTime())) {
		return i18n.t('dates:invalid')
	}

	const diffDays = Math.round(
		(startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000,
	)
	if (diffDays === 0) return i18n.t('dates:today')
	if (diffDays === 1) return i18n.t('dates:yesterday')

	return date.getFullYear() === now.getFullYear() ? formatDayMonth(date) : formatDayMonthYear(date)
}
