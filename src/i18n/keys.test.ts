import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import ptBR from './locales/pt-BR'

// As chaves de tradução são strings sem tipo: uma chave errada só apareceria na tela (como o
// próprio texto da chave). Aqui cada chave escrita no código precisa existir nas traduções.

const ROOT = join(process.cwd(), 'src')
const KEY_PATTERN = /^[A-Za-z0-9_]+(:[A-Za-z0-9_]+)?(\.[A-Za-z0-9_]+)*$/

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return name === 'locales' ? [] : walk(path)
		return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : []
	})
}

function exists(namespace: string, path: string): boolean {
	let node: unknown = (ptBR as Record<string, unknown>)[namespace]
	for (const part of path.split('.')) {
		if (node === null || typeof node !== 'object') return false
		node = (node as Record<string, unknown>)[part]
	}
	return node !== undefined
}

// Texto entre os parênteses de uma chamada `t(...)`, com contagem de parênteses.
function callArguments(source: string, openIndex: number): string {
	let depth = 0
	for (let index = openIndex; index < source.length; index += 1) {
		if (source[index] === '(') depth += 1
		if (source[index] === ')') {
			depth -= 1
			if (depth === 0) return source.slice(openIndex + 1, index)
		}
	}
	return ''
}

function namespacesOf(source: string): string[] {
	const found = new Set<string>(['common'])
	for (const match of source.matchAll(/useTranslation\(\s*(\[[^\]]*\]|'[^']*')/g)) {
		for (const ns of match[1].matchAll(/'([^']+)'/g)) found.add(ns[1])
	}
	return [...found]
}

describe('chaves de tradução usadas no código', () => {
	it('existem todas em português (e, pelo outro teste, em inglês)', () => {
		const missing: string[] = []

		for (const file of walk(ROOT)) {
			const source = readFileSync(file, 'utf8')
			const namespaces = namespacesOf(source)

			for (const call of source.matchAll(/(?:^|[^\w])t\(/g)) {
				const openIndex = (call.index ?? 0) + call[0].length - 1
				const args = callArguments(source, openIndex)

				for (const literal of args.matchAll(/'([^'$]+)'/g)) {
					const key = literal[1]
					// Só o que parece chave (com "." ou ":"); ignora valores como 'desc' ou textos.
					if (!KEY_PATTERN.test(key) || !/[.:]/.test(key)) continue

					const [first, rest] = key.includes(':') ? key.split(':') : [null, key]
					const candidates = first ? [first] : namespaces
					if (!candidates.some((ns) => exists(ns, rest))) {
						missing.push(`${file.replace(ROOT, 'src')}: ${key}`)
					}
				}
			}
		}

		expect(missing).toEqual([])
	})
})
