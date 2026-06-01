export function formatLastUpdatedAt(
	lastUpdatedAt: Date | null,
	now = new Date(),
) {
	if (!lastUpdatedAt) {
		return 'Nunca atualizado'
	}

	const diffMs = Math.max(0, now.getTime() - lastUpdatedAt.getTime())
	const diffMinutes = Math.floor(diffMs / 60000)

	if (diffMinutes < 1) {
		return 'Atualizado agora'
	}

	if (diffMinutes < 60) {
		return `Atualizado há ${diffMinutes} min`
	}

	const diffHours = Math.floor(diffMinutes / 60)
	return `Atualizado há ${diffHours} h`
}
