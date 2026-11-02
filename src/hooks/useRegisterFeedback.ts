import { useState } from 'react'
import { errorFeedback, type RegisterFeedback } from '../utils/registerFeedback'

// Mensagem exibida no modal de retorno da tela de registro.
export function useRegisterFeedback() {
	const [feedback, setFeedback] = useState<RegisterFeedback | null>(null)

	const showErrorFeedback = (title: string, message: string) => {
		setFeedback(errorFeedback(title, message))
	}

	const clearFeedback = () => setFeedback(null)

	return { feedback, setFeedback, showErrorFeedback, clearFeedback }
}
