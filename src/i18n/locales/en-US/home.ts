// Home screen.
export default {
	greeting: 'Hi, {{name}}',
	greetingAnonymous: 'Hi',
	newRecord: 'New record',
	newRecordHint: 'Photo, behavior, location and time',
	stats: {
		weekRecords: 'records this week',
		ibis: 'ibises sighted',
		zonesOne: 'zone mapped',
		zonesMany: 'zones mapped',
		loading: 'Loading {{label}}',
		a11y: '{{value}} {{label}}',
	},
	offlineNote: 'No internet: the numbers only show what is saved on this device.',
	latest: {
		title: 'Latest sighting',
		loading: 'Loading latest sighting',
		view: 'View record {{id}}',
		viewAnalyzing: 'View record {{id}}, being analyzed',
		notSent: 'Not sent',
		refused: 'Rejected',
		waitingToSend: 'Waiting to send',
		empty: 'No records yet. Tap “New record” to get started.',
	},
	sync: {
		updating: 'Updating…',
		waitingOne: '{{count}} record waiting to be sent',
		waitingMany: '{{count}} records waiting to be sent',
		offline: 'No connection · showing saved data',
		ok: 'All synced',
	},
}
