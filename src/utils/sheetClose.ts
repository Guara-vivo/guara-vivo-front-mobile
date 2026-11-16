// Fração da altura da folha que o dedo precisa passar da parada baixa, ao soltar, para fechar.
export const CLOSE_DRAG_FRACTION = 0.4

type ReleaseArgs = {
	fromIndex: number
	toIndex: number
	// Posições (px a partir do topo) informadas por `onAnimate` do gorhom: onde a folha foi solta e onde vai parar.
	fromPosition: number
	toPosition: number
	// Altura da folha na parada baixa.
	sheetHeight: number
}

// Folha de detalhes da área: só fecha por arrasto quando o dedo solta bem abaixo da parada baixa.
// A velocidade não decide, para um arrasto rápido de 80% para 35% não fechar sem querer.
export function shouldCloseOnRelease({
	toIndex,
	fromPosition,
	toPosition,
	sheetHeight,
}: ReleaseArgs): boolean {
	if (toIndex !== 0) return false
	return fromPosition - toPosition >= sheetHeight * CLOSE_DRAG_FRACTION
}
