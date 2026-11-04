const WEEKDAYS = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sábado',
]

export const MONTHS = [
	'janeiro',
	'fevereiro',
	'março',
	'abril',
	'maio',
	'junho',
	'julho',
	'agosto',
	'setembro',
	'outubro',
	'novembro',
	'dezembro',
]

export function formatLongDate(now: Date) {
	return `${WEEKDAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`
}

export function formatLastUpdatedAt(
	lastUpdatedAt: Date | null,
	now = new Date(),
) {
	if (!lastUpdatedAt) {
		return 'Nunca atualizado'
	}

	const diffMs = Math.max(0, now.getTime() - lastUpdatedAt.getTime())
	const diffMinutes = Math.floor(diffMs / 60000)

	if (diffMinutes < 1) {
		return 'Atualizado agora'
	}

	if (diffMinutes < 60) {
		return `Atualizado há ${diffMinutes} min`
	}

	const diffHours = Math.floor(diffMinutes / 60)
	return `Atualizado há ${diffHours} h`
}
