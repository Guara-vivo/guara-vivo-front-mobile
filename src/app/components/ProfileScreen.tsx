import { User, Lock, Bell, Info, LogOut } from 'lucide-react'
import { Header } from './Header'
import { Button } from './ui/button'

interface ProfileScreenProps {
	onNavigate: (screen: string) => void
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			<Header title="Meu Perfil" />

			<div className="mx-auto max-w-2xl px-6 pt-24">
				<div className="rounded-2xl bg-white p-8 shadow-lg">
					<div className="flex flex-col items-center">
						{/* Avatar */}
						<div className="relative mb-6">
							<div className="w-32 h-32 rounded-full bg-white border-4 border-[var(--color-secondary)] flex items-center justify-center overflow-hidden">
								<User
									className="w-16 h-16 text-[var(--color-secondary)]"
									strokeWidth={2}
								/>
							</div>
						</div>

						{/* Nome e Email */}
						<div className="text-center mb-6">
							<h3 className="text-[var(--color-foreground)] mb-2">
								João da Silva Goulard
							</h3>
							<p className="text-[var(--color-foreground)]/60 text-sm">
								joaosgoulard@email.com
							</p>
						</div>

						{/* Botão Editar */}
						<Button
							onClick={() => onNavigate('edit-profile')}
							className="px-12"
						>
							Editar
						</Button>
					</div>
				</div>

				{/* Configurações */}
				<div className="mt-6">
					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h4 className="mb-4 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
							Configurações
						</h4>
						<div className="space-y-3">
							<button
								onClick={() => onNavigate('change-password')}
								className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-muted)] rounded-lg transition-colors text-[var(--color-foreground)]"
							>
								<Lock className="w-5 h-5 text-[var(--color-secondary)]" />
								<span>Alterar senha</span>
							</button>
							<button
								onClick={() => onNavigate('notifications')}
								className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
							>
								<Bell className="w-5 h-5 text-[var(--color-secondary)]" />
								<span>Notificações</span>
							</button>
							<button
								onClick={() => onNavigate('about')}
								className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
							>
								<Info className="w-5 h-5 text-[var(--color-secondary)]" />
								<span>Sobre o app</span>
							</button>
							<button
								onClick={() => onNavigate('logout')}
								className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-muted)] rounded-lg transition-colors text-[var(--color-primary)]"
							>
								<LogOut className="w-5 h-5 text-[var(--color-primary)]" />
								<span>Sair da conta</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
