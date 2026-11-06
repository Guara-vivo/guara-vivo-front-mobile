import React from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'
import type { ReactNativeFile } from '../../types/api'
import { colors } from '../../constants/theme'

type Props = {
	images: ReactNativeFile[]
	isPicking: boolean
	isPressed: boolean
	disabled: boolean
	onPick: () => void
	onRemove: (imageUri: string) => void
}

export function RegisterImagePicker({
	images,
	isPicking,
	isPressed,
	disabled,
	onPick,
	onRemove,
}: Props) {
	return (
		<>
			<Pressable
				onPress={onPick}
				accessibilityRole="button"
				accessibilityLabel="Adicionar fotos"
				accessibilityState={{ busy: isPicking, disabled: disabled || isPicking }}
				disabled={disabled || isPicking}
				style={[
					appStyles.registerDropZone,
					isPressed && appStyles.registerDropZonePressed,
				]}
			>
				<View style={appStyles.registerDropZoneIconWrap}>
					{isPicking ? (
						<ActivityIndicator size="large" color={colors.secondary} />
					) : (
						<Ionicons name="camera-outline" size={28} color={colors.secondary} />
					)}
				</View>
				<Text style={appStyles.registerDropZoneTitle}>
					{isPicking ? 'Preparando imagens...' : 'Toque para adicionar fotos'}
				</Text>
				{isPicking ? null : (
					<Text style={appStyles.registerDropZoneHint}>Você pode escolher mais de uma</Text>
				)}
			</Pressable>

			{images.length > 0 ? (
				<View style={appStyles.registerImagePreviewGrid}>
					{images.map((image) => (
						<View key={image.uri} style={appStyles.registerImagePreviewWrap}>
							<Image
								source={{ uri: image.uri }}
								accessibilityLabel={`Foto ${images.indexOf(image) + 1} de ${images.length}`}
								style={appStyles.registerImagePreview}
								contentFit="cover"
							/>
							<Pressable
								onPress={() => onRemove(image.uri)}
								disabled={disabled}
								hitSlop={8}
								accessibilityRole="button"
								accessibilityLabel="Remover imagem"
								style={({ pressed }) => [
									appStyles.registerImageRemoveButton,
									pressed && appStyles.registerImageRemoveButtonPressed,
								]}
							>
								<Ionicons name="close" size={14} color={colors.onColor} />
							</Pressable>
						</View>
					))}
				</View>
			) : null}
		</>
	)
}
