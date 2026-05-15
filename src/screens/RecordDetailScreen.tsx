import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { appStyles } from '../styles/appStyles'
import { mockRecords } from '../data/mockRecords'
import { formatDate, formatTime } from '../data/mockRecords'
import type { ScreenId } from '../types/navigation'

export function RecordDetailScreen({
	onNavigate,
	recordId,
}: {
	onNavigate: (screen: ScreenId) => void
	recordId?: number
}) {
	const record = mockRecords.find((item) => item.id === recordId)
	const detailById: Record<number, any> = {
		1: {
			location: 'Area A - Setor Norte',
			distanceMeters: 45,
			behaviors: ['Alimentando', 'Voando'],
			observations:
				'Grupo de tres individuos avistados proximo a area de vegetacao densa.',
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

	if (!record) {
		return (
			<View style={appStyles.recordDetailScreen}>
				<ScrollView
					style={appStyles.screen}
					contentContainerStyle={appStyles.recordDetailContent}
				>
					<Pressable
						onPress={() => onNavigate('history')}
						style={appStyles.pageBackButton}
					>
						<Ionicons name="chevron-back" size={28} color="#125ED0" />
					</Pressable>

					<View style={appStyles.recordDetailCard}>
						<Text style={appStyles.recordDetailValue}>
							Registro nao encontrado.
						</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

	const details = detailById[record.id] ?? {
		location: `Area ${record.id} - Setor Principal`,
		distanceMeters: 40,
		behaviors: [record.flock_size],
		observations: 'Registro visual sem observacoes adicionais.',
		imageSlots: 2,
	}

	const quantityLabel = `${record.ibis_quantity} ${record.ibis_quantity === 1 ? 'individuo' : 'individuos'}`
	const idLabel = `#${String(record.id).padStart(3, '0')}`

	return (
		<View style={appStyles.recordDetailScreen}>
			<ScrollView
				style={appStyles.screen}
				contentContainerStyle={appStyles.recordDetailContent}
			>
				<Pressable
					onPress={() => onNavigate('history')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.recordDetailIdBadge}>
					<Text style={appStyles.recordDetailIdText}>{idLabel}</Text>
				</View>

				<View style={appStyles.recordDetailCard}>
					<Text style={appStyles.recordDetailSectionTitle}>
						INFORMACOES GERAIS
					</Text>

					<View style={appStyles.recordDetailInfoList}>
						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="calendar-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>DATA E HORA</Text>
								<Text style={appStyles.recordDetailValue}>
									{formatDate(record.datetime)} as {formatTime(record.datetime)}
								</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="location-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>LOCALIZACAO</Text>
								<Text style={appStyles.recordDetailValue}>
									{details.location}
								</Text>
								<Text style={appStyles.recordDetailCoordinates}>
									Lat: {record.latitude.toFixed(4)} / Lng:{' '}
									{record.longitude.toFixed(4)}
								</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="people-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>QUANTIDADE</Text>
								<Text style={appStyles.recordDetailValue}>{quantityLabel}</Text>
							</View>
						</View>

						<View style={appStyles.recordDetailInfoRow}>
							<Ionicons name="eye-outline" size={18} color="#F2201F" />
							<View style={appStyles.recordDetailInfoTextWrap}>
								<Text style={appStyles.recordDetailInfoLabel}>
									DISTANCIA ESTIMADA
								</Text>
								<Text style={appStyles.recordDetailValue}>
									{details.distanceMeters} metros
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<View style={appStyles.recordDetailSectionTitleRow}>
						<Ionicons name="pulse-outline" size={16} color="#125ED0" />
						<Text style={appStyles.recordDetailSectionTitle}>
							COMPORTAMENTOS OBSERVADOS
						</Text>
					</View>

					<View style={appStyles.recordDetailChipRow}>
						{details.behaviors.map((behavior: string) => (
							<View key={behavior} style={appStyles.recordDetailChip}>
								<Text style={appStyles.recordDetailChipText}>
									{behavior.toUpperCase()}
								</Text>
							</View>
						))}
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<View style={appStyles.recordDetailSectionTitleRow}>
						<Ionicons name="camera-outline" size={16} color="#125ED0" />
						<Text style={appStyles.recordDetailSectionTitle}>
							IMAGENS ({details.imageSlots})
						</Text>
					</View>

					<View style={appStyles.recordDetailImageGrid}>
						{Array.from({ length: details.imageSlots }).map((_, index) => (
							<View
								key={`img-${index}`}
								style={appStyles.recordDetailImagePlaceholder}
							>
								<Ionicons name="camera-outline" size={26} color="#8FB0F4" />
							</View>
						))}
					</View>
				</View>

				<View style={appStyles.recordDetailCard}>
					<Text style={appStyles.recordDetailSectionTitle}>OBSERVACOES</Text>
					<Text style={appStyles.recordDetailObservationText}>
						{details.observations}
					</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default RecordDetailScreen
