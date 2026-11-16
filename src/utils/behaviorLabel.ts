import i18n from '../i18n'

// Rótulo de um comportamento no idioma ativo. O valor guardado/enviado segue em português
// ("Alimentando"); valores desconhecidos aparecem como vieram.
export function behaviorLabel(value: string): string {
	return i18n.t(`records:behaviors.${value}`, { defaultValue: value })
}
