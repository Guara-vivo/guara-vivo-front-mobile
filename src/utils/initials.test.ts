import { getInitials } from './initials'

describe('getInitials', () => {
	it('usa as iniciais das duas primeiras palavras', () => {
		expect(getInitials('Ana Flávia')).toBe('AF')
		expect(getInitials('Ana Flávia Vieira Kunzendorff')).toBe('AF')
	})

	it('ignora espaços sobrando e coloca em maiúscula', () => {
		expect(getInitials('  ana ')).toBe('A')
	})

	it('devolve ponto de interrogação para nome vazio', () => {
		expect(getInitials('')).toBe('?')
		expect(getInitials('   ')).toBe('?')
	})
})
