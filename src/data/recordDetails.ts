import type { RecordItem } from '../types/records'

export const recordDetails: Record<number, RecordDetails> = {
	1: {
		location: 'Area A - Setor Norte',
		distanceMeters: 45,
		behaviors: ['Alimentando', 'Voando'],
		observations: 'Grupo de tres individuos avistados proximo a area de vegetacao densa.',
		imageSlots: 2,
	},
	2: {
		location: 'Area C - Trilha Leste',
		distanceMeters: 30,
		behaviors: ['Ninhando', 'Pousado'],
		observations: 'Casal em comportamento de ninho na copa baixa.',
		imageSlots: 2,
	},
	3: {
		location: 'Area B - Mirante Sul',
		distanceMeters: 60,
		behaviors: ['Voando'],
		observations: 'Passagem rapida em voo sobre area aberta.',
		imageSlots: 2,
	},
	4: {
		location: 'Area D - Canal Oeste',
		distanceMeters: 22,
		behaviors: ['Pousado', 'Alimentando'],
		observations: 'Grupo alimentando em margem de canal com lama exposta.',
		imageSlots: 2,
	},
}

interface RecordDetails {
	location: string
	distanceMeters: number
	behaviors: string[]
	observations: string
	imageSlots: number
}

export type RecordEntry = RecordItem & RecordDetails
