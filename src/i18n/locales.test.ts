import ptBR from './locales/pt-BR'
import enUS from './locales/en-US'

// Caminhos de todas as chaves de texto, como `common.language.title`.
function keys(tree: unknown, prefix = ''): string[] {
	if (typeof tree === 'string') return [prefix]
	if (Array.isArray(tree)) return tree.flatMap((item, i) => keys(item, `${prefix}[${i}]`))
	if (tree && typeof tree === 'object') {
		return Object.entries(tree).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
	}
	return [prefix]
}

// Variáveis `{{nome}}` de um texto.
function placeholders(text: string): string[] {
	return [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort()
}

function get(tree: unknown, path: string): unknown {
	return path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], tree)
}

describe('traduções', () => {
	it('pt-BR e en-US têm exatamente as mesmas chaves', () => {
		const pt = keys(ptBR).sort()
		const en = keys(enUS).sort()
		expect(pt.filter((k) => !en.includes(k))).toEqual([])
		expect(en.filter((k) => !pt.includes(k))).toEqual([])
	})

	it('nenhum texto está vazio', () => {
		const empty: string[] = []
		for (const [name, tree] of [
			['pt-BR', ptBR],
			['en-US', enUS],
		] as const) {
			for (const key of keys(tree)) {
				const value = get(tree, key)
				if (typeof value !== 'string' || value.trim() === '') empty.push(`${name}: ${key}`)
			}
		}
		expect(empty).toEqual([])
	})

	it('as variáveis {{...}} são as mesmas nos dois idiomas', () => {
		const different: string[] = []
		for (const key of keys(ptBR)) {
			const pt = get(ptBR, key)
			const en = get(enUS, key)
			if (typeof pt !== 'string' || typeof en !== 'string') continue
			if (placeholders(en).join() !== placeholders(pt).join()) different.push(key)
		}
		expect(different).toEqual([])
	})
})
