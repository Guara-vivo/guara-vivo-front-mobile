import i18n from '../i18n'
import { formatRelativeDay } from './dayLabels'
import { groupRecordsByDay } from './dayGroups'
import { formatDate, formatDateAtTime, formatTime } from './recordFormatters'
import { formatLastUpdatedAt, formatLongDate } from './timeFormatters'
import type { RecordItem } from '../types/records'

const now = new Date(2026, 10, 4, 12, 0, 0)

// Datas e horas em inglês: mês antes do dia e relógio de 12 h.
describe('datas em inglês (en-US)', () => {
	beforeAll(async () => {
		await i18n.changeLanguage('en-US')
	})

	afterAll(async () => {
		await i18n.changeLanguage('pt-BR')
	})

	it('escreve a data longa com o mês antes do dia', () => {
		expect(formatLongDate(new Date(2026, 10, 4))).toBe('Wednesday, November 4')
	})

	it('usa Today e Yesterday, e mês antes do dia no resto', () => {
		expect(formatRelativeDay(new Date(2026, 10, 4, 0, 5).toISOString(), now)).toBe('Today')
		expect(formatRelativeDay(new Date(2026, 10, 3, 23, 50).toISOString(), now)).toBe('Yesterday')
		expect(formatRelativeDay(new Date(2026, 6, 31, 20, 29).toISOString(), now)).toBe('July 31')
		expect(formatRelativeDay(new Date(2025, 6, 31, 20, 29).toISOString(), now)).toBe('July 31, 2025')
		expect(formatRelativeDay('lixo', now)).toBe('Invalid date')
	})

	it('escreve a data numérica como mês/dia/ano', () => {
		expect(formatDate(new Date(2026, 10, 4).toISOString())).toBe('11/04/2026')
		expect(formatDate('lixo')).toBe('--/--/----')
	})

	it('usa relógio de 12 h com AM/PM', () => {
		expect(formatTime(new Date(2026, 10, 4, 19, 35).toISOString())).toBe('7:35 PM')
		expect(formatTime(new Date(2026, 10, 4, 0, 5).toISOString())).toBe('12:05 AM')
		expect(formatTime(new Date(2026, 10, 4, 12, 0).toISOString())).toBe('12:00 PM')
		expect(formatTime('lixo')).toBe('--:--')
	})

	it('junta data e hora com "at"', () => {
		expect(formatDateAtTime(new Date(2026, 10, 4, 19, 35).toISOString())).toBe('11/04/2026 at 7:35 PM')
	})

	it('diz há quanto tempo foi a atualização', () => {
		expect(formatLastUpdatedAt(null, now)).toBe('Never updated')
		expect(formatLastUpdatedAt(new Date(2026, 10, 4, 11, 59, 40), now)).toBe('Updated just now')
		expect(formatLastUpdatedAt(new Date(2026, 10, 4, 11, 30), now)).toBe('Updated 30 min ago')
		expect(formatLastUpdatedAt(new Date(2026, 10, 4, 9, 0), now)).toBe('Updated 3 h ago')
	})

	it('rotula o grupo de ontem com a data', () => {
		const record = {
			id: 1,
			datetime: new Date(2026, 10, 3, 9, 0).toISOString(),
		} as unknown as RecordItem
		const rows = groupRecordsByDay([record], now)
		expect(rows[0]).toMatchObject({ kind: 'header', label: 'Yesterday · November 3' })
	})
})

describe('datas em português (pt-BR)', () => {
	it('mantém dia/mês/ano e relógio de 24 h', () => {
		expect(formatDate(new Date(2026, 10, 4).toISOString())).toBe('04/11/2026')
		expect(formatTime(new Date(2026, 10, 4, 19, 35).toISOString())).toBe('19:35')
		expect(formatDateAtTime(new Date(2026, 10, 4, 19, 35).toISOString())).toBe('04/11/2026 às 19:35')
	})
})
