// Máximo que a API aceita por chamada nas listas paginadas.
export const ADMIN_RECORDS_PAGE_SIZE = 100
const MAX_PAGES = 100

// Busca página por página até uma vir incompleta; qualquer erro derruba a busca inteira.
export async function fetchAllPages<T>(
	fetchPage: (skip: number, limit: number) => Promise<T[]>,
	maxPages = MAX_PAGES,
): Promise<T[]> {
	const all: T[] = []

	for (let page = 0; page < maxPages; page++) {
		const chunk = await fetchPage(page * ADMIN_RECORDS_PAGE_SIZE, ADMIN_RECORDS_PAGE_SIZE)
		all.push(...chunk)

		if (chunk.length < ADMIN_RECORDS_PAGE_SIZE) break
	}

	return all
}
