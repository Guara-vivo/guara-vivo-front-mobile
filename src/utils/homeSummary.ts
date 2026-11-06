export type HomeSummary = { weekRecords: number; ibis: number; areas: number }

type SummarizableRecord = {
	datetime: string
	ibis_quantity: number
	map_zones: { id: number }[]
}

const WEEK_DAYS = 7

// Resumo dos últimos 7 dias corridos: registros, guarás avistados e áreas distintas.
export function summarizeRecords(
	records: SummarizableRecord[],
	now: Date,
): HomeSummary {
	const start = new Date(now)
	start.setDate(start.getDate() - WEEK_DAYS)
	const zoneIds = new Set<number>()
	let weekRecords = 0
	let ibis = 0

	for (const record of records) {
		const date = new Date(record.datetime)
		const time = date.getTime()
		if (Number.isNaN(time) || time < start.getTime() || time > now.getTime()) {
			continue
		}

		weekRecords += 1
		ibis += record.ibis_quantity
		record.map_zones.forEach((zone) => zoneIds.add(zone.id))
	}

	return { weekRecords, ibis, areas: zoneIds.size }
}
