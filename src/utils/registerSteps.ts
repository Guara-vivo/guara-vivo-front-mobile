export type RegisterStep = 1 | 2 | 3

export type RegisterStepState = {
	imageCount: number
	behaviors: string[]
	hasLocation: boolean
	dateTimeValid: boolean
}

// Cada passo do registro só libera o "Continuar" quando os seus requisitos foram cumpridos.
export function canAdvance(step: RegisterStep, state: RegisterStepState): boolean {
	if (step === 1) return state.imageCount >= 1
	if (step === 2) return state.behaviors.length >= 1
	return state.hasLocation && state.dateTimeValid
}
