import React from 'react'
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'
import type { MapZoneRead } from '../types/api'
import { appStyles } from '../styles/appStyles'

type MapZoneDetailModalProps = {
	zone: MapZoneRead | null
	visible: boolean
	isDeleting: boolean
	onClose: () => void
	onDelete: () => void
}

function formatZoneType(type: MapZoneRead['type']) {
	return type === 'feeding' ? 'Alimentação' : 'Ninho'
}

function formatZoneDate(value: string) {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return value
	}

	return date.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

export function MapZoneDetailModal({
	zone,
	visible,
	isDeleting,
	onClose,
	onDelete,
}: MapZoneDetailModalProps) {
	if (!zone) {
		return null
	}

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={appStyles.zoneModalOverlay}>
				<View style={appStyles.zoneModalContent}>
					<Text style={appStyles.zoneModalTitle}>Detalhes da Área</Text>

					<View style={appStyles.zoneDetailInfoList}>
						<View style={appStyles.zoneDetailInfoRow}>
							<Text style={appStyles.zoneDetailInfoLabel}>Tipo</Text>
							<Text style={appStyles.zoneDetailInfoValue}>{formatZoneType(zone.type)}</Text>
						</View>
						<View style={appStyles.zoneDetailInfoRow}>
							<Text style={appStyles.zoneDetailInfoLabel}>Raio</Text>
							<Text style={appStyles.zoneDetailInfoValue}>{zone.radius_meters} m</Text>
						</View>
						<View style={appStyles.zoneDetailInfoRow}>
							<Text style={appStyles.zoneDetailInfoLabel}>Criada em</Text>
							<Text style={appStyles.zoneDetailInfoValue}>{formatZoneDate(zone.created_at)}</Text>
						</View>
						<View style={appStyles.zoneDetailInfoRow}>
							<Text style={appStyles.zoneDetailInfoLabel}>Coordenadas</Text>
							<Text style={appStyles.zoneDetailInfoValue}>
								{zone.latitude.toFixed(5)}, {zone.longitude.toFixed(5)}
							</Text>
						</View>
					</View>

					<View style={appStyles.zoneModalButtonContainer}>
						<TouchableOpacity
							style={[
								appStyles.zoneModalCancelButton,
								isDeleting && appStyles.zoneModalDisabled,
							]}
							onPress={onClose}
							disabled={isDeleting}
						>
							<Text style={appStyles.zoneModalCancelButtonText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								appStyles.zoneDetailDeleteButton,
								isDeleting && appStyles.zoneModalConfirmButtonDisabled,
							]}
							onPress={onDelete}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<ActivityIndicator size="small" color="#FFFFFF" />
							) : (
								<Text style={appStyles.zoneDetailDeleteButtonText}>Excluir Área</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default MapZoneDetailModal
