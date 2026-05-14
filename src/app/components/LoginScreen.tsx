import { useState } from 'react'
import { EyeOff, Eye } from 'lucide-react'

interface LoginScreenProps {
	onNavigate: (screen: string) => void
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
	const [showPassword, setShowPassword] = useState(false)

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		onNavigate('home')
	}

	return (
		<div className="min-h-screen bg-[var(--color-card)] px-6 py-12">
			<div className="max-w-md mx-auto">
				<h1 className="text-[var(--color-foreground)] mb-12">Acessar conta</h1>

				<form onSubmit={handleLogin} className="space-y-8">
					<div>
						<input
							type="email"
							placeholder="E-mail de acesso"
							className="w-full pb-3 border-b border-[var(--color-foreground)]/20 focus:border-[var(--color-foreground)] focus:outline-none bg-transparent text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/40"
						/>
					</div>

					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Senha de acesso"
							className="w-full pb-3 border-b border-[var(--color-foreground)]/20 focus:border-[var(--color-foreground)] focus:outline-none bg-transparent text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/40 pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-0 top-0 text-[var(--color-foreground)]/40 hover:text-[var(--color-foreground)] transition-colors"
						>
							{showPassword ? (
								<Eye className="w-5 h-5" />
							) : (
								<EyeOff className="w-5 h-5" />
							)}
						</button>
					</div>

					<div>
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault()
								onNavigate('forgot-password')
							}}
							className="text-[var(--color-secondary)] hover:underline"
						>
							Recuperar senha
						</a>
					</div>

					<div className="pt-8">
						<button
							type="submit"
							className="w-full bg-[var(--color-sidebar-primary)] hover:opacity-95 text-[var(--color-primary-foreground)] py-4 rounded-xl uppercase tracking-wide transition-colors shadow-lg"
						>
							Acessar
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
