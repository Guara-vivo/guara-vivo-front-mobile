import { colors } from './theme'
import { contrastRatio } from '../utils/contrast'

describe('contrastRatio', () => {
	it('retorna 21 para preto sobre branco', () => {
		expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
	})

	it('retorna 1 para cores iguais', () => {
		expect(contrastRatio('#1B1B1F', '#1B1B1F')).toBeCloseTo(1, 5)
	})
})

describe('contraste dos tokens (WCAG AA)', () => {
	it('texto branco sobre o vermelho primário passa 4,5:1', () => {
		expect(contrastRatio(colors.onColor, colors.primary)).toBeGreaterThanOrEqual(4.5)
	})

	it('texto branco sobre o azul secundário passa 4,5:1', () => {
		expect(contrastRatio(colors.onColor, colors.secondary)).toBeGreaterThanOrEqual(4.5)
	})

	it('texto principal sobre o fundo passa 7:1', () => {
		expect(contrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(7)
	})

	it('texto apagado sobre o fundo passa 4,5:1', () => {
		expect(contrastRatio(colors.muted, colors.background)).toBeGreaterThanOrEqual(4.5)
	})

	it('verde de sucesso sobre o fundo suave passa 4,5:1', () => {
		expect(contrastRatio(colors.success, colors.successSoft)).toBeGreaterThanOrEqual(4.5)
	})

	it('âmbar de aviso sobre o fundo suave passa 4,5:1', () => {
		expect(contrastRatio(colors.warning, colors.warningSoft)).toBeGreaterThanOrEqual(4.5)
	})

	it('azul sobre o azul suave passa 4,5:1', () => {
		expect(contrastRatio(colors.secondary, colors.blueSoft)).toBeGreaterThanOrEqual(4.5)
	})

	it('texto de perigo sobre o vermelho suave passa 4,5:1', () => {
		expect(contrastRatio(colors.dangerText, colors.redSoft)).toBeGreaterThanOrEqual(4.5)
	})
})
