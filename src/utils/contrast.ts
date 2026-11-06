// Razão de contraste WCAG entre duas cores `#RRGGBB` (1 a 21).
function channel(value: number): number {
	const s = value / 255
	return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(hex: string): number {
	const clean = hex.replace('#', '')
	const r = parseInt(clean.slice(0, 2), 16)
	const g = parseInt(clean.slice(2, 4), 16)
	const b = parseInt(clean.slice(4, 6), 16)
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(foreground: string, background: string): number {
	const a = luminance(foreground)
	const b = luminance(background)
	const lighter = Math.max(a, b)
	const darker = Math.min(a, b)
	return (lighter + 0.05) / (darker + 0.05)
}
