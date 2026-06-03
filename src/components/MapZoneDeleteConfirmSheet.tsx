import React, { useCallback, useEffect, useRef } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { appStyles } from '../styles/appStyles'

interface MapZoneDeleteConfirmSheetProps {
	visible: boolean
	onConfirm: () => void
	onCancel: () => void
	isDeleting: boolean
}

export function MapZoneDeleteConfirmSheet({
	visible,
	onConfirm,
	onCancel,
	isDeleting,
}: MapZoneDeleteConfirmSheetProps) {
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	useEffect(() => {
		if (visible) {
			bottomSheetRef.current?.present()
		} else {
			bottomSheetRef.current?.dismiss()
		}
	}, [visible])

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				pressBehavior={isDeleting ? 'none' : 'close'}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[isDeleting],
	)

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={['30%']}
			enableDynamicSizing={false}
			stackBehavior="push"
			backdropComponent={renderBackdrop}
			onChange={(index) => {
				if (index === -1) {
					onCancel()
				}
			}}
		>
			<BottomSheetView style={{ flex: 1, alignItems: 'center', padding: 24 }}>
				<Text style={appStyles.zoneModalTitle}>Excluir área?</Text>
				<Text style={appStyles.zoneDeleteConfirmText}>
					Essa ação não pode ser desfeita.
				</Text>
				<View style={appStyles.zoneModalButtonContainer}>
					<Pressable
						style={[
							appStyles.zoneDeleteConfirmCancelButton,
							isDeleting && appStyles.zoneModalDisabled,
						]}
						onPress={onCancel}
						disabled={isDeleting}
					>
						<Text style={appStyles.zoneModalCancelButtonText}>Cancelar</Text>
					</Pressable>
					<Pressable
						style={[
							appStyles.zoneDeleteConfirmButton,
							isDeleting && appStyles.zoneModalConfirmButtonDisabled,
						]}
						onPress={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<Text style={appStyles.zoneDeleteConfirmButtonText}>Excluir</Text>
						)}
					</Pressable>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	)
}
