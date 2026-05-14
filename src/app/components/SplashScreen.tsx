interface SplashScreenProps {
	onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
	// Auto-avança após 2 segundos
	setTimeout(() => {
		onFinish()
	}, 2000)

	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-secondary-light)]/20">
			<div className="text-center">
				<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xl font-semibold tracking-[0.25em] text-[var(--color-secondary-foreground)] animate-pulse shadow-lg">
					GV
				</div>
				<p className="text-sm uppercase tracking-[0.3em] text-[var(--color-foreground)]/70">
					GuaráVivo
				</p>
			</div>
		</div>
	)
}
