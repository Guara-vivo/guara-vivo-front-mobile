import React, { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AiAnalysisCard } from '../components/recordDetail/AiAnalysisCard'
import { ImageCarouselCard } from '../components/recordDetail/ImageCarouselCard'
import { RecordDetailMessage } from '../components/recordDetail/RecordDetailMessage'
import { RecordDetailSkeleton } from '../components/recordDetail/RecordDetailSkeleton'
import { RecordInfoCard } from '../components/recordDetail/RecordInfoCard'
import { RecordLocationCard } from '../components/recordDetail/RecordLocationCard'
import RecordImageDetailModal from '../components/RecordImageDetailModal'
import { colors } from '../constants/theme'
import { useRecordDetail } from '../hooks/useRecordDetail'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export function RecordDetailScreen() {
	const navigation = useNavigation<NavigationProp>()
	const route = useRoute<RouteProp<RootStackParamList, 'RecordDetail'>>()
	const recordId = route.params?.recordId

	const { record, isLoading, isRefreshing, isFetchingDetail, loadError, retry, handleRefresh } =
		useRecordDetail(recordId)
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
	const goBack = () => navigation.goBack()

	if (isLoading) {
		return <RecordDetailSkeleton onBack={goBack} />
	}

	if (!record && loadError) {
		return <RecordDetailMessage onBack={goBack} message={loadError} onRetry={retry} />
	}

	if (!record) {
		return <RecordDetailMessage onBack={goBack} message="Registro não encontrado." />
	}

	const imageUris = record.images ?? []
	// O resumo (sem análises) aparece primeiro; até chegar o detalhe, mostra esqueleto em vez de "sem análise".
	const detailPending = isFetchingDetail && record.image_analyses === undefined

	return (
		<View style={appStyles.recordDetailScreen}>
			<ScrollView
				contentContainerStyle={appStyles.recordDetailContent}
				alwaysBounceVertical
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			>
				<ImageCarouselCard
					imageUris={imageUris}
					onImagePress={setSelectedImageIndex}
					onBack={goBack}
				/>
				<RecordInfoCard record={record} loading={detailPending} />
				<AiAnalysisCard
					record={record}
					onOpen={() => setSelectedImageIndex(0)}
					loading={detailPending}
				/>
				<RecordLocationCard record={record} />
			</ScrollView>

			{selectedImageIndex !== null && (
				<RecordImageDetailModal
					visible={true}
					imageIndex={selectedImageIndex}
					imageUri={imageUris[selectedImageIndex] ?? ''}
					totalImages={imageUris.length}
					onClose={() => setSelectedImageIndex(null)}
					onImageChange={setSelectedImageIndex}
					record={record}
				/>
			)}
		</View>
	)
}

export default RecordDetailScreen
