import React, { useEffect, useState } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { Image, type ImageContentFit, type ImageLoadEventData } from 'expo-image'
import { Skeleton } from './Skeleton'

type Props = {
	uri: string
	// Tamanho e forma da foto (largura, altura, borda arredondada).
	style: StyleProp<ViewStyle>
	contentFit?: ImageContentFit
	transition?: number
	onLoad?: (event: ImageLoadEventData) => void
	accessibilityLabel?: string
	// false: ao trocar a foto, mantém a anterior na tela até a nova carregar (sem esqueleto nem
	// tela vazia entre as duas). Use em carrossel de uma foto só; listas devem reciclar (padrão).
	recycle?: boolean
}

// Foto com esqueleto pulsando até carregar (em vez de um quadrado cinza parado).
export function SkeletonImage({
	uri,
	style,
	contentFit = 'cover',
	transition = 150,
	onLoad,
	accessibilityLabel,
	recycle = true,
}: Props) {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		if (recycle) setLoaded(false)
	}, [uri, recycle])

	return (
		<View style={[style, styles.container]}>
			<Image
				source={{ uri }}
				style={StyleSheet.absoluteFill}
				contentFit={contentFit}
				cachePolicy="memory-disk"
				recyclingKey={recycle ? uri : undefined}
				transition={transition}
				accessibilityLabel={accessibilityLabel}
				onLoad={(event) => {
					setLoaded(true)
					onLoad?.(event)
				}}
				onError={() => setLoaded(true)}
			/>
			{loaded ? null : (
				<View style={StyleSheet.absoluteFill} pointerEvents="none">
					<Skeleton width="100%" height="100%" radius={0} />
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { overflow: 'hidden' },
})

export default SkeletonImage
