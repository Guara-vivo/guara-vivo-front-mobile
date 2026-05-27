import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { MapZoneType } from '../types/api'
import { appStyles } from '../styles/appStyles'

interface MapZoneSelectionModalProps {
	visible: boolean
	onConfirm: (type: MapZoneType, radius_meters: number) => void
	onCancel: () => void
}

export const MapZoneSelectionModal: React.FC<MapZoneSelectionModalProps> = ({
	visible,
	onConfirm,
	onCancel,
}) => {
	const [zoneType, setZoneType] = useState<MapZoneType>('feeding')
	const [radius, setRadius] = useState(50)

	const handleConfirm = () => {
		onConfirm(zoneType, radius)
		// Reset state for next use
		setZoneType('feeding')
		setRadius(50)
	}

	const handleCancel = () => {
		// Reset state
		setZoneType('feeding')
		setRadius(50)
		onCancel()
	}

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={appStyles.zoneModalOverlay}>
				<View style={appStyles.zoneModalContent}>
					<Text style={appStyles.zoneModalTitle}>Adicionar Área</Text>

					<Text style={appStyles.zoneModalLabel}>Tipo</Text>
					<View style={appStyles.zoneTypeButtonContainer}>
						<TouchableOpacity
							style={[
								appStyles.zoneTypeButton,
								zoneType === 'feeding' && appStyles.zoneTypeButtonActive,
							]}
							onPress={() => setZoneType('feeding')}
						>
							<Text
								style={[
									appStyles.zoneTypeButtonText,
									zoneType === 'feeding' && appStyles.zoneTypeButtonTextActive,
								]}
							>
								Alimentação
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								appStyles.zoneTypeButton,
								zoneType === 'nest' && appStyles.zoneTypeButtonActive,
							]}
							onPress={() => setZoneType('nest')}
						>
							<Text
								style={[
									appStyles.zoneTypeButtonText,
									zoneType === 'nest' && appStyles.zoneTypeButtonTextActive,
								]}
							>
								Ninho
							</Text>
						</TouchableOpacity>
					</View>

					<Text style={appStyles.zoneModalLabel}>Raio: {radius}m</Text>
					<Slider
						style={appStyles.zoneSlider}
						minimumValue={10}
						maximumValue={5000}
						value={radius}
						onValueChange={setRadius}
						step={10}
					/>

					<View style={appStyles.zoneModalButtonContainer}>
						<TouchableOpacity
							style={appStyles.zoneModalCancelButton}
							onPress={handleCancel}
						>
							<Text style={appStyles.zoneModalCancelButtonText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={appStyles.zoneModalConfirmButton}
							onPress={handleConfirm}
						>
							<Text style={appStyles.zoneModalConfirmButtonText}>Confirmar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
