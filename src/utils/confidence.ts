export type ConfidenceLevel = 'alta' | 'media' | 'baixa'

// Valor decimal de 0 a 1; fora disso (ou NaN) a nota não é confiável e vira "baixa".
export function getConfidenceLevel(value: number): ConfidenceLevel {
	if (!Number.isFinite(value) || value < 0 || value > 1) return 'baixa'
	if (value >= 0.85) return 'alta'
	if (value >= 0.7) return 'media'
	return 'baixa'
}

export function isLowScore(value: number): boolean {
	return value < 0.7
}

export function formatPercent(value: number | undefined | null): string {
	if (value === undefined || value === null || !Number.isFinite(value)) return '–'
	return `${Math.round(value * 100)}%`
}

// Média das notas que são números válidos; null quando não sobra nenhuma.
export function averageScore(values: (number | undefined | null)[]): number | null {
	const valid = values.filter(
		(value): value is number => typeof value === 'number' && Number.isFinite(value),
	)
	if (valid.length === 0) return null
	return valid.reduce((sum, value) => sum + value, 0) / valid.length
}
