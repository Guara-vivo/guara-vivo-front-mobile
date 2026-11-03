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
	onColor: '#FFFFFF',
	accent: '#5C8BD6',
	accentSoft: '#8FB0F4',
	danger: '#E53935',
	success: '#2E9D57',
	placeholder: '#6B6B74',
	selectedBg: '#F3F7FF',
	selectedBgActive: '#EAF2FF',
	switchTrackOff: '#C9CED8',
	switchThumb: '#F2F2F2',
	overlaySurface: 'rgba(255, 255, 255, 0.94)',
	scrim: 'rgba(0, 0, 0, 0.5)',
	scrimSoft: 'rgba(0, 0, 0, 0.28)',
	mediaBadge: 'rgba(117, 117, 117, 0.47)',
	dangerBg: '#FFEBEE',
	dangerText: '#C62828',
}

export const spacing = {
	xs: 4,
	sm: 8,
	sm2: 12,
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
	micro: { fontSize: 11, lineHeight: 14 },
	caption: { fontSize: 12, lineHeight: 16 },
	body: { fontSize: 14, lineHeight: 20 },
	bodyLarge: { fontSize: 16, lineHeight: 22 },
	title: { fontSize: 20, lineHeight: 26 },
	headline: { fontSize: 22, lineHeight: 28 },
	display: { fontSize: 26, lineHeight: 32 },
}

// Atalho para quem só precisa do tamanho (mantém lineHeight/peso definidos no estilo).
export const fontSize = {
	micro: typography.micro.fontSize,
	caption: typography.caption.fontSize,
	body: typography.body.fontSize,
	bodyLarge: typography.bodyLarge.fontSize,
	title: typography.title.fontSize,
	headline: typography.headline.fontSize,
	display: typography.display.fontSize,
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
