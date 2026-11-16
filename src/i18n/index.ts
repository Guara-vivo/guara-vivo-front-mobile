import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './locales/pt-BR'
import enUS from './locales/en-US'

export const LANGUAGES = ['pt-BR', 'en-US'] as const
export type Language = (typeof LANGUAGES)[number]

// Primeira abertura: português. A escolha salva no aparelho entra depois (ver `storage.ts`).
export const DEFAULT_LANGUAGE: Language = 'pt-BR'

export function isLanguage(value: unknown): value is Language {
	return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

// `initAsync: false` faz o `i18n.t` funcionar logo após o import, inclusive em funções
// comuns (fora do React) e nos testes. Os textos vêm embutidos, então não há o que esperar.
void i18n.use(initReactI18next).init({
	resources: {
		'pt-BR': ptBR,
		'en-US': enUS,
	},
	lng: DEFAULT_LANGUAGE,
	fallbackLng: DEFAULT_LANGUAGE,
	supportedLngs: [...LANGUAGES],
	defaultNS: 'common',
	ns: Object.keys(ptBR),
	initAsync: false,
	interpolation: { escapeValue: false },
	react: { useSuspense: false },
})

// Idioma ativo, sempre um dos suportados.
export function currentLanguage(): Language {
	return isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE
}

// Idioma para o qual o toque na bandeirinha troca.
export function otherLanguage(language: Language): Language {
	return language === 'pt-BR' ? 'en-US' : 'pt-BR'
}

export default i18n
