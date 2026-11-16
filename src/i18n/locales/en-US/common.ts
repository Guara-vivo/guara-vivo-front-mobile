// Texts used across several screens, loading-failure messages and the language switcher.
export default {
	back: 'Back',
	unexpectedError: 'Unexpected error',
	ok: 'OK',
	cancel: 'Cancel',
	retry: 'Try again',
	comingSoon: 'Coming soon',
	version: 'Version {{version}}',
	language: {
		title: 'Language',
		switchTo: 'Switch to {{language}}',
		names: {
			'pt-BR': 'Portuguese',
			'en-US': 'English',
		},
		native: {
			'pt-BR': 'Português',
			'en-US': 'English',
		},
	},
	// Loading failures (see utils/loadErrorMessage.ts)
	loadError: {
		timeout: 'The connection took too long. Check your internet and try refreshing.',
		session: 'Your session cannot load this data. Sign in again.',
		server: 'The server is unavailable right now. Try refreshing in a moment.',
		offline: 'No internet connection. Check your network and try refreshing.',
	},
}
