// Tela inicial.
export default {
	greeting: 'Olá, {{name}}',
	greetingAnonymous: 'Olá',
	newRecord: 'Novo registro',
	newRecordHint: 'Foto, comportamento, local e hora',
	stats: {
		weekRecords: 'registros nesta semana',
		ibis: 'guarás avistados',
		zonesOne: 'área mapeada',
		zonesMany: 'áreas mapeadas',
		loading: 'Carregando {{label}}',
		a11y: '{{value}} {{label}}',
	},
	offlineNote: 'Sem internet: os números mostram só o que está guardado neste aparelho.',
	latest: {
		title: 'Último avistamento',
		loading: 'Carregando último avistamento',
		view: 'Ver registro {{id}}',
		viewAnalyzing: 'Ver registro {{id}}, em análise',
		notSent: 'Não enviado',
		refused: 'Recusado',
		waitingToSend: 'Aguardando envio',
		empty: 'Nenhum registro ainda. Toque em “Novo registro” para começar.',
	},
	sync: {
		updating: 'Atualizando…',
		waitingOne: '{{count}} registro aguardando envio',
		waitingMany: '{{count}} registros aguardando envio',
		offline: 'Sem conexão · mostrando os dados guardados',
		ok: 'Tudo sincronizado',
	},
}
