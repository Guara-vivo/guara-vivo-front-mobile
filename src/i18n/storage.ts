import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n, { isLanguage, type Language } from './index'

// Só o aparelho guarda a escolha (não vai para a conta nem para a API).
const STORAGE_KEY = 'guaravivo.language'

// Aplica o idioma salvo, se houver. Falha de leitura deixa o padrão (português).
export async function loadStoredLanguage(): Promise<void> {
	try {
		const stored = await AsyncStorage.getItem(STORAGE_KEY)
		if (isLanguage(stored) && stored !== i18n.language) {
			await i18n.changeLanguage(stored)
		}
	} catch {
		// Sem leitura do armazenamento, o app abre no idioma padrão.
	}
}

// Troca o idioma na hora e guarda a escolha.
export async function setLanguage(language: Language): Promise<void> {
	await i18n.changeLanguage(language)
	try {
		await AsyncStorage.setItem(STORAGE_KEY, language)
	} catch {
		// Sem gravação, o idioma vale só até fechar o app.
	}
}
