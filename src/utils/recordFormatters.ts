import i18n, { currentLanguage } from '../i18n'

function pad(value: number) {
	return String(value).padStart(2, '0')
}

export function formatDate(dateString: string) {
	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) {
		return i18n.t('dates:noDate')
	}

	return i18n.t('dates:numericDate', {
		day: pad(date.getDate()),
		month: pad(date.getMonth() + 1),
		year: date.getFullYear(),
	})
}

// 24 h em português ("19:35") e 12 h com AM/PM em inglês ("7:35 PM").
export function formatTime(dateString: string) {
	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) {
		return i18n.t('dates:noTime')
	}

	const english = currentLanguage() === 'en-US'
	const hours = date.getHours()
	return i18n.t('dates:time', {
		hour: english ? String(hours % 12 || 12) : pad(hours),
		minute: pad(date.getMinutes()),
		// Só o inglês usa AM/PM; no português o período fica vazio.
		period: english ? (hours < 12 ? ' AM' : ' PM') : '',
	})
}

// "04/11/2026 às 19:35" (pt-BR) ou "11/04/2026 at 7:35 PM" (en-US).
export function formatDateAtTime(dateString: string) {
	return i18n.t('dates:dateAtTime', {
		date: formatDate(dateString),
		time: formatTime(dateString),
	})
}

export function formatLocationLabel(latitude: number, longitude: number) {
	return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}

export function formatAnalysisStatus(status?: string): string {
	const known = ['pending', 'processing', 'completed', 'failed']
	const key = status ?? 'pending'

	return known.includes(key) ? i18n.t(`records:status.${key}`) : (status ?? i18n.t('records:status.pending'))
}
