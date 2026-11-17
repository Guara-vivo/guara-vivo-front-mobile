import { fetchAllPages, ADMIN_RECORDS_PAGE_SIZE } from './fetchAllPages'

const page = (from: number, count: number) => Array.from({ length: count }, (_, i) => from + i)

describe('fetchAllPages', () => {
	it('junta as páginas até uma vir incompleta', async () => {
		const total = ADMIN_RECORDS_PAGE_SIZE * 2 + 5
		const calls: [number, number][] = []

		const all = await fetchAllPages(async (skip, limit) => {
			calls.push([skip, limit])
			return page(skip, Math.max(0, Math.min(limit, total - skip)))
		})

		expect(all).toHaveLength(total)
		expect(calls).toEqual([
			[0, ADMIN_RECORDS_PAGE_SIZE],
			[ADMIN_RECORDS_PAGE_SIZE, ADMIN_RECORDS_PAGE_SIZE],
			[ADMIN_RECORDS_PAGE_SIZE * 2, ADMIN_RECORDS_PAGE_SIZE],
		])
	})

	it('pede mais uma página depois de uma cheia, que pode vir vazia', async () => {
		let calls = 0

		const all = await fetchAllPages(async (skip) => {
			calls += 1
			return skip === 0 ? page(0, ADMIN_RECORDS_PAGE_SIZE) : []
		})

		expect(all).toHaveLength(ADMIN_RECORDS_PAGE_SIZE)
		expect(calls).toBe(2)
	})

	it('para no limite de páginas mesmo se a API nunca terminar', async () => {
		let calls = 0

		await fetchAllPages(async () => {
			calls += 1
			return page(0, ADMIN_RECORDS_PAGE_SIZE)
		}, 3)

		expect(calls).toBe(3)
	})

	it('um erro em uma página derruba a busca inteira', async () => {
		await expect(
			fetchAllPages(async (skip) => {
				if (skip > 0) throw new Error('falhou')
				return page(0, ADMIN_RECORDS_PAGE_SIZE)
			}),
		).rejects.toThrow('falhou')
	})
})
