import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface ChangePasswordScreenProps {
	onNavigate: (screen: string) => void
}

export function ChangePasswordScreen({
	onNavigate,
}: ChangePasswordScreenProps) {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// TODO: Validar senhas antes de abrir diálogo
		// - Verificar se senha atual está correta
		// - Verificar se nova senha tem no mínimo 8 caracteres
		// - Verificar se nova senha e confirmação são iguais
		setShowConfirmDialog(true)
	}

	const handleConfirmChange = () => {
		// TODO: Integração com backend - enviar nova senha para API
		console.log('Senha alterada com sucesso')
		onNavigate('profile')
	}

	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			{/* Diálogo de Confirmação */}
			<ConfirmDialog
				isOpen={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				onConfirm={handleConfirmChange}
				title="Confirmar Alteração"
				message="Tem certeza que deseja alterar sua senha? Você precisará fazer login novamente após a alteração."
				confirmText="Sim, alterar"
				cancelText="Cancelar"
				type="success"
			/>

			<div className="fixed top-0 left-0 right-0 bg-[var(--color-secondary)] shadow-lg z-10">
				<div className="flex items-center gap-4 px-6 py-4 max-w-screen-lg mx-auto">
					<button
						onClick={() => onNavigate('profile')}
						className="text-[var(--color-secondary-foreground)] hover:opacity-90 transition-colors"
					>
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-[var(--color-secondary-foreground)] uppercase tracking-wide">
						Alterar Senha
					</h1>
				</div>
			</div>

			<div className="mx-auto max-w-2xl px-6 pt-24">
				<form
					onSubmit={handleSubmit}
					className="rounded-2xl bg-white p-8 shadow-lg"
				>
					<div className="space-y-6">
						{/* Senha Atual */}
						<div>
							<label className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Lock className="w-4 h-4 text-[var(--color-primary)]" />
								Senha Atual
							</label>
							<div className="relative">
								<Input
									type={showCurrentPassword ? 'text' : 'password'}
									className="pr-12"
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
								>
									{showCurrentPassword ? (
										<Eye className="w-5 h-5" />
									) : (
										<EyeOff className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Nova Senha */}
						<div>
							<label className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Lock className="w-4 h-4 text-[var(--color-primary)]" />
								Nova Senha
							</label>
							<div className="relative">
								<Input
									type={showNewPassword ? 'text' : 'password'}
									className="pr-12"
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
								>
									{showNewPassword ? (
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

						{/* Confirmar Nova Senha */}
						<div>
							<label className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Lock className="w-4 h-4 text-[var(--color-primary)]" />
								Confirmar Nova Senha
							</label>
							<div className="relative">
								<Input
									type={showConfirmPassword ? 'text' : 'password'}
									className="pr-12"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
								>
									{showConfirmPassword ? (
										<Eye className="w-5 h-5" />
									) : (
										<EyeOff className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Botões */}
						<div className="flex gap-4 pt-4">
							<Button type="submit" className="flex-1">
								Alterar Senha
							</Button>
							<Button
								variant="secondary"
								onClick={() => onNavigate('profile')}
								className="px-8"
							>
								Cancelar
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
