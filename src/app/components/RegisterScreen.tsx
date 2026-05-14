import {
	Camera,
	MapPin,
	Calendar,
	Users,
	Activity,
	Loader2,
	X,
} from 'lucide-react'
import { Header } from './Header'
import { ConfirmDialog } from './ConfirmDialog'
import { useState, useEffect, useRef } from 'react'

interface RegisterScreenProps {
	onNavigate: (screen: string) => void
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
	const [images, setImages] = useState<string[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [showSaveDialog, setShowSaveDialog] = useState(false)
	const [showCancelDialog, setShowCancelDialog] = useState(false)
	const [showValidationDialog, setShowValidationDialog] = useState(false)
	const [behaviors, setBehaviors] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [aiResults, setAiResults] = useState<{
		quantity: number | null
		location: { lat: string; lng: string } | null
		distance: number | null
	}>({
		quantity: null,
		location: null,
		distance: null,
	})

	// Data e hora atual como padrão
	const getCurrentDateTime = () => {
		const now = new Date()
		const date = now.toISOString().split('T')[0]
		const time = now.toTimeString().slice(0, 5)
		return { date, time }
	}

	const [dateTime, setDateTime] = useState(getCurrentDateTime())

	// Upload de imagens e análise de IA
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			const fileArray = Array.from(files)
			setImageFiles([...imageFiles, ...fileArray])

			// Criar previews
			const newPreviews: string[] = []
			fileArray.forEach((file) => {
				const reader = new FileReader()
				reader.onloadend = () => {
					newPreviews.push(reader.result as string)
					if (newPreviews.length === fileArray.length) {
						setImages([...images, ...newPreviews])

						// Simula análise de IA
						if (aiResults.quantity === null) {
							analyzeImages()
						}
					}
				}
				reader.readAsDataURL(file)
			})
		}
	}

	const analyzeImages = () => {
		setIsAnalyzing(true)

		// Simula processamento de IA
		// TODO: Integração com backend - enviar imagens para API de análise
		setTimeout(() => {
			setAiResults({
				quantity: 3,
				location: { lat: '-15.7801', lng: '-47.9292' },
				distance: 45,
			})
			setIsAnalyzing(false)
		}, 2000)
	}

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index))
		setImageFiles(imageFiles.filter((_, i) => i !== index))
	}

	const toggleBehavior = (behavior: string) => {
		if (behaviors.includes(behavior)) {
			setBehaviors(behaviors.filter((b) => b !== behavior))
		} else {
			setBehaviors([...behaviors, behavior])
		}
	}

	const handleSave = () => {
		// TODO: Integração com backend
		// Enviar dados para API:
		// - imageFiles (arquivos de imagem)
		// - behaviors (array de comportamentos)
		// - dateTime (data e hora)
		// - aiResults (resultados da IA)

		console.log('Dados para enviar ao backend:', {
			images: imageFiles,
			behaviors,
			dateTime,
			aiResults,
		})

		// Após sucesso da API, navegar de volta
		onNavigate('home')
	}

	const handleCancel = () => {
		// Limpar formulário e voltar
		setImages([])
		setImageFiles([])
		setAiResults({ quantity: null, location: null, distance: null })
		setBehaviors([])
		setDateTime(getCurrentDateTime())
		onNavigate('home')
	}

	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			<Header title="Novo Registro" />

			{/* Dialogs de Confirmação */}
			<ConfirmDialog
				isOpen={showSaveDialog}
				onClose={() => setShowSaveDialog(false)}
				onConfirm={handleSave}
				title="Salvar Registro"
				message="Deseja confirmar o registro deste avistamento?"
				confirmText="Salvar"
				cancelText="Revisar"
				type="success"
			/>

			<ConfirmDialog
				isOpen={showCancelDialog}
				onClose={() => setShowCancelDialog(false)}
				onConfirm={handleCancel}
				title="Cancelar Registro"
				message="Tem certeza que deseja cancelar? Os dados não serão salvos."
				confirmText="Sim, cancelar"
				cancelText="Continuar editando"
				type="warning"
			/>

			{/* Dialog de Validação */}

			<ConfirmDialog
				isOpen={showValidationDialog}
				onClose={() => setShowValidationDialog(false)}
				onConfirm={() => setShowValidationDialog(false)}
				title="Dados Incompletos"
				message="Por favor, adicione pelo menos uma imagem do avistamento para continuar."
				confirmText="Entendi"
				type="warning"
			/>

			<div className="mx-auto max-w-3xl px-6 pt-24">
				<div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
					<h2 className="mb-6 flex items-center gap-2 uppercase tracking-wide text-[var(--color-secondary)]">
						<Camera className="w-6 h-6" />
						Informações do Avistamento
					</h2>

					<form
						onSubmit={(e) => {
							e.preventDefault()
							if (images.length === 0 || aiResults.quantity === null) {
								setShowValidationDialog(true)
							} else {
								setShowSaveDialog(true)
							}
						}}
						className="space-y-6"
					>
						{/* Upload de Imagens - PRIMEIRO */}
						<div>
							<label className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Camera className="w-5 h-5 text-[var(--color-primary)]" />
								Imagens do Avistamento
							</label>

							{/* Preview das imagens */}
							{images.length > 0 && (
								<div className="grid grid-cols-3 gap-3 mb-4">
									{images.map((img, index) => (
										<div
											key={index}
											className="relative aspect-square overflow-hidden rounded-lg border-2 border-[var(--color-secondary-light)]"
										>
											<img
												src={img}
												alt={`Preview ${index + 1}`}
												className="w-full h-full object-cover"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-colors hover:opacity-90"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								multiple
								onChange={handleImageUpload}
								className="hidden"
							/>

							<div
								onClick={() => fileInputRef.current?.click()}
								className="cursor-pointer rounded-lg border-2 border-dashed border-[var(--color-secondary-light)] bg-white p-8 text-center transition-colors hover:border-[var(--color-secondary)]"
							>
								{isAnalyzing ? (
									<div className="flex flex-col items-center">
										<Loader2 className="mx-auto mb-3 h-12 w-12 animate-spin text-[var(--color-secondary)]" />
										<p className="text-[var(--color-secondary)]">
											Analisando imagens com IA...
										</p>
									</div>
								) : (
									<div>
										<Camera className="mx-auto mb-3 h-12 w-12 text-[var(--color-secondary-light)]" />
										<p className="mb-1 text-[var(--color-foreground)]">
											{images.length > 0
												? 'Clique para adicionar mais fotos'
												: 'Clique para adicionar fotos'}
										</p>
										<p className="text-sm text-[var(--color-muted-foreground)]">
											ou arraste e solte aqui
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Resultados da IA - Somente exibição */}
						{aiResults.quantity !== null && (
							<div className="rounded-lg border-2 border-[var(--color-secondary-light)] bg-[var(--color-secondary-light)]/10 p-6">
								<h3 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-secondary)]">
									<Activity className="w-5 h-5" />
									Análise Automática (IA)
								</h3>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--color-foreground)]">
											<Users className="w-5 h-5 text-[var(--color-primary)]" />
											<span className="uppercase text-sm tracking-wide">
												Quantidade de Indivíduos:
											</span>
										</div>
										<span className="text-lg">{aiResults.quantity}</span>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--color-foreground)]">
											<MapPin className="w-5 h-5 text-[var(--color-primary)]" />
											<span className="uppercase text-sm tracking-wide">
												Localização:
											</span>
										</div>
										<span className="text-sm">
											{aiResults.location?.lat}, {aiResults.location?.lng}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-[var(--color-foreground)]">
											<Activity className="w-5 h-5 text-[var(--color-primary)]" />
											<span className="uppercase text-sm tracking-wide">
												Distância Estimada:
											</span>
										</div>
										<span className="text-lg">{aiResults.distance}m</span>
									</div>
								</div>
							</div>
						)}

						{/* Comportamento */}
						<div>
							<label className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Activity className="w-5 h-5 text-[var(--color-primary)]" />
								Comportamento Observado
							</label>
							<div className="space-y-3">
								{['Em cio', 'Ninhando', 'Alimentando', 'Voando', 'Pousado'].map(
									(behavior) => (
										<label
											key={behavior}
											className="flex cursor-pointer items-center gap-3 rounded-lg bg-[var(--color-muted)] p-3 transition-colors hover:bg-white"
										>
											<input
												type="checkbox"
												checked={behaviors.includes(behavior)}
												onChange={() => toggleBehavior(behavior)}
												className="h-5 w-5 accent-[var(--color-primary)]"
											/>
											<span>{behavior}</span>
										</label>
									),
								)}
							</div>
						</div>

						{/* Data e Hora */}
						<div>
							<label className="mb-2 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-foreground)]">
								<Calendar className="w-5 h-5 text-[var(--color-primary)]" />
								Data e Hora do Avistamento
							</label>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="date"
									value={dateTime.date}
									onChange={(e) =>
										setDateTime({ ...dateTime, date: e.target.value })
									}
									className="rounded-lg border-2 border-[var(--color-secondary-light)] bg-[var(--color-muted)] px-4 py-3 focus:border-[var(--color-secondary)] focus:outline-none"
								/>
								<input
									type="time"
									value={dateTime.time}
									onChange={(e) =>
										setDateTime({ ...dateTime, time: e.target.value })
									}
									className="rounded-lg border-2 border-[var(--color-secondary-light)] bg-[var(--color-muted)] px-4 py-3 focus:border-[var(--color-secondary)] focus:outline-none"
								/>
							</div>
						</div>

						{/* Botões */}
						<div className="flex gap-4 pt-4">
							<button
								type="submit"
								className="flex-1 rounded-lg bg-[var(--color-primary)] py-4 uppercase tracking-wide text-[var(--color-primary-foreground)] shadow-lg transition-colors hover:opacity-90"
							>
								Salvar Registro
							</button>
							<button
								type="button"
								onClick={() => setShowCancelDialog(true)}
								className="rounded-lg bg-[var(--color-secondary-light)] px-8 py-4 uppercase tracking-wide text-[var(--color-secondary-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
							>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
