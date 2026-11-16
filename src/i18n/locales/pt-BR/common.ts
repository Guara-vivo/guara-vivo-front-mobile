// Textos usados em várias telas, mensagens de falha de carregamento e o seletor de idioma.
export default {
	back: 'Voltar',
	unexpectedError: 'Erro inesperado',
	ok: 'OK',
	cancel: 'Cancelar',
	retry: 'Tentar de novo',
	comingSoon: 'Em breve',
	version: 'Versão {{version}}',
	language: {
		title: 'Idioma',
		switchTo: 'Mudar para {{language}}',
		names: {
			'pt-BR': 'Português',
			'en-US': 'Inglês',
		},
		native: {
			'pt-BR': 'Português',
			'en-US': 'English',
		},
	},
	// Falhas de carregamento (ver utils/loadErrorMessage.ts)
	loadError: {
		timeout: 'A conexão demorou demais. Verifique sua internet e tente atualizar.',
		session: 'Sua sessão não permite carregar estes dados. Entre novamente.',
		server: 'O servidor está indisponível no momento. Tente atualizar em instantes.',
		offline: 'Sem conexão com a internet. Verifique sua rede e tente atualizar.',
	},
}
