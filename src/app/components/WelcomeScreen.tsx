interface WelcomeScreenProps {
	onNavigate: (screen: string) => void
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-between bg-[var(--color-secondary-light)]/20 px-6 py-12">
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-secondary)] text-2xl font-semibold tracking-[0.25em] text-[var(--color-secondary-foreground)] shadow-lg">
						GV
					</div>
					<p className="text-sm uppercase tracking-[0.3em] text-[var(--color-foreground)]/70">
						GuaráVivo
					</p>
				</div>
			</div>

			<div className="w-full max-w-md space-y-4 pb-8">
				<button
					onClick={() => onNavigate('login')}
					className="w-full rounded-xl bg-[var(--color-foreground)] py-4 uppercase tracking-wide text-[var(--color-primary-foreground)] shadow-lg transition-colors hover:opacity-90"
				>
					Acessar minha conta
				</button>

				<button
					onClick={() => onNavigate('register-email')}
					className="w-full py-4 uppercase tracking-wide text-[var(--color-foreground)] transition-colors hover:opacity-80"
				>
					Criar conta
				</button>
			</div>
		</div>
	)
}
