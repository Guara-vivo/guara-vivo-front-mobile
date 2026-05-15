import { useState } from 'react'

export function usePasswordValidation() {
	const [isValid, setIsValid] = useState(false)
	const [message, setMessage] = useState('')

	const validatePassword = (password: string) => {
		const hasMinLength = password.length >= 8
		const hasUpperCase = /[A-Z]/.test(password)
		const hasLowerCase = /[a-z]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

		const valid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial
		setIsValid(valid)

		if (valid) {
			setMessage('✅ Senha segura')
		} else {
			const messages = []
			if (!hasMinLength) messages.push('Mínimo 8 caracteres ')
			if (!hasUpperCase) messages.push('Maiúscula ')
			if (!hasLowerCase) messages.push('minúscula ')
			if (!hasNumber) messages.push('número ')
			if (!hasSpecial) messages.push('caracter especial ')
			setMessage(`❌ ${messages.join(' + ')}`)
		}

		return valid
	}

	return { isValid, message, validatePassword }
}
