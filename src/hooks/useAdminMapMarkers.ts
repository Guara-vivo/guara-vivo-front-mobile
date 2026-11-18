import { useCallback, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MapLayerId } from '../config/map'
import { useAdminRecords } from '../contexts/AdminRecordsContext'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'
import type { RootStackParamList } from '../types/navigation'
import { filterRecordsByLayer } from '../utils/adminMapRecords'

// Marcadores do mapa para o admin: todos os registros de todos os usuários (a camada filtra).
// Para as demais contas fica desligado e o mapa segue como sempre foi.
export function useAdminMapMarkers(selectedLayer: MapLayerId) {
	const admin = useAdminRecords()
	const zoneDetail = useMapZoneDetail()
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	const { isAdmin, records } = admin
	const { selectedZone, zoneRecords, onRecordMarkerPress } = zoneDetail

	const markers = useMemo(
		() => (isAdmin ? filterRecordsByLayer(records, selectedLayer) : undefined),
		[isAdmin, records, selectedLayer],
	)

	// Com a folha de uma zona aberta e o registro na lista dela, mantém o comportamento de sempre
	// (destacar e rolar até o registro); fora disso, abre o detalhe direto.
	const handleMarkerPress = useCallback(
		(recordId: number) => {
			const inOpenZone = selectedZone !== null && zoneRecords.some((record) => record.id === recordId)

			if (inOpenZone) {
				onRecordMarkerPress(recordId)
				return
			}

			navigation.navigate('RecordDetail', { recordId })
		},
		[navigation, onRecordMarkerPress, selectedZone, zoneRecords],
	)

	return {
		isAdmin,
		viewerId: admin.viewerId,
		markers,
		error: admin.error,
		reload: admin.reload,
		refreshIfStale: admin.refreshIfStale,
		handleMarkerPress,
	}
}
