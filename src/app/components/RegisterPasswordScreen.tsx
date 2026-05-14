import type { FormEvent } from 'react'
import { useState } from 'react'
import { EyeOff, Eye } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface RegisterPasswordScreenProps {
	onNavigate: (screen: string) => void
}

export function RegisterPasswordScreen({
	onNavigate,
}: RegisterPasswordScreenProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleContinue = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		onNavigate('home')
	}

	return (
		<div className="min-h-screen bg-white px-6 py-12">
			<div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col">
				<h1 className="mb-12 text-[var(--color-foreground)]">Crie sua senha</h1>

				<form
					onSubmit={handleContinue}
					className="flex flex-1 flex-col justify-between gap-6"
				>
					<div>
						<div className="relative">
							<Input
								type={showPassword ? 'text' : 'password'}
								placeholder="Senha"
								className="border-0 border-b border-[var(--color-border)] bg-transparent px-0 pb-3 pr-10 text-[var(--color-foreground)] shadow-none placeholder:text-[var(--color-muted-foreground)] focus-visible:ring-0"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-0 top-0 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
							>
								{showPassword ? (
									<Eye className="w-5 h-5" />
								) : (
									<EyeOff className="w-5 h-5" />
								)}
							</button>
						</div>
						<p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
							Mínimo de 8 caracteres
						</p>
					</div>

					<div className="relative">
						<Input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirmar senha"
							className="border-0 border-b border-[var(--color-border)] bg-transparent px-0 pb-3 pr-10 text-[var(--color-foreground)] shadow-none placeholder:text-[var(--color-muted-foreground)] focus-visible:ring-0"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-0 top-0 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
						>
							{showConfirmPassword ? (
								<Eye className="w-5 h-5" />
							) : (
								<EyeOff className="w-5 h-5" />
							)}
						</button>
					</div>

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
