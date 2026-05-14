import { Bell } from 'lucide-react'
import { Header } from './Header'
import { useState } from 'react'

interface NotificationsScreenProps {
	onNavigate: (screen: string) => void
}

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
	const [notifications, setNotifications] = useState({
		newRecords: true,
		mapUpdates: false,
		monthlyReport: true,
		systemAlerts: true,
	})

	const handleToggle = (key: keyof typeof notifications) => {
		setNotifications({ ...notifications, [key]: !notifications[key] })
	}

	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			<Header title="Notificações" />

			<div className="mx-auto max-w-2xl px-6 pt-24">
				<div className="rounded-2xl bg-white p-6 shadow-lg">
					<h2 className="mb-6 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
						<Bell className="w-5 h-5" />
						Preferências de Notificação
					</h2>

					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-4">
							<div>
								<div className="mb-1 text-[var(--color-foreground)]">
									Novos Registros
								</div>
								<div className="text-xs text-[var(--color-muted-foreground)]">
									Receba notificações sobre novos avistamentos
								</div>
							</div>
							<label className="relative inline-block w-12 h-6">
								<input
									type="checkbox"
									checked={notifications.newRecords}
									onChange={() => handleToggle('newRecords')}
									className="opacity-0 w-0 h-0 peer"
								/>
								<span className="absolute inset-0 cursor-pointer rounded-full bg-[var(--color-switch-background)] transition-all before:absolute before:left-0.5 before:bottom-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:content-[''] peer-checked:bg-[var(--color-secondary)] peer-checked:before:translate-x-6"></span>
							</label>
						</div>

						<div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-4">
							<div>
								<div className="mb-1 text-[var(--color-foreground)]">
									Atualizações de Mapas
								</div>
								<div className="text-xs text-[var(--color-muted-foreground)]">
									Notifique quando houver mudanças nos mapas de calor
								</div>
							</div>
							<label className="relative inline-block w-12 h-6">
								<input
									type="checkbox"
									checked={notifications.mapUpdates}
									onChange={() => handleToggle('mapUpdates')}
									className="opacity-0 w-0 h-0 peer"
								/>
								<span className="absolute inset-0 cursor-pointer rounded-full bg-[var(--color-switch-background)] transition-all before:absolute before:left-0.5 before:bottom-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:content-[''] peer-checked:bg-[var(--color-secondary)] peer-checked:before:translate-x-6"></span>
							</label>
						</div>

						<div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-4">
							<div>
								<div className="mb-1 text-[var(--color-foreground)]">
									Relatório Mensal
								</div>
								<div className="text-xs text-[var(--color-muted-foreground)]">
									Resumo mensal de atividades e estatísticas
								</div>
							</div>
							<label className="relative inline-block w-12 h-6">
								<input
									type="checkbox"
									checked={notifications.monthlyReport}
									onChange={() => handleToggle('monthlyReport')}
									className="opacity-0 w-0 h-0 peer"
								/>
								<span className="absolute inset-0 cursor-pointer rounded-full bg-[var(--color-switch-background)] transition-all before:absolute before:left-0.5 before:bottom-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:content-[''] peer-checked:bg-[var(--color-secondary)] peer-checked:before:translate-x-6"></span>
							</label>
						</div>

						<div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-4">
							<div>
								<div className="mb-1 text-[var(--color-foreground)]">
									Alertas do Sistema
								</div>
								<div className="text-xs text-[var(--color-muted-foreground)]">
									Avisos importantes e atualizações do aplicativo
								</div>
							</div>
							<label className="relative inline-block w-12 h-6">
								<input
									type="checkbox"
									checked={notifications.systemAlerts}
									onChange={() => handleToggle('systemAlerts')}
									className="opacity-0 w-0 h-0 peer"
								/>
								<span className="absolute inset-0 cursor-pointer rounded-full bg-[var(--color-switch-background)] transition-all before:absolute before:left-0.5 before:bottom-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-all before:content-[''] peer-checked:bg-[var(--color-secondary)] peer-checked:before:translate-x-6"></span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
