import { useEffect, useState } from 'react'

// Devolve `value` só depois de ficar `delayMs` sem mudar (ex.: filtrar a lista após a pausa na digitação).
export function useDebouncedValue<T>(value: T, delayMs: number): T {
	const [debounced, setDebounced] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delayMs)
		return () => clearTimeout(timer)
	}, [value, delayMs])

	return debounced
}
