import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '../Header'
import { HeaderBackButton } from '../HeaderBackButton'

export function RecordDetailHeader({ onBack }: { onBack: () => void }) {
	const { t } = useTranslation('detail')
	return (
		<Header
			title={t('title')}
			leftIcon={<HeaderBackButton onPress={onBack} />}
		/>
	)
}
