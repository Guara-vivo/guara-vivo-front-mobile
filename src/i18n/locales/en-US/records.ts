// Records: labels used across several screens (history, home, detail, map).
export default {
	status: {
		pending: 'Pending',
		processing: 'Analyzing',
		completed: 'Completed',
		failed: 'Failed',
	},
	// 0 uses the plural ("0 ibises").
	countOne: '{{count}} ibis',
	countMany: '{{count}} ibises',
	// Os valores guardados e enviados à API ficam em português; só o rótulo muda.
	behaviors: {
		Alimentando: 'Feeding',
		Voando: 'Flying',
		Vocalizando: 'Vocalizing',
		Ninhando: 'Nesting',
	},
	analysis: {
		failed: 'Analysis failed',
		queued: 'Queued for analysis',
		queuedA11y: 'Analysis queued',
		running: 'Analyzing · {{percent}}%',
		runningA11y: 'Analysis {{percent}}% complete',
	},
}
