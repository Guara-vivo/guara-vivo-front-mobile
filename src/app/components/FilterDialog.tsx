import { X, Calendar, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface FilterDialogProps {
	isOpen: boolean
	onClose: () => void
	onApply: (filters: FilterOptions) => void
}

export interface FilterOptions {
	dateFrom?: string
	dateTo?: string
	location?: string
	minQuantity?: number
	maxQuantity?: number
	behaviors?: string[]
}

export function FilterDialog({ isOpen, onClose, onApply }: FilterDialogProps) {
	const [filters, setFilters] = useState<FilterOptions>({})
	const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([])

	if (!isOpen) return null

	const toggleBehavior = (behavior: string) => {
		const newBehaviors = selectedBehaviors.includes(behavior)
			? selectedBehaviors.filter((b) => b !== behavior)
			: [...selectedBehaviors, behavior]
		setSelectedBehaviors(newBehaviors)
		setFilters({ ...filters, behaviors: newBehaviors })
	}

	const handleApply = () => {
		// TODO: Integração com backend - enviar filtros para API
		onApply(filters)
		onClose()
	}

	const handleClear = () => {
		setFilters({})
		setSelectedBehaviors([])
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in">
				{/* Header */}
				<div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-foreground)]/10 px-6 py-4 flex items-center justify-between">
					<h3 className="text-[var(--color-secondary)] uppercase tracking-wide">
						Filtros
					</h3>
					<button
						onClick={onClose}
						className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-muted)] rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-[var(--color-foreground)]" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Período */}
					<div>
						<label className="block text-[var(--color-foreground)] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
							<Calendar className="w-4 h-4 text-[var(--color-primary)]" />
							Período
						</label>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs text-[var(--color-foreground)]/60 mb-2">
									De
								</label>
								<Input
									type="date"
									value={filters.dateFrom || ''}
									onChange={(e) =>
										setFilters({ ...filters, dateFrom: e.target.value })
									}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-xs text-[var(--color-foreground)]/60 mb-2">
									Até
								</label>
								<Input
									type="date"
									value={filters.dateTo || ''}
									onChange={(e) =>
										setFilters({ ...filters, dateTo: e.target.value })
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>

					{/* Localização */}
					<div>
						<label className="block text-[var(--color-foreground)] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
							<MapPin className="w-4 h-4 text-[var(--color-primary)]" />
							Localização
						</label>
						<Input
							type="text"
							placeholder="Ex: Área A - Setor Norte"
							value={filters.location || ''}
							onChange={(e) =>
								setFilters({ ...filters, location: e.target.value })
							}
							className="w-full"
						/>
					</div>

					{/* Quantidade de Indivíduos */}
					<div>
						<label className="block text-[var(--color-foreground)] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
							<Users className="w-4 h-4 text-[var(--color-primary)]" />
							Quantidade de Indivíduos
						</label>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs text-[var(--color-foreground)]/60 mb-2">
									Mínimo
								</label>
								<Input
									type="number"
									min="1"
									placeholder="Min"
									value={filters.minQuantity || ''}
									onChange={(e) =>
										setFilters({
											...filters,
											minQuantity: parseInt(e.target.value),
										})
									}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-xs text-[var(--color-foreground)]/60 mb-2">
									Máximo
								</label>
								<Input
									type="number"
									min="1"
									placeholder="Max"
									value={filters.maxQuantity || ''}
									onChange={(e) =>
										setFilters({
											...filters,
											maxQuantity: parseInt(e.target.value),
										})
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>

					{/* Comportamentos */}
					<div>
						<label className="block text-[#1A1A1A] mb-3 uppercase text-sm tracking-wide">
							Comportamentos
						</label>
						<div className="space-y-2">
							{['Em cio', 'Ninhando', 'Alimentando', 'Voando', 'Pousado'].map(
								(behavior) => (
									<label
										key={behavior}
										className="flex items-center gap-3 p-3 bg-[var(--color-muted)] rounded-lg hover:bg-[var(--color-card)] transition-colors cursor-pointer"
									>
										<input
											type="checkbox"
											checked={selectedBehaviors.includes(behavior)}
											onChange={() => toggleBehavior(behavior)}
											className="w-5 h-5 accent-[var(--color-primary)]"
										/>
										<span className="text-sm">{behavior}</span>
									</label>
								),
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-[var(--color-card)] border-t border-[var(--color-foreground)]/10 px-6 py-4 flex gap-3">
					<Button variant="outline" onClick={handleClear} className="flex-1">
						Limpar
					</Button>
					<Button onClick={handleApply} className="flex-1">
						Aplicar Filtros
					</Button>
				</div>
			</div>
		</div>
	)
}
