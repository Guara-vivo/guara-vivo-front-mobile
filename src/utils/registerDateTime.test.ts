import { composeRecordDateTime } from './registerDateTime'

const now = new Date(2026, 5, 4, 15, 42, 33, 120)

describe('composeRecordDateTime', () => {
	it('uses the current moment when date and time are empty', () => {
		const result = composeRecordDateTime(null, null, now)

		expect(result).toEqual(new Date(2026, 5, 4, 15, 42, 0, 0))
	})

	it('uses selected date with current time when only date is filled', () => {
		const selectedDate = new Date(2026, 3, 12, 0, 0, 0, 0)

		const result = composeRecordDateTime(selectedDate, null, now)

		expect(result).toEqual(new Date(2026, 3, 12, 15, 42, 0, 0))
	})

	it('uses current date with selected time when only time is filled', () => {
		const selectedTime = new Date(2026, 0, 1, 7, 18, 0, 0)

		const result = composeRecordDateTime(null, selectedTime, now)

		expect(result).toEqual(new Date(2026, 5, 4, 7, 18, 0, 0))
	})

	it('uses selected date and selected time when both are filled', () => {
		const selectedDate = new Date(2026, 8, 21, 0, 0, 0, 0)
		const selectedTime = new Date(2026, 0, 1, 6, 5, 0, 0)

		const result = composeRecordDateTime(selectedDate, selectedTime, now)

		expect(result).toEqual(new Date(2026, 8, 21, 6, 5, 0, 0))
	})
})
