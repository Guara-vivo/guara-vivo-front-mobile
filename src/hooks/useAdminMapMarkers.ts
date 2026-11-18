import { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MapLayerId } from '../config/map'
import { useAdminRecords } from '../contexts/AdminRecordsContext'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'
import type { RootStackParamList } from '../types/navigation'
import type { RecordBalloonHandlers } from '../components/map/RecordBalloon'
import { filterRecordsByLayer, shouldShowRecordBalloon } from '../utils/adminMapRecords'

// Marcadores do mapa para o admin: todos os registros de todos os usuários (a camada filtra).
// Para as demais contas fica desligado e o mapa segue como sempre foi.
export function useAdminMapMarkers(selectedLayer: MapLayerId) {
	const admin = useAdminRecords()
	const zoneDetail = useMapZoneDetail()
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	const { isAdmin, records } = admin
	const { selectedZone, zoneRecords } = zoneDetail

	const markers = useMemo(
		() => (isAdmin ? filterRecordsByLayer(records, selectedLayer) : undefined),
		[isAdmin, records, selectedLayer],
	)

	// Tocar no marcador abre o balão, e tocar no balão abre o detalhe. Com a folha de uma zona aberta
	// e o registro na lista dela, o mapa mantém o comportamento de sempre (destacar e rolar).
	const recordBalloon = useMemo<RecordBalloonHandlers>(
		() => ({
			shouldShow: (recordId) => shouldShowRecordBalloon(recordId, selectedZone, zoneRecords),
			onPress: (recordId) => navigation.navigate('RecordDetail', { recordId }),
		}),
		[navigation, selectedZone, zoneRecords],
	)

	return {
		isAdmin,
		viewerId: admin.viewerId,
		markers,
		error: admin.error,
		reload: admin.reload,
		refreshIfStale: admin.refreshIfStale,
		recordBalloon,
	}
}
