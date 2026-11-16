// Welcome, sign in, sign up and password rules.
export default {
	welcome: {
		tagline: 'Monitoring and protecting the scarlet ibis in the ARIE',
		login: 'Sign in to my account',
		register: 'Create account',
	},
	login: {
		title: 'Sign in',
		subtitle: 'Use the email and password of your account.',
		email: 'Email',
		password: 'Password',
		submit: 'Sign in',
		submitting: 'Signing in...',
		noAccount: "Don't have an account yet?",
		createAccount: 'Create account',
		forgot: 'I forgot my password',
		forgotA11y: 'Recover password',
		forgotUnavailable: 'Password recovery is not available in the app yet.',
		requiredTitle: 'Required fields',
		requiredMessage: 'Fill in your email and password to continue.',
	},
	loginError: {
		server: {
			title: 'Server unavailable',
			message: 'The server is unavailable right now. Try again in a moment.',
		},
		credentials: {
			title: 'Sign-in failed',
			message: 'Check your email and password and try again.',
		},
		slow: {
			title: 'Slow connection',
			message: 'The connection took too long. Check your internet and try again.',
		},
		offline: {
			title: 'No connection',
			message: 'Could not reach the server. Check your Wi-Fi or mobile data and try again.',
		},
		unknown: {
			title: 'Could not sign in',
			message:
				'Something went wrong while signing in on this device. Try again; if it keeps happening, close and reopen the app.',
		},
	},
	registrationClosed: {
		title: 'Sign-up unavailable',
		message:
			'Sign-up for new accounts is closed right now. If you already have an account, use the Sign in button.',
	},
	field: {
		show: 'Show {{label}}',
		hide: 'Hide {{label}}',
	},
	register: {
		stepOf: '{{current}} of {{total}}',
		stepA11y: 'Step {{current}} of {{total}}',
		continue: 'Continue',
		emailTitle: 'Create your account',
		emailSubtitle: 'Enter your email to get started.',
		emailRequiredTitle: 'Required field',
		emailRequiredMessage: 'Enter an email to continue.',
		passwordTitle: 'Create your password',
		passwordSubtitle: 'You will use it, together with your email, to sign in.',
		passwordLabel: 'Password',
		confirmLabel: 'Confirm password',
		weakTitle: 'Weak password',
		weakMessage: 'Use at least {{min}} characters.',
		tooLongTitle: 'Password too long',
		tooLongMessage: 'Use at most {{max}} bytes (accents and symbols take up more than 1).',
		mismatchTitle: 'Passwords do not match',
		mismatchMessage: 'The confirmation does not match the password.',
	},
	rules: {
		minLength: 'At least {{min}} characters',
		matches: 'Both passwords match',
		tooLong: 'At most {{max}} bytes (accents and symbols take up more space)',
		met: 'met',
		unmet: 'not met',
		pending: 'pending',
		state: '{{text}}: {{state}}',
	},
	hint: {
		minLength: 'At least {{min}} characters',
		valid: 'Valid password',
		tooLong: 'At most {{max}} bytes (accents and symbols take up more space)',
	},
}
