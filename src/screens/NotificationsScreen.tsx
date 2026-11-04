import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { HeaderBackButton } from '../components/HeaderBackButton'
import { colors } from '../constants/theme'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type PreferenceId = 'newRecords' | 'mapUpdates' | 'monthlyReport' | 'systemAlerts'

const PREFERENCES: { id: PreferenceId; title: string; subtitle: string }[] = [
	{
		id: 'newRecords',
		title: 'Novos registros',
		subtitle: 'Receba notificações sobre novos avistamentos',
	},
	{
		id: 'mapUpdates',
		title: 'Atualizações de mapas',
		subtitle: 'Notifique quando houver mudanças nos mapas de calor',
	},
	{
		id: 'monthlyReport',
		title: 'Relatório mensal',
		subtitle: 'Resumo mensal de atividades e estatísticas',
	},
	{
		id: 'systemAlerts',
		title: 'Alertas do sistema',
		subtitle: 'Avisos importantes e atualizações do aplicativo',
	},
]

export function NotificationsScreen() {
	const navigation = useNavigation<NavigationProp>()
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
			<Header title="Notificações" leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView contentContainerStyle={appStyles.settingsContent}>
				<View style={appStyles.notificationsCard}>
					{PREFERENCES.map((item, index) => (
						<Pressable
							key={item.id}
							onPress={() => toggle(item.id)}
							accessibilityRole="switch"
							accessibilityLabel={item.title}
							accessibilityHint={item.subtitle}
							accessibilityState={{ checked: enabled[item.id] }}
							style={[
								appStyles.notificationsItem,
								index > 0 && appStyles.notificationsItemDivider,
							]}
						>
							<View style={appStyles.notificationsTextWrap}>
								<Text style={appStyles.notificationsItemTitle}>{item.title}</Text>
								<Text style={appStyles.notificationsItemSubtitle}>{item.subtitle}</Text>
							</View>
							{/* A linha inteira alterna (alvo de toque grande); o Switch é só o indicador. */}
							<Switch
								value={enabled[item.id]}
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
