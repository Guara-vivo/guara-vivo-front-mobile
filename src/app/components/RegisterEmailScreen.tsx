import type { FormEvent } from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface RegisterEmailScreenProps {
	onNavigate: (screen: string) => void
}

export function RegisterEmailScreen({ onNavigate }: RegisterEmailScreenProps) {
	const handleContinue = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		onNavigate('register-password')
	}

	return (
		<div className="min-h-screen bg-white px-6 py-12">
			<div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col">
				<h1 className="mb-12 text-[var(--color-foreground)]">Crie sua conta</h1>

				<form
					onSubmit={handleContinue}
					className="flex flex-1 flex-col justify-between gap-8"
				>
					<Input
						type="email"
						placeholder="Qual seu e-mail?"
						className="border-0 border-b border-[var(--color-border)] bg-transparent px-0 pb-3 text-[var(--color-foreground)] shadow-none placeholder:text-[var(--color-muted-foreground)] focus-visible:ring-0"
					/>

					<Button
						type="submit"
						className="w-full rounded-xl bg-[var(--color-foreground)] py-4 uppercase tracking-wide text-[var(--color-primary-foreground)] shadow-lg transition-colors hover:opacity-90"
					>
						Continuar
					</Button>
				</form>
			</div>
		</div>
	)
}
