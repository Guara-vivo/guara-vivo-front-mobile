const pad = (value: number) => String(value).padStart(2, '0')

// Texto "dd/mm/aaaa" (como guardado nos filtros) -> Date à meia-noite; null se vazio ou inválido.
export function parseInputDate(value: string) {
	const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

	if (!match) {
		return null
	}

	const day = Number(match[1])
	const month = Number(match[2])
	const year = Number(match[3])
	const parsed = new Date(year, month - 1, day, 0, 0, 0, 0)

	// Rejeita estouro de dia/mês (ex.: 32/01 viraria fevereiro).
	if (
		Number.isNaN(parsed.getTime()) ||
		parsed.getDate() !== day ||
		parsed.getMonth() !== month - 1 ||
		parsed.getFullYear() !== year
	) {
		return null
	}

	return parsed
}

export function formatInputDate(date: Date) {
	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}
