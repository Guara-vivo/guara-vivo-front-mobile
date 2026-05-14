import { MapPin, Map, List } from 'lucide-react'
import logoSimplificada from '../../imports/Logo_Simplificada_Fonte_Escura.png'
import { Button } from './ui/button'

interface HomeScreenProps {
	onNavigate: (screen: string) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
	return (
		<div className="flex flex-col justify-center min-h-screen bg-[var(--color-muted)] px-6 pb-28">
			<div className="text-center mb-12">
				<img
					src={logoSimplificada}
					alt="GuaráVivo Logo"
					className="h-48 md:h-56 mx-auto mb-6"
				/>
				<h2 className="text-[var(--color-foreground)] text-lg md:text-xl mb-2 uppercase tracking-wide">
					Sistema de Monitoramento
				</h2>
				<p className="text-[var(--color-foreground)]/70 text-sm max-w-md mx-auto px-4">
					Auxílio ao monitoramento e proteção do Guará na ARIE
				</p>
			</div>

			<div className="w-full max-w-lg mx-auto space-y-4">
				{/* Botão Principal - Novo Registro */}
				<Button
					onClick={() => onNavigate('register')}
					className="w-full p-6 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between"
				>
					<div className="flex items-center gap-4">
						<div className="bg-[var(--color-card)]/20 p-3 rounded-xl">
							<MapPin className="w-8 h-8" />
						</div>
						<span className="text-lg uppercase tracking-wide">
							Novo Registro
						</span>
					</div>
					<div className="text-2xl">→</div>
				</Button>

				{/* Botões Secundários - Grid 2 colunas */}
				<div className="grid grid-cols-2 gap-4">
					<Button
						variant="outline"
						onClick={() => onNavigate('maps')}
						className="p-6 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-3"
					>
						<Map className="w-10 h-10" />
						<span className="text-sm uppercase tracking-wide text-center">
							Ver Mapas
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={() => onNavigate('history')}
						className="p-6 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-3"
					>
						<List className="w-10 h-10" />
						<span className="text-sm uppercase tracking-wide text-center">
							Histórico
						</span>
					</Button>
				</div>
			</div>
		</div>
	)
}
