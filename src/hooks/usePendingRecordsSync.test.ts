// Sem renderizador de componentes no projeto: o React é simulado para capturar os efeitos registrados.
import { setQueueOwner } from '../services/offlineQueue'
import { setRecordsStoreOwner } from '../services/recordsStore'
import { usePendingRecordsSync } from './usePendingRecordsSync'

const mockUseEffect = jest.fn()
const mockUseLayoutEffect = jest.fn()

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useEffect: (...args: unknown[]) => mockUseEffect(...args),
	useLayoutEffect: (...args: unknown[]) => mockUseLayoutEffect(...args),
}))
jest.mock('react-native', () => ({
	AppState: { addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
}))
jest.mock('@react-native-community/netinfo', () => ({
	__esModule: true,
	default: { addEventListener: jest.fn(() => jest.fn()) },
}))
jest.mock('../services/offlineQueue', () => ({
	flushPendingRecords: jest.fn(() => Promise.resolve()),
	setQueueOwner: jest.fn(),
}))
jest.mock('../services/recordsStore', () => ({ setRecordsStoreOwner: jest.fn() }))

type Effect = () => void | (() => void)

function register(userId: number | null) {
	// O React está simulado: não há componente, então o hook é chamado direto.
	// eslint-disable-next-line react-hooks/rules-of-hooks
	usePendingRecordsSync(userId)
	return {
		layout: mockUseLayoutEffect.mock.calls[0]?.[0] as Effect | undefined,
		passive: mockUseEffect.mock.calls[0]?.[0] as Effect | undefined,
	}
}

beforeEach(() => {
	jest.clearAllMocks()
})

describe('usePendingRecordsSync: dono da fila e da cópia local', () => {
	// A Início lê a cópia local num useEffect próprio. Os efeitos de layout do pai rodam antes dos
	// efeitos passivos dos filhos; definir o dono só num useEffect do pai deixa a leitura chegar com
	// o dono ainda null quando os dois montam no mesmo commit.
	it('define o dono num efeito de layout, antes dos efeitos passivos dos filhos', () => {
		const { layout } = register(5)

		expect(layout).toBeDefined()
		layout?.()

		expect(setQueueOwner).toHaveBeenCalledWith(5)
		expect(setRecordsStoreOwner).toHaveBeenCalledWith(5)
	})

	it('o efeito passivo não depende de definir o dono (já foi definido no layout)', () => {
		const { passive } = register(5)

		passive?.()

		expect(setRecordsStoreOwner).not.toHaveBeenCalled()
		expect(setQueueOwner).not.toHaveBeenCalled()
	})

	it('ao sair ou trocar de usuário, o dono volta a null', () => {
		const { layout } = register(5)
		const cleanup = layout?.() as () => void

		cleanup()

		expect(setQueueOwner).toHaveBeenLastCalledWith(null)
		expect(setRecordsStoreOwner).toHaveBeenLastCalledWith(null)
	})

	it('sem usuário, o dono fica null e nada é sincronizado', () => {
		const { layout, passive } = register(null)

		layout?.()
		const cleanup = passive?.()

		expect(setRecordsStoreOwner).toHaveBeenCalledWith(null)
		expect(cleanup).toBeUndefined()
	})
})
