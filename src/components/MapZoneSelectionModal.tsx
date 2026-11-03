import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type { MapZoneType } from '../types/api'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'

interface MapZoneSelectionModalProps {
	onConfirm: (type: MapZoneType, radius_meters: number) => void
	onCancel: () => void
	isSubmitting?: boolean
}

export const MapZoneSelectionModal: React.FC<MapZoneSelectionModalProps> = ({
	onConfirm,
	onCancel,
	isSubmitting = false,
}) => {
	const [zoneType, setZoneType] = useState<MapZoneType>('feeding')
	const [radius, setRadius] = useState(50)
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	useEffect(() => {
		bottomSheetRef.current?.present()
	}, [])

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
			snapPoints={['58%']}
			enableDynamicSizing={false}
			enablePanDownToClose={!isSubmitting}
			stackBehavior="push"
			onChange={(index) => {
				if (index === -1) {
					onCancel()
				}
			}}
			backdropComponent={renderBackdrop}
			backgroundStyle={appStyles.zoneBottomSheetBackground}
			handleIndicatorStyle={appStyles.zoneBottomSheetIndicator}
		>
			<BottomSheetView style={appStyles.zoneBottomSheetContent}>
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
							accessibilityLabel="Tipo de área"
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
					accessibilityLabel="Raio da área em metros"
					accessibilityValue={{ min: 10, max: 500, now: radius, text: `${radius} metros` }}
					disabled={isSubmitting}
				/>

				<View style={appStyles.zoneModalButtonContainer}>
					<TouchableOpacity
						style={[
							appStyles.zoneModalCancelButton,
							isSubmitting && appStyles.zoneModalDisabled,
						]}
						onPress={handleCancel}
						accessibilityRole="button"
						accessibilityLabel="Cancelar"
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
						accessibilityRole="button"
						accessibilityLabel="Confirmar área"
						accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator size="small" color={colors.onColor} />
						) : (
							<Text style={appStyles.zoneModalConfirmButtonText}>Confirmar</Text>
						)}
					</TouchableOpacity>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	)
}
