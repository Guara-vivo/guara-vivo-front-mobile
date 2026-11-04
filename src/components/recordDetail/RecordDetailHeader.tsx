import React from 'react'
import { Header } from '../Header'
import { HeaderBackButton } from '../HeaderBackButton'

export function RecordDetailHeader({ onBack }: { onBack: () => void }) {
	return (
		<Header
			title="Detalhes do registro"
			leftIcon={<HeaderBackButton onPress={onBack} />}
		/>
	)
}
