import * as Location from 'expo-location'

export type DevicePosition = { latitude: number; longitude: number }

export class LocationUnavailableError extends Error {
	constructor() {
		super('Localização indisponível')
	}
}

const DEFAULT_TIMEOUT_MS = 15000

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('Location timeout')), timeoutMs)
		promise.then(
			(value) => {
				clearTimeout(timer)
				resolve(value)
			},
			(error) => {
				clearTimeout(timer)
				reject(error)
			},
		)
	})
}

// Posicao atual com prazo. Sem sinal de GPS (ou sem resposta no prazo), usa a ultima
// posicao conhecida do aparelho em vez de deixar o usuario esperando para sempre.
export async function getDevicePosition(
	timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<DevicePosition> {
	try {
		const position = await withTimeout(
			Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
			timeoutMs,
		)
		return { latitude: position.coords.latitude, longitude: position.coords.longitude }
	} catch {
		// Cai para a ultima posicao conhecida.
	}

	try {
		const last = await Location.getLastKnownPositionAsync()
		if (last) {
			return { latitude: last.coords.latitude, longitude: last.coords.longitude }
		}
	} catch {
		// Sem ultima posicao.
	}

	throw new LocationUnavailableError()
}
