export const colors = {
	primary: '#E5202A',
	primaryDark: '#C41A23',
	redSoft: '#FDECEC',
	secondary: '#1560D0',
	secondaryLight: '#79A7EB',
	blueSoft: '#E8F0FC',
	background: '#FAF9F7',
	surface: '#FFFFFF',
	field: '#EFECE6',
	text: '#1B1B1F',
	muted: '#6C6C75',
	border: '#ECE9E4',
	borderStrong: '#D9D5CE',
	splash: '#c5dfff',
	onColor: '#FFFFFF',
	accent: '#5C8BD6',
	accentSoft: '#8FB0F4',
	danger: '#E53935',
	success: '#18794E',
	successSoft: '#E4F4EC',
	warning: '#9A5B00',
	warningSoft: '#FFF1D6',
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

// Elevação em dois níveis: `card` (superfícies na página, hoje planas: separadas por borda
// de 1 px) e `overlay` (flutuantes sobre o conteúdo: botões do mapa, banners, modais).
export const elevation = {
	card: {
		shadowColor: colors.text,
		shadowOpacity: 0,
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 0,
		elevation: 0,
	},
	overlay: {
		shadowColor: colors.text,
		shadowOpacity: 0.16,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 12,
		elevation: 6,
	},
}

// Fonte dos títulos grandes e dos números de destaque (carregada em GuaraVivoApp). O texto corrido
// segue na fonte do sistema; se a fonte falhar em carregar, o Android cai para a fonte padrão.
export const fontFamily = {
	display: 'BarlowCondensed_700Bold',
	displaySemi: 'BarlowCondensed_600SemiBold',
}
