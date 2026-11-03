export const colors = {
	primary: '#F2201F',
	primaryDark: '#D11D1C',
	secondary: '#125ED0',
	secondaryLight: '#79A7EB',
	background: '#F1F1F1',
	surface: '#FFFFFF',
	text: '#1A1A1A',
	muted: '#717182',
	border: 'rgba(26, 26, 26, 0.12)',
	splash: '#c5dfff',
}

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
}

export const radius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	pill: 999,
}

export const typography = {
	caption: { fontSize: 12, lineHeight: 16 },
	body: { fontSize: 14, lineHeight: 20 },
	bodyLarge: { fontSize: 16, lineHeight: 22 },
	title: { fontSize: 18, lineHeight: 24 },
	headline: { fontSize: 22, lineHeight: 28 },
	display: { fontSize: 26, lineHeight: 32 },
}

// Elevação em dois níveis: `card` (superfícies na página) e `overlay` (flutuantes sobre
// o conteúdo: FAB do mapa, banners, modais, cabeçalho). Controles comuns ficam planos.
export const elevation = {
	card: {
		shadowColor: colors.text,
		shadowOpacity: 0.08,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 2,
	},
	overlay: {
		shadowColor: colors.text,
		shadowOpacity: 0.16,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 12,
		elevation: 6,
	},
}
