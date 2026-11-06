// Executa uma recarga no máximo uma vez por intervalo, mas sem perder pedidos: um pedido que chega
// cedo demais é adiado até o fim do intervalo (e vários viram um só), em vez de ser descartado.
export function createRefreshScheduler(run: () => void, minIntervalMs: number) {
	let lastRun = 0
	let timer: ReturnType<typeof setTimeout> | undefined

	const clear = () => {
		if (timer) {
			clearTimeout(timer)
			timer = undefined
		}
	}

	const execute = () => {
		clear()
		lastRun = Date.now()
		run()
	}

	return {
		trigger() {
			if (timer) {
				return
			}

			const wait = lastRun + minIntervalMs - Date.now()

			if (wait <= 0) {
				execute()
				return
			}

			timer = setTimeout(execute, wait)
		},
		// Pede uma recarga depois de um atraso (ex.: confirmar dados que o servidor grava com atraso).
		triggerIn(delayMs: number) {
			clear()
			timer = setTimeout(execute, Math.max(delayMs, lastRun + minIntervalMs - Date.now()))
		},
		cancel: clear,
	}
}
