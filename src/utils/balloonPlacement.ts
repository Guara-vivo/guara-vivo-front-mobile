export const BALLOON_MARGIN_DP = 16
// Chips de camada (até 52 dp do topo) e o selo "N áreas" (até ~96 dp), mais um respiro.
export const BALLOON_TOP_INSET_DP = 104
export const BALLOON_POINTER_DP = 8
// Metade do marcador (46 dp). Quem sabe o tamanho real (o marcador em foco é maior) passa `markerRadius`.
export const BALLOON_MARKER_RADIUS_DP = 23
// A pontinha não passa dos cantos arredondados do balão.
const POINTER_EDGE_DP = 16

export type BalloonPlacement = {
	left: number
	top: number
	pointerLeft: number
	side: 'above' | 'below'
}

type Size = { width: number; height: number }

// Onde desenhar o balão de um registro, no mesmo sistema de coordenadas do container (dp). Fica
// centralizado no marcador, dentro das margens laterais, acima dele; vai para baixo quando não
// sobra espaço em cima (perto do topo ou dos chips). Se nenhum lado cabe, usa o que tem mais espaço.
// Sem balão (null) quando o marcador saiu da área visível do mapa: ele não ficaria ancorado em nada
// e apareceria cortado ou sob os chips.
export function placeBalloon(input: {
	anchor: { x: number; y: number }
	balloon: Size
	container: Size
	markerRadius?: number
}): BalloonPlacement | null {
	const { anchor, balloon, container } = input
	const r = input.markerRadius ?? BALLOON_MARKER_RADIUS_DP

	if (anchor.x < -r || anchor.x > container.width + r || anchor.y < -r || anchor.y > container.height + r) {
		return null
	}

	const gap = r + BALLOON_POINTER_DP
	const maxLeft = container.width - BALLOON_MARGIN_DP - balloon.width
	const left = Math.max(BALLOON_MARGIN_DP, Math.min(anchor.x - balloon.width / 2, maxLeft))
	const pointerLeft = Math.max(POINTER_EDGE_DP, Math.min(anchor.x - left, balloon.width - POINTER_EDGE_DP))

	const topAbove = anchor.y - gap - balloon.height
	const topBelow = anchor.y + gap
	const fitsAbove = topAbove >= BALLOON_TOP_INSET_DP
	const fitsBelow = topBelow + balloon.height <= container.height

	let side: BalloonPlacement['side'] = 'above'

	if (!fitsAbove) {
		const roomAbove = anchor.y - r
		const roomBelow = container.height - (anchor.y + r)

		side = fitsBelow || roomBelow > roomAbove ? 'below' : 'above'
	}

	return { left, top: side === 'above' ? topAbove : topBelow, pointerLeft, side }
}
