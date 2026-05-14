import { User, Camera, ArrowLeft } from 'lucide-react'
import { useState, useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface EditProfileScreenProps {
	onNavigate: (screen: string) => void
}

export function EditProfileScreen({ onNavigate }: EditProfileScreenProps) {
	const [formData, setFormData] = useState({
		name: 'João da Silva Goulard',
		email: 'joaosgoulard@email.com',
	})
	const [profileImage, setProfileImage] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setProfileImage(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onNavigate('profile')
	}

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
						Editar Perfil
					</h1>
				</div>
			</div>

			<div className="pt-20 px-6 max-w-2xl mx-auto">
				<form
					onSubmit={handleSubmit}
					className="bg-white rounded-2xl shadow-lg p-8"
				>
					<div className="flex flex-col items-center mb-8">
						{/* Avatar */}
						<div className="relative mb-6">
							<div className="w-32 h-32 rounded-full bg-white border-4 border-[var(--color-secondary)] flex items-center justify-center overflow-hidden">
								{profileImage ? (
									<img
										src={profileImage}
										alt="Foto de perfil"
										className="w-full h-full object-cover"
									/>
								) : (
									<User
										className="w-16 h-16 text-[var(--color-secondary)]"
										strokeWidth={2}
									/>
								)}
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--color-primary)] hover:opacity-95 rounded-full border-2 border-white flex items-center justify-center transition-colors shadow-lg"
							>
								<Camera className="w-5 h-5 text-[var(--color-primary-foreground)]" />
							</button>
						</div>
					</div>

					<div className="space-y-6">
						{/* Nome */}
						<div>
							<label className="block text-[var(--color-foreground)] mb-2 uppercase text-sm tracking-wide">
								Nome Completo
							</label>
							<Input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full px-4 py-3 rounded-lg"
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-[var(--color-foreground)] mb-2 uppercase text-sm tracking-wide">
								E-mail
							</label>
							<Input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full px-4 py-3 rounded-lg"
							/>
						</div>

						{/* Botões */}
						<div className="flex gap-4 pt-4">
							<Button type="submit" className="flex-1">
								Salvar Alterações
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
