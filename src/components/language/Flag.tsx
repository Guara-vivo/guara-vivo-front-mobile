import React from 'react'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import type { Language } from '../../i18n'

// Bandeiras desenhadas em SVG para ficarem iguais em qualquer aparelho (emoji de bandeira
// depende da fonte do sistema). A americana usa 7 listras em vez de 13, o que basta neste tamanho.
const STRIPE = 20 / 7

export function Flag({ language, width = 24 }: { language: Language; width?: number }) {
	const height = (width * 20) / 28

	if (language === 'pt-BR') {
		return (
			<Svg viewBox="0 0 28 20" width={width} height={height} accessibilityElementsHidden importantForAccessibility="no">
				<Rect width="28" height="20" fill="#009C3B" />
				<Path d="M14 2.2 25.2 10 14 17.8 2.8 10z" fill="#FFDF00" />
				<Circle cx="14" cy="10" r="4.2" fill="#002776" />
				<Path d="M10 9.2c2.6-.7 5.6-.3 8 1.2" stroke="#fff" strokeWidth=".9" fill="none" />
			</Svg>
		)
	}

	return (
		<Svg viewBox="0 0 28 20" width={width} height={height} accessibilityElementsHidden importantForAccessibility="no">
			<Rect width="28" height="20" fill="#fff" />
			{[0, 2, 4, 6].map((i) => (
				<Rect key={i} y={i * STRIPE} width="28" height={STRIPE} fill="#B22234" />
			))}
			<Rect width="12.5" height={STRIPE * 4} fill="#3C3B6E" />
			{[0, 1, 2].map((row) =>
				[0, 1, 2, 3].map((col) => (
					<Circle
						key={`${row}-${col}`}
						cx={2 + col * 2.8 + (row % 2) * 1.4}
						cy={2 + row * 3.4}
						r=".7"
						fill="#fff"
					/>
				)),
			)}
		</Svg>
	)
}
