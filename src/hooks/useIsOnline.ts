import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { isOnlineState } from '../utils/connectivity'

// Acompanha a conexão com a internet em tempo real (assume online até saber o contrário).
export function useIsOnline() {
	const [online, setOnline] = useState(true)

	useEffect(() => {
		return NetInfo.addEventListener((state) => {
			setOnline(isOnlineState(state))
		})
	}, [])

	return online
}
