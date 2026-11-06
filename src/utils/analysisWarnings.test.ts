import {
	getWarningMessage,
	getWarningMessages,
	needsAttention,
	normalizeAnalysisStatus,
	normalizeWarnings,
	parseImageResult,
} from './analysisWarnings'

describe('analysisWarnings', () => {
	it('traduz códigos conhecidos e usa texto genérico nos desconhecidos', () => {
		expect(getWarningMessage('fase_vida_incerta')).toContain('fase da vida')
		expect(getWarningMessage('codigo_novo')).toContain('melhores condições')
	})

	it('ignora avisos ausentes ou inválidos', () => {
		expect(normalizeWarnings(undefined)).toEqual([])
		expect(normalizeWarnings(null)).toEqual([])
		expect(normalizeWarnings('x')).toEqual([])
		expect(normalizeWarnings(['a', 1, '', null, 'b'])).toEqual(['a', 'b'])
	})

	it('não repete mensagens iguais', () => {
		expect(getWarningMessages(['x', 'y'])).toHaveLength(1)
		expect(getWarningMessages(['ave_muito_pequena', 'fase_vida_incerta'])).toHaveLength(2)
	})

	it('valida o status', () => {
		expect(normalizeAnalysisStatus('sem_ave')).toBe('sem_ave')
		expect(normalizeAnalysisStatus('outro')).toBeNull()
		expect(normalizeAnalysisStatus(undefined)).toBeNull()
	})

	it('lê status e avisos de dentro do raw_result', () => {
		const raw = JSON.stringify({
			image_index: 0,
			result: { status_analise: 'sem_ave', avisos: ['nenhuma_ave_detectada'] },
		})
		expect(parseImageResult(raw)).toEqual({
			status: 'sem_ave',
			avisos: ['nenhuma_ave_detectada'],
		})
		expect(parseImageResult(null)).toEqual({ status: null, avisos: [] })
		expect(parseImageResult('nao e json')).toEqual({ status: null, avisos: [] })
		expect(parseImageResult('{"result":null}')).toEqual({ status: null, avisos: [] })
		expect(parseImageResult('{"image_index":0}')).toEqual({ status: null, avisos: [] })
	})

	it('decide quando pedir atenção', () => {
		expect(needsAttention('ok', [])).toBe(false)
		expect(needsAttention('ok', ['fase_vida_incerta'])).toBe(false)
		expect(needsAttention('atencao', [])).toBe(true)
		expect(needsAttention('sem_guara', undefined)).toBe(true)
		expect(needsAttention(undefined, undefined)).toBe(false)
		expect(needsAttention(undefined, ['fase_vida_incerta'])).toBe(true)
	})
})
