function pad(value: number) {
	return String(value).padStart(2, '0')
}

export function formatDate(dateString: string) {
	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) {
		return '--/--/----'
	}

	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function formatTime(dateString: string) {
	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) {
		return '--:--'
	}

	return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatLocationLabel(latitude: number, longitude: number) {
	return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}
