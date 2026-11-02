import React from 'react'
import Svg, { Rect } from 'react-native-svg'
import type { DetectionItem } from '../../types/records'
import {
	BBOX_COLORS,
	getBboxRect,
	getDetectionBbox,
	type Size,
} from '../../utils/detectionFormatters'

type Props = {
	detections: DetectionItem[]
	containerSize: Size
	imageSize: Size
}

// Desenha, por cima da foto, a caixa de cada guará detectado (mesma cor da lista).
export function DetectionOverlay({ detections, containerSize, imageSize }: Props) {
	return (
		<Svg
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: containerSize.width,
				height: containerSize.height,
				pointerEvents: 'none',
			}}
		>
			{detections.map((detection, idx) => {
				const bbox = getDetectionBbox(detection.raw_detection)

				if (!bbox) return null

				const { x, y, width, height } = getBboxRect(bbox, containerSize, imageSize)

				return (
					<Rect
						key={detection.id}
						x={x}
						y={y}
						width={width}
						height={height}
						stroke={BBOX_COLORS[idx % BBOX_COLORS.length]}
						strokeWidth={2}
						fill="none"
					/>
				)
			})}
		</Svg>
	)
}
