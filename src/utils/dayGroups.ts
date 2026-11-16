import type { RecordItem } from '../types/records'
import i18n from '../i18n'
import { formatRelativeDay } from './dayLabels'
import { formatDayMonth } from './timeFormatters'

export type HistoryRow =
	| { kind: 'header'; key: string; label: string }
	| { kind: 'record'; key: string; item: RecordItem }

// Mesma regra de recordKey (pendingRecords), sem puxar a cadeia de serviços para um util puro.
function rowKey(item: RecordItem) {
	return item.client_uuid && item.sync_state ? item.client_uuid : String(item.id)
}

function dayKey(datetime: string) {
	const date = new Date(datetime)
	return Number.isNaN(date.getTime())
		? 'invalid'
		: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function groupLabel(datetime: string, now: Date) {
	const label = formatRelativeDay(datetime, now)
	if (label !== i18n.t('dates:yesterday')) return label

	const date = new Date(datetime)
	return i18n.t('dates:yesterdayWithDate', { date: formatDayMonth(date) })
}

// Intercala um cabeçalho de dia antes de cada sequência de registros do mesmo dia (mantém a ordem recebida).
export function groupRecordsByDay(records: RecordItem[], now: Date): HistoryRow[] {
	const rows: HistoryRow[] = []
	let currentDay: string | null = null

	records.forEach((item, index) => {
		const day = dayKey(item.datetime)
		if (day !== currentDay) {
			currentDay = day
			rows.push({ kind: 'header', key: `day-${index}`, label: groupLabel(item.datetime, now) })
		}
		rows.push({ kind: 'record', key: rowKey(item), item })
	})

	return rows
}
