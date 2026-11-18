import i18n from '../i18n'

function list(key: string): string[] {
	return i18n.t(key, { returnObjects: true }) as string[]
}

export function getMonthName(monthIndex: number): string {
	return list('dates:months')[monthIndex] ?? ''
}

export function getWeekdayName(weekdayIndex: number): string {
	return list('dates:weekdays')[weekdayIndex] ?? ''
}

// "31 de julho" (pt-BR) ou "July 31" (en-US).
export function formatDayMonth(date: Date): string {
	return i18n.t('dates:dayMonth', { day: date.getDate(), month: getMonthName(date.getMonth()) })
}

// "31 de julho de 2025" (pt-BR) ou "July 31, 2025" (en-US).
export function formatDayMonthYear(date: Date): string {
	return i18n.t('dates:dayMonthYear', {
		day: date.getDate(),
		month: getMonthName(date.getMonth()),
		year: date.getFullYear(),
	})
}

export function formatLongDate(now: Date) {
	return i18n.t('dates:longDate', {
		weekday: getWeekdayName(now.getDay()),
		day: now.getDate(),
		month: getMonthName(now.getMonth()),
	})
}

export function formatLastUpdatedAt(
	lastUpdatedAt: Date | null,
	now = new Date(),
) {
	if (!lastUpdatedAt) {
		return i18n.t('dates:neverUpdated')
	}

	const diffMs = Math.max(0, now.getTime() - lastUpdatedAt.getTime())
	const diffMinutes = Math.floor(diffMs / 60000)

	if (diffMinutes < 1) {
		return i18n.t('dates:updatedNow')
	}

	if (diffMinutes < 60) {
		return i18n.t('dates:updatedMinutes', { count: diffMinutes })
	}

	const diffHours = Math.floor(diffMinutes / 60)
	return i18n.t('dates:updatedHours', { count: diffHours })
}
