import React, { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BehaviorsCard } from '../components/recordDetail/BehaviorsCard'
import { ImageCarouselCard } from '../components/recordDetail/ImageCarouselCard'
import { RecordDetailHeader } from '../components/recordDetail/RecordDetailHeader'
import { RecordDetailMessage } from '../components/recordDetail/RecordDetailMessage'
import { RecordInfoCard } from '../components/recordDetail/RecordInfoCard'
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

	const { record, isLoading, isRefreshing, handleRefresh } =
		useRecordDetail(recordId)
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
	const goBack = () => navigation.goBack()

	if (isLoading) {
		return (
			<RecordDetailMessage onBack={goBack} message="Carregando registro..." loading />
		)
	}

	if (!record) {
		return <RecordDetailMessage onBack={goBack} message="Registro não encontrado." />
	}

	const imageUris = record.images ?? []

	return (
		<View style={appStyles.recordDetailScreen}>
			<RecordDetailHeader onBack={goBack} />

			<View style={appStyles.screen}>
				<ScrollView
					style={appStyles.screen}
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
					/>
					<RecordInfoCard record={record} />
					<BehaviorsCard flockSize={record.flock_size} />
				</ScrollView>
			</View>

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
