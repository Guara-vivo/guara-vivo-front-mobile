import React, { useCallback, useEffect, useRef } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'

interface MapZoneDeleteConfirmSheetProps {
	onConfirm: () => void
	onCancel: () => void
	isDeleting: boolean
}

export function MapZoneDeleteConfirmSheet({
	onConfirm,
	onCancel,
	isDeleting,
}: MapZoneDeleteConfirmSheetProps) {
	const bottomSheetRef = useRef<BottomSheetModal>(null)

	useEffect(() => {
		bottomSheetRef.current?.present()
	}, [])

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
			<BottomSheetView style={appStyles.zoneDeleteSheetContent}>
				<View style={appStyles.zoneDeleteIconWrap}>
					<Ionicons name="trash-outline" size={26} color={colors.dangerText} />
				</View>
				<Text accessibilityRole="header" style={appStyles.zoneModalTitle}>
					Excluir esta área?
				</Text>
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
						accessibilityRole="button"
						accessibilityLabel="Cancelar"
						disabled={isDeleting}
					>
						<Text style={appStyles.zoneDeleteCancelText}>Cancelar</Text>
					</Pressable>
					<Pressable
						style={[
							appStyles.zoneDeleteConfirmButton,
							isDeleting && appStyles.zoneModalConfirmButtonDisabled,
						]}
						onPress={onConfirm}
						accessibilityRole="button"
						accessibilityLabel="Excluir área"
						accessibilityState={{ busy: isDeleting, disabled: isDeleting }}
						disabled={isDeleting}
					>
						{isDeleting ? (
							<ActivityIndicator size="small" color={colors.onColor} />
						) : (
							<Text style={appStyles.zoneDeleteConfirmButtonText}>Excluir</Text>
						)}
					</Pressable>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	)
}
