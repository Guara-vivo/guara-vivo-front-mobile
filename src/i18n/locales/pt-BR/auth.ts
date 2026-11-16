// Boas-vindas, login, cadastro e regras de senha.
export default {
	welcome: {
		tagline: 'Monitoramento e proteção do guará na ARIE',
		login: 'Entrar na minha conta',
		register: 'Criar conta',
	},
	login: {
		title: 'Entrar',
		subtitle: 'Use o e-mail e a senha da sua conta.',
		email: 'E-mail',
		password: 'Senha',
		submit: 'Entrar',
		submitting: 'Entrando...',
		noAccount: 'Ainda não tem conta?',
		createAccount: 'Criar conta',
		forgot: 'Esqueci minha senha',
		forgotA11y: 'Recuperar senha',
		forgotUnavailable: 'A recuperação de senha ainda não está disponível no aplicativo.',
		requiredTitle: 'Campos obrigatórios',
		requiredMessage: 'Preencha e-mail e senha para continuar.',
	},
	loginError: {
		server: {
			title: 'Servidor indisponível',
			message: 'O servidor está indisponível no momento. Tente novamente em instantes.',
		},
		credentials: {
			title: 'Falha no login',
			message: 'Confira e-mail e senha e tente novamente.',
		},
		slow: {
			title: 'Conexão lenta',
			message: 'A conexão demorou demais. Verifique sua internet e tente novamente.',
		},
		offline: {
			title: 'Sem conexão',
			message: 'Não foi possível acessar o servidor. Verifique o Wi-Fi ou os dados móveis e tente novamente.',
		},
		unknown: {
			title: 'Não foi possível entrar',
			message:
				'Algo deu errado ao concluir o login neste aparelho. Tente novamente; se continuar, feche e abra o app.',
		},
	},
	registrationClosed: {
		title: 'Cadastro indisponível',
		message:
			'O cadastro de novas contas está fechado no momento. Se você já tem uma conta, use o botão Entrar.',
	},
	field: {
		show: 'Mostrar {{label}}',
		hide: 'Ocultar {{label}}',
	},
	register: {
		stepOf: '{{current}} de {{total}}',
		stepA11y: 'Passo {{current}} de {{total}}',
		continue: 'Continuar',
		emailTitle: 'Crie sua conta',
		emailSubtitle: 'Informe seu e-mail para começar.',
		emailRequiredTitle: 'Campo obrigatório',
		emailRequiredMessage: 'Informe um e-mail para continuar.',
		passwordTitle: 'Crie sua senha',
		passwordSubtitle: 'Você vai usar ela, junto com o e-mail, para entrar.',
		passwordLabel: 'Senha',
		confirmLabel: 'Confirmar senha',
		weakTitle: 'Senha fraca',
		weakMessage: 'Use pelo menos {{min}} caracteres.',
		tooLongTitle: 'Senha muito longa',
		tooLongMessage: 'Use no máximo {{max}} bytes (acentos e símbolos ocupam mais de 1).',
		mismatchTitle: 'Senhas diferentes',
		mismatchMessage: 'A confirmação não confere com a senha.',
	},
	rules: {
		minLength: 'Pelo menos {{min}} caracteres',
		matches: 'As duas senhas são iguais',
		tooLong: 'Máximo de {{max}} bytes (acentos e símbolos ocupam mais espaço)',
		met: 'cumprida',
		unmet: 'não cumprida',
		pending: 'pendente',
		state: '{{text}}: {{state}}',
	},
	hint: {
		minLength: 'Mínimo de {{min}} caracteres',
		valid: 'Senha válida',
		tooLong: 'Máximo de {{max}} bytes (acentos e símbolos ocupam mais espaço)',
	},
}
