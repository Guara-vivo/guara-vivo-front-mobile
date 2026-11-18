// Registrar um avistamento (3 passos) e as mensagens do envio.
export default {
	stepCount: 'Passo {{step}} de {{total}}',
	steps: {
		1: { title: 'Fotos do avistamento', hint: 'Adicione pelo menos uma foto.' },
		2: { title: 'O que os guarás estavam fazendo?', hint: 'Escolha um ou mais comportamentos.' },
		3: { title: 'Onde e quando?', hint: 'Já preenchemos com o local e a hora de agora.' },
	},
	back: 'Voltar',
	continue: 'Continuar',
	sending: 'Enviando...',
	save: 'Salvar registro',
	placeTitle: 'Local do avistamento',
	dateTitle: 'Data e hora',
	futureError: 'A data e a hora não podem estar no futuro.',
	images: {
		add: 'Adicionar fotos',
		preparing: 'Preparando imagens...',
		tap: 'Toque para adicionar fotos',
		multiple: 'Você pode escolher mais de uma',
		photoOf: 'Foto {{n}} de {{total}}',
		remove: 'Remover imagem',
	},
	location: {
		mapA11y: 'Mapa para escolher a localização do registro',
		confirmA11y: 'Confirmar localização',
		confirm: 'Confirmar Localização',
		selected: 'Localização selecionada',
		current: 'Localização atual do dispositivo',
		changeA11y: 'Localização selecionada. Alterar no mapa',
		chooseA11y: 'Escolher localização no mapa. Usando a localização do dispositivo',
		useDevice: 'Usar a localização do dispositivo',
	},
	dateTime: {
		dateA11y: 'Data do avistamento: {{value}}. Alterar',
		timeA11y: 'Hora do avistamento: {{value}}. Alterar',
	},
	feedback: {
		sent: {
			title: 'Registro enviado',
			message: 'Registro enviado para processamento com sucesso.',
		},
		saved: {
			title: 'Registro salvo',
			message:
				'Não foi possível enviar agora. O registro foi salvo no aparelho e será enviado automaticamente.',
		},
		imageRequired: {
			title: 'Imagem obrigatória',
			message: 'Adicione pelo menos uma imagem para salvar o registro.',
		},
		behaviorInvalid: {
			title: 'Comportamento inválido',
			message: 'Selecione um comportamento válido para enviar o registro.',
		},
		locationPermission: {
			title: 'Permissão necessária',
			message: 'Permita acesso à localização para enviar o registro.',
		},
		photosPermission: {
			title: 'Permissão necessária',
			message: 'Permita acesso às fotos para adicionar imagens.',
		},
		imageTooLarge: {
			title: 'Imagem muito grande',
			message: 'Cada imagem deve ter no máximo 5 MB.',
		},
		galleryError: {
			title: 'Erro ao abrir galeria',
			message: 'Não foi possível acessar a galeria. Tente novamente.',
		},
		uploadImage: {
			title: 'Imagens muito grandes',
			message: 'Cada imagem deve ter no máximo 5 MB.',
		},
		uploadTotal: {
			title: 'Imagens muito grandes',
			message: 'As imagens somam mais de 10 MB. Remova alguma.',
		},
		locationUnavailable: {
			title: 'Localização indisponível',
			message:
				'Não foi possível obter a localização do aparelho. Escolha o local no mapa ou tente de novo em um lugar com sinal de GPS.',
		},
		sendFailed: {
			title: 'Falha no envio',
			message: 'Não foi possível enviar o registro. Tente novamente.',
		},
	},
}
