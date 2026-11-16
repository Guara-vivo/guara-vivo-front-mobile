// Fração da altura da folha (na parada baixa) que o dedo precisa passar da parada baixa, ao soltar, para fechar.
export const CLOSE_DRAG_FRACTION = 0.4

// Altura da parada baixa como fração do contêiner (a mesma de `snapPoints` em MapZoneDetailSheet).
export const LOW_SNAP_FRACTION = 0.35

type ReleaseArgs = {
	fromIndex: number
	toIndex: number
	// Posições (px a partir do topo) informadas por `onAnimate` do gorhom: onde a folha estava quando a
	// animação começou e onde vai parar. Para a parada "fechada" (`toIndex -1`), `toPosition` é a altura do contêiner.
	fromPosition: number
	toPosition: number
}

// A biblioteca decide fechar pela velocidade do arrasto, e um arrasto rápido de 80% para 35% fechava a folha.
// Com `enablePanDownToClose` ligado ela avisa por `onAnimate` quando vai fechar; aqui se decide se deixa fechar:
// só quando o dedo soltou bem abaixo da parada baixa. Caso contrário o chamador cancela voltando à parada baixa.
export function shouldCloseOnRelease({ toIndex, fromPosition, toPosition }: ReleaseArgs): boolean {
	if (toIndex !== -1) return false

	const lowSnapPosition = toPosition * (1 - LOW_SNAP_FRACTION)
	const sheetHeight = toPosition * LOW_SNAP_FRACTION
	return fromPosition - lowSnapPosition >= sheetHeight * CLOSE_DRAG_FRACTION
}
