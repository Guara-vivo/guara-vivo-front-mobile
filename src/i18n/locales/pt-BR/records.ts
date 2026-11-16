// Registros: rótulos usados em várias telas (histórico, início, detalhe, mapa).
export default {
	status: {
		pending: 'Pendente',
		processing: 'Em análise',
		completed: 'Concluída',
		failed: 'Falhou',
	},
	// 0 vira "guarás" (plural), como sempre foi.
	countOne: '{{count}} guará',
	countMany: '{{count}} guarás',
	// Os valores guardados e enviados à API ficam em português; só o rótulo muda.
	behaviors: {
		Alimentando: 'Alimentando',
		Voando: 'Voando',
		Vocalizando: 'Vocalizando',
		Ninhando: 'Ninhando',
	},
	analysis: {
		failed: 'Análise falhou',
		queued: 'Na fila para análise',
		queuedA11y: 'Análise na fila',
		running: 'Analisando · {{percent}}%',
		runningA11y: 'Análise {{percent}}% concluída',
	},
}
