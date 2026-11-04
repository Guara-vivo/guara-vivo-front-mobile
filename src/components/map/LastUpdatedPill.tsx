import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import { formatLastUpdatedAt } from '../../utils/timeFormatters'

const TICK_MS = 60000

// Selo "Atualizado há X min". Guarda o relógio aqui dentro para que o passar do tempo
// re-renderize só o selo, e não a tela de mapas inteira.
function LastUpdatedPillBase({ lastUpdatedAt }: { lastUpdatedAt: Date | null }) {
	const [now, setNow] = useState(() => new Date())

	useEffect(() => {
		setNow(new Date())
		const interval = setInterval(() => setNow(new Date()), TICK_MS)
		return () => clearInterval(interval)
	}, [lastUpdatedAt])

	return (
		<View style={appStyles.mapReloadTextPill}>
			<Text style={appStyles.mapReloadText}>{formatLastUpdatedAt(lastUpdatedAt, now)}</Text>
		</View>
	)
}

export const LastUpdatedPill = React.memo(LastUpdatedPillBase)
