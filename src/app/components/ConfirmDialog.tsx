import { AlertCircle, CheckCircle } from 'lucide-react'

interface ConfirmDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	type?: 'success' | 'warning'
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText,
	type = 'warning',
}: ConfirmDialogProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200">
				<div className="flex flex-col items-center text-center">
					{type === 'success' ? (
						<div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mb-4">
							<CheckCircle className="w-10 h-10 text-[var(--color-secondary)]" />
						</div>
					) : (
						<div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
							<AlertCircle className="w-10 h-10 text-[var(--color-primary)]" />
						</div>
					)}

					<h3 className="text-[var(--color-foreground)] mb-2 uppercase tracking-wide">
						{title}
					</h3>
					<p className="text-[var(--color-foreground)]/70 text-sm mb-6">
						{message}
					</p>

					<div
						className={`flex gap-3 w-full ${!cancelText ? 'justify-center' : ''}`}
					>
						{cancelText && (
							<button
								onClick={onClose}
								className="flex-1 px-6 py-3 bg-[var(--color-card)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)] rounded-lg uppercase text-sm tracking-wide transition-colors"
							>
								{cancelText}
							</button>
						)}
						<button
							onClick={() => {
								onConfirm()
								onClose()
							}}
							className={`${cancelText ? 'flex-1' : 'w-full'} px-6 py-3 text-[var(--color-primary-foreground)] rounded-lg uppercase text-sm tracking-wide transition-colors ${
								type === 'success'
									? 'bg-[var(--color-secondary)] hover:opacity-95'
									: 'bg-[var(--color-primary)] hover:opacity-95'
							}`}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
