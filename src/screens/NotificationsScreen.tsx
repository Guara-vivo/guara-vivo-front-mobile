import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { colors } from '../constants/theme'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type PreferenceId = 'newRecords' | 'mapUpdates' | 'monthlyReport' | 'systemAlerts'

// Os textos de cada preferência ficam em `profile:notificationsScreen.<id>`.
const PREFERENCES: PreferenceId[] = ['newRecords', 'mapUpdates', 'monthlyReport', 'systemAlerts']

export function NotificationsScreen() {
	const navigation = useNavigation<NavigationProp>()
	const { t } = useTranslation('profile')
	const [enabled, setEnabled] = useState<Record<PreferenceId, boolean>>({
		newRecords: true,
		mapUpdates: false,
		monthlyReport: true,
		systemAlerts: true,
	})

	const toggle = useCallback(
		(id: PreferenceId) => setEnabled((current) => ({ ...current, [id]: !current[id] })),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [navigation])

	return (
		<View style={appStyles.profileScreen}>
			<Header title={t('notificationsScreen.title')} leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView contentContainerStyle={appStyles.settingsContent}>
				<View style={appStyles.notificationsCard}>
					{PREFERENCES.map((id, index) => (
						<Pressable
							key={id}
							onPress={() => toggle(id)}
							accessibilityRole="switch"
							accessibilityLabel={t(`notificationsScreen.${id}.title`)}
							accessibilityHint={t(`notificationsScreen.${id}.subtitle`)}
							accessibilityState={{ checked: enabled[id] }}
							style={[
								appStyles.notificationsItem,
								index > 0 && appStyles.notificationsItemDivider,
							]}
						>
							<View style={appStyles.notificationsTextWrap}>
								<Text style={appStyles.notificationsItemTitle}>{t(`notificationsScreen.${id}.title`)}</Text>
								<Text style={appStyles.notificationsItemSubtitle}>{t(`notificationsScreen.${id}.subtitle`)}</Text>
							</View>
							{/* A linha inteira alterna (alvo de toque grande); o Switch é só o indicador. */}
							<Switch
								value={enabled[id]}
								pointerEvents="none"
								importantForAccessibility="no-hide-descendants"
								accessibilityElementsHidden
								trackColor={{ false: colors.switchTrackOff, true: colors.secondary }}
								thumbColor={colors.switchThumb}
							/>
						</Pressable>
					))}
				</View>
			</ScrollView>
		</View>
	)
}

export default NotificationsScreen
