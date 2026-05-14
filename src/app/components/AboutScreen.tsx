import { ArrowLeft, Info } from 'lucide-react'

interface AboutScreenProps {
	onNavigate: (screen: string) => void
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			<div className="fixed top-0 left-0 right-0 bg-[var(--color-secondary)] shadow-lg z-10">
				<div className="flex items-center gap-4 px-6 py-4 max-w-screen-lg mx-auto">
					<button
						onClick={() => onNavigate('profile')}
						className="text-[var(--color-secondary-foreground)] hover:opacity-90 transition-colors"
					>
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-[var(--color-secondary-foreground)] uppercase tracking-wide">
						Sobre o App
					</h1>
				</div>
			</div>

			<div className="mx-auto max-w-2xl px-6 pt-24">
				<div className="rounded-2xl bg-white p-8 text-center shadow-lg">
					<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-secondary)] text-lg font-semibold tracking-[0.25em] text-[var(--color-secondary-foreground)]">
						GV
					</div>

					<h2 className="mb-2 text-xl uppercase tracking-wide text-[var(--color-secondary)]">
						GuaráVivo
					</h2>
					<p className="mb-8 text-[var(--color-muted-foreground)]">
						Versão 1.0.0
					</p>

					<div className="text-left space-y-6">
						<div>
							<h3 className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
								<Info className="w-4 h-4" />
								Sobre o Projeto
							</h3>
							<p className="text-sm leading-relaxed text-[var(--color-foreground)]">
								Sistema de auxílio ao monitoramento e proteção do Guará na ARIE.
								O aplicativo facilita o registro de avistamentos, análise de
								comportamentos e geração de mapas de concentração para apoiar a
								equipe de gestão no desenvolvimento de planos de manejo
								eficientes.
							</p>
						</div>

						<div>
							<h3 className="mb-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
								Funcionalidades
							</h3>
							<ul className="space-y-2 text-sm text-[var(--color-foreground)]">
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-primary)]">•</span>
									<span>Registro de avistamentos com análise IA</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-primary)]">•</span>
									<span>Mapeamento de áreas de alimentação e ninhos</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-primary)]">•</span>
									<span>Histórico completo de registros</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-primary)]">•</span>
									<span>Visualização de rotas de voo</span>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
								Desenvolvedores
							</h3>
							<p className="text-[var(--color-foreground)] text-sm">
								Desenvolvido para a ARIE - Área de Relevante Interesse Ecológico
							</p>
						</div>

						<div className="border-t border-[var(--color-foreground)]/10 pt-4">
							<p className="text-center text-xs text-[var(--color-muted-foreground)]">
								© 2026 GuaráVivo. Todos os direitos reservados.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
