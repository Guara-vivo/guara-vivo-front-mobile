import {
	ArrowLeft,
	Calendar,
	import {
		Activity,
		ArrowLeft,
		Camera,
		Calendar,
		Eye,
		MapPin,
		Users,
	} from 'lucide-react'
	import { Header } from './Header'

	interface RecordDetailScreenProps {
		onNavigate: (screen: string) => void
		recordId?: number
	}

	export function RecordDetailScreen({
		onNavigate,
		recordId = 1,
	}: RecordDetailScreenProps) {
		const record = {
			id: recordId,
			date: '2026-05-12',
			time: '15:30',
			quantity: 3,
			location: {
				name: 'Área A - Setor Norte',
				lat: '-15.7801',
				lng: '-47.9292',
			},
			behaviors: ['Alimentando', 'Voando'],
			distance: 45,
			observations:
				'Grupo de três indivíduos avistados próximo à área de vegetação densa.',
			images: 2,
		}

		return (
			<div className="min-h-screen bg-[var(--color-muted)] pb-24">
				<Header title="Detalhes do Registro" />

				<div className="mx-auto max-w-3xl space-y-6 px-6 pt-24">
					<div className="inline-block rounded-xl bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-foreground)]">
						<span className="uppercase text-sm tracking-wide">
							#{record.id.toString().padStart(3, '0')}
						</span>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-6 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
							Informações Gerais
						</h2>

						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
								<div>
									<div className="mb-1 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
										Data e Hora
									</div>
									<div className="text-[var(--color-foreground)]">
										{new Date(record.date).toLocaleDateString('pt-BR')} às {record.time}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
								<div>
									<div className="mb-1 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
										Localização
									</div>
									<div className="mb-1 text-[var(--color-foreground)]">
										{record.location.name}
									</div>
									<div className="text-sm text-[var(--color-muted-foreground)]">
										Lat: {record.location.lat} / Lng: {record.location.lng}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Users className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
								<div>
									<div className="mb-1 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
										Quantidade
									</div>
									<div className="text-[var(--color-foreground)]">
										{record.quantity}{' '}
										{record.quantity === 1 ? 'indivíduo' : 'indivíduos'}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Eye className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
								<div>
									<div className="mb-1 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
										Distância Estimada
									</div>
									<div className="text-[var(--color-foreground)]">{record.distance} metros</div>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
							<Activity className="h-5 w-5" />
							Comportamentos Observados
						</h2>
						<div className="flex flex-wrap gap-2">
							{record.behaviors.map((behavior) => (
								<span
									key={behavior}
									className="rounded-lg bg-[var(--color-secondary-light)]/20 px-4 py-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]"
								>
									{behavior}
								</span>
							))}
						</div>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-lg">
						<h2 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
							<Camera className="h-5 w-5" />
							Imagens ({record.images})
						</h2>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex aspect-video items-center justify-center rounded-lg bg-[var(--color-secondary-light)]/20">
								<Camera className="h-8 w-8 text-[var(--color-secondary)]/40" />
							</div>
							<div className="flex aspect-video items-center justify-center rounded-lg bg-[var(--color-secondary-light)]/20">
								<Camera className="h-8 w-8 text-[var(--color-secondary)]/40" />
							</div>
						</div>
					</div>

					{record.observations && (
						<div className="rounded-2xl bg-white p-6 shadow-lg">
							<h2 className="mb-4 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
								Observações
							</h2>
							<p className="leading-relaxed text-[var(--color-foreground)]">
								{record.observations}
							</p>
						</div>
					)}
				</div>
			</div>
		)
	}
	)
