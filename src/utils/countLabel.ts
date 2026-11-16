import i18n from '../i18n'

// "1 guará" / "3 guarás" (pt-BR) e "1 ibis" / "3 ibises" (en-US). Zero usa o plural.
export function countLabel(count: number): string {
	return i18n.t(count === 1 ? 'records:countOne' : 'records:countMany', { count })
}
