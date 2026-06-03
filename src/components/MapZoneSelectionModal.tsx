import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type { MapZoneType } from '../types/api'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'

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
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	useEffect(() => {
		if (visible) {
			bottomSheetRef.current?.present()
		} else {
			bottomSheetRef.current?.dismiss()
		}
	}, [visible])

	const handleConfirm = () => {
		onConfirm(zoneType, radius)
	}

	const handleCancel = () => {
		setZoneType('feeding')
		setRadius(50)
		onCancel()
	}

	const renderBackdrop = React.useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
				pressBehavior={isSubmitting ? 'none' : 'close'}
			/>
		),
		[isSubmitting],
	)

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={['50%']}
			enableDynamicSizing={false}
			enablePanDownToClose={!isSubmitting}
			onChange={(index) => {
				if (index === -1 && visible) {
					onCancel()
				}
			}}
			backdropComponent={renderBackdrop}
			backgroundStyle={appStyles.zoneModalContent}
			handleIndicatorStyle={{ backgroundColor: colors.border }}
		>
			<BottomSheetView style={[appStyles.zoneModalContent, { width: '100%', maxWidth: '100%', marginHorizontal: 0 }]}>
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
			</BottomSheetView>
		</BottomSheetModal>
	)
}
