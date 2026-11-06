import {
	calculateAccuracySummary,
	getBboxRect,
	getDetectionBbox,
	getLifeStageLabel,
	getPlumageLabel,
} from './detectionFormatters'
import type { DetectionItem } from '../types/records'

function detection(acuracia?: Partial<NonNullable<DetectionItem['raw_detection']>['acuracia']>) {
	return {
		id: 1,
		color: 'red',
		age_group: 'adult',
		raw_detection: acuracia
			? {
					cor: 'red',
					fase_vida: 'adult',
					acuracia: {
						deteccao_yolo: 0,
						classificacao_guara: 0,
						classificacao_cor: 0,
						classificacao_fase_vida: 0,
						estimativa_distancia: 0,
						...acuracia,
					},
				}
			: null,
	} as DetectionItem
}

describe('calculateAccuracySummary', () => {
	it('devolve null sem deteccoes ou sem acuracia', () => {
		expect(calculateAccuracySummary(undefined)).toBeNull()
		expect(calculateAccuracySummary([])).toBeNull()
		expect(calculateAccuracySummary([detection()])).toBeNull()
	})

	it('faz a media apenas de quem tem acuracia', () => {
		const summary = calculateAccuracySummary([
			detection({ deteccao_yolo: 0.8, classificacao_cor: 1 }),
			detection({ deteccao_yolo: 0.6, classificacao_cor: 0.5 }),
			detection(),
		])

		expect(summary?.deteccao_yolo).toBeCloseTo(0.7)
		expect(summary?.classificacao_cor).toBeCloseTo(0.75)
	})
})

describe('rotulos', () => {
	it('traduz plumagem e fase da vida, mantendo valores desconhecidos', () => {
		expect(getPlumageLabel('RED')).toBe('Vermelho')
		expect(getPlumageLabel('gray')).toBe('Cinza')
		expect(getPlumageLabel('azul')).toBe('azul')
		expect(getLifeStageLabel('chick')).toBe('Filhote')
		expect(getLifeStageLabel('Adulto')).toBe('Adulto')
		expect(getLifeStageLabel('jovem')).toBe('jovem')
		expect(getPlumageLabel('indefinido')).toBe('Indefinida')
		expect(getLifeStageLabel('indefinido')).toBe('Indefinida')
	})
})

describe('getDetectionBbox', () => {
	it('le a caixa de objeto ou de texto JSON', () => {
		expect(getDetectionBbox({ bbox_xyxy: [1, 2, 3, 4] })).toEqual([1, 2, 3, 4])
		expect(getDetectionBbox(JSON.stringify({ bbox_xyxy: [1, 2, 3, 4] }))).toEqual([1, 2, 3, 4])
	})

	it('devolve null quando nao ha caixa ou o JSON e invalido', () => {
		expect(getDetectionBbox(null)).toBeNull()
		expect(getDetectionBbox({})).toBeNull()
		expect(getDetectionBbox('nao e json')).toBeNull()
		expect(getDetectionBbox('null')).toBeNull()
	})
})

describe('getBboxRect', () => {
	it('escala a caixa e centraliza a imagem no conteiner', () => {
		// Imagem 200x100 num conteiner 400x400: escala 2, sobra 100 em cima e embaixo.
		const rect = getBboxRect([10, 20, 60, 70], { width: 400, height: 400 }, { width: 200, height: 100 })

		expect(rect).toEqual({ x: 20, y: 140, width: 100, height: 100 })
	})
})
