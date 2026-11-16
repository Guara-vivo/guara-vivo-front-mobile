import { StyleSheet } from 'react-native'
import { colors, fontSize, radius, spacing } from '../constants/theme'

export const languageStyles = StyleSheet.create<Record<string, any>>({
	// Bandeirinha das telas de entrada
	languageToggle: {
		minHeight: 44,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		paddingHorizontal: spacing.sm2,
		borderRadius: radius.pill,
		backgroundColor: colors.field,
	},
	languageToggleText: {
		color: colors.text,
		fontSize: fontSize.body,
		fontWeight: '700',
	},
	// Barra no alto da boas-vindas, com a bandeirinha à direita
	welcomeTopBar: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: spacing.md,
	},
	// Lado direito do cabeçalho do login/cadastro (passo + bandeirinha)
	authHeaderRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm2,
	},
	// Idioma no Perfil: bandeira e nome do idioma atual no lugar da seta
	profileLanguageValue: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	profileLanguageName: {
		color: colors.muted,
		fontSize: fontSize.body,
	},
})
