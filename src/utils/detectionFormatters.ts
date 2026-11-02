import type { DetectionItem } from '../types/records'

export const BBOX_COLORS = [
	'#E91E63',
	'#2196F3',
	'#4CAF50',
	'#FFC107',
	'#9C27B0',
	'#FF5722',
	'#00BCD4',
	'#8BC34A',
]

export type AccuracySummary = {
	deteccao_yolo: number
	classificacao_guara: number
	classificacao_cor: number
	classificacao_fase_vida: number
	estimativa_distancia: number
}

export type Bbox = [number, number, number, number]
export type Size = { width: number; height: number }

// Media da acuracia dos individuos da imagem; so conta quem trouxe `acuracia`.
export function calculateAccuracySummary(
	detections: DetectionItem[] | undefined,
): AccuracySummary | null {
	if (!detections || detections.length === 0) {
		return null
	}

	let yolo = 0,
		guara = 0,
		cor = 0,
		fase = 0,
		distancia = 0
	let count = 0

	for (const detection of detections) {
		if (detection.raw_detection?.acuracia) {
			const acc = detection.raw_detection.acuracia
			yolo += acc.deteccao_yolo || 0
			guara += acc.classificacao_guara || 0
			cor += acc.classificacao_cor || 0
			fase += acc.classificacao_fase_vida || 0
			distancia += acc.estimativa_distancia || 0
			count++
		}
	}

	if (count === 0) return null

	return {
		deteccao_yolo: yolo / count,
		classificacao_guara: guara / count,
		classificacao_cor: cor / count,
		classificacao_fase_vida: fase / count,
		estimativa_distancia: distancia / count,
	}
}

export function formatPercent(value: number | undefined): string {
	if (typeof value !== 'number') return 'N/A'
	return `${(value * 100).toFixed(1)}%`
}

export function getPlumageLabel(color: string): string {
	const colorMap: Record<string, string> = {
		vermelho: 'Vermelho',
		cinza: 'Cinza',
		red: 'Vermelho',
		gray: 'Cinza',
	}
	return colorMap[color.toLowerCase()] || color
}

export function getLifeStageLabel(stage: string): string {
	const stageMap: Record<string, string> = {
		adulto: 'Adulto',
		filhote: 'Filhote',
		adult: 'Adulto',
		chick: 'Filhote',
	}
	return stageMap[stage.toLowerCase()] || stage
}

// A API pode mandar `raw_detection` como objeto ou como texto JSON; em ambos os casos a
// caixa vem em `bbox_xyxy` ([x1, y1, x2, y2] em pixels da imagem original).
export function getDetectionBbox(rawDetection: unknown): Bbox | null {
	try {
		if (typeof rawDetection === 'string') {
			return (JSON.parse(rawDetection) as { bbox_xyxy?: Bbox }).bbox_xyxy ?? null
		}

		if (rawDetection && typeof rawDetection === 'object') {
			return (rawDetection as { bbox_xyxy?: Bbox }).bbox_xyxy ?? null
		}
	} catch {
		// JSON invalido: sem caixa para desenhar.
	}

	return null
}

// Converte a caixa (pixels da imagem) para a tela, considerando que a imagem aparece
// inteira e centralizada dentro do contêiner (resizeMode="contain").
export function getBboxRect(bbox: Bbox, containerSize: Size, imageSize: Size) {
	const escala = Math.min(
		containerSize.width / imageSize.width,
		containerSize.height / imageSize.height,
	)
	const offsetX = (containerSize.width - imageSize.width * escala) / 2
	const offsetY = (containerSize.height - imageSize.height * escala) / 2

	return {
		x: bbox[0] * escala + offsetX,
		y: bbox[1] * escala + offsetY,
		width: (bbox[2] - bbox[0]) * escala,
		height: (bbox[3] - bbox[1]) * escala,
	}
}
