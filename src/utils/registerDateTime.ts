export function composeRecordDateTime(
	selectedDate: Date | null,
	selectedTime: Date | null,
	now = new Date(),
) {
	const dateSource = selectedDate ?? now
	const timeSource = selectedTime ?? now
	const recordDateTime = new Date(dateSource)

	recordDateTime.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0)
	return recordDateTime
}
