import React from 'react'
import { View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import { HeaderBackButton } from '../HeaderBackButton'
import { Skeleton } from '../Skeleton'

// Esqueleto da tela de detalhe: foto no topo (com o botão voltar), título, chips e dois cartões.
export function RecordDetailSkeleton({ onBack }: { onBack: () => void }) {
	return (
		<View
			style={appStyles.recordDetailScreen}
			accessibilityLabel="Carregando registro"
			accessibilityLiveRegion="polite"
		>
			<View style={appStyles.recordDetailContent}>
				<View style={appStyles.recordDetailHero}>
					<Skeleton width="100%" height="100%" radius={0} />
					<View style={appStyles.recordDetailHeroBack}>
						<HeaderBackButton onPress={onBack} />
					</View>
				</View>
				<View style={appStyles.recordDetailTitleBlock}>
					<Skeleton width={160} height={38} />
					<View style={appStyles.recordDetailChipRow}>
						<Skeleton width={90} height={28} radius={999} />
						<Skeleton width={70} height={28} radius={999} />
					</View>
					<Skeleton width="70%" height={16} />
				</View>
				<View style={[appStyles.recordDetailCard, appStyles.recordDetailSkeletonBlock]}>
					<Skeleton width="100%" height={72} radius={12} />
				</View>
				<View style={[appStyles.recordDetailCard, appStyles.recordDetailSkeletonBlock]}>
					<Skeleton width="100%" height={72} radius={12} />
				</View>
			</View>
		</View>
	)
}
