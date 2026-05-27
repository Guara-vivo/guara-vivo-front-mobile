import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'
import type { MapZoneType } from '../types/api'
import { appStyles } from '../styles/appStyles'

interface MapZoneSelectionModalProps {
	visible: boolean
	onConfirm: (type: MapZoneType, radius_meters: number) => void
	onCancel: () => void
	isSubmitting?: boolean
}

export const MapZoneSelectionModal: React.FC<MapZoneSelectionModalProps> = ({
	visible,
	onConfirm,
	onCancel,
	isSubmitting = false,
}) => {
	const [zoneType, setZoneType] = useState<MapZoneType>('feeding')
	const [radius, setRadius] = useState(50)

	const handleConfirm = () => {
		onConfirm(zoneType, radius)
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
				<View style={appStyles.zoneSelectContainer}>
					<View
						style={[
							appStyles.zonePickerContainer,
							isSubmitting && appStyles.zoneModalDisabled,
						]}
					>
						<Picker
							selectedValue={zoneType}
							onValueChange={(value) => setZoneType(value as MapZoneType)}
							enabled={!isSubmitting}
							style={appStyles.zonePicker}
						>
							<Picker.Item label="Alimentação" value="feeding" />
							<Picker.Item label="Ninho" value="nest" />
						</Picker>
					</View>
				</View>

				<Text style={appStyles.zoneModalLabel}>Raio: {radius}m</Text>
				<Slider
					style={[
						appStyles.zoneSlider,
						isSubmitting && appStyles.zoneModalDisabled,
					]}
					minimumValue={10}
					maximumValue={500}
					value={radius}
					onValueChange={setRadius}
					step={10}
					disabled={isSubmitting}
				/>

				<View style={appStyles.zoneModalButtonContainer}>
					<TouchableOpacity
						style={[
							appStyles.zoneModalCancelButton,
							isSubmitting && appStyles.zoneModalDisabled,
						]}
						onPress={handleCancel}
						disabled={isSubmitting}
					>
						<Text style={appStyles.zoneModalCancelButtonText}>Cancelar</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							appStyles.zoneModalConfirmButton,
							isSubmitting && appStyles.zoneModalConfirmButtonDisabled,
						]}
						onPress={handleConfirm}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<Text style={appStyles.zoneModalConfirmButtonText}>Confirmar</Text>
						)}
					</TouchableOpacity>
				</View>
				</View>
			</View>
		</Modal>
	)
}
