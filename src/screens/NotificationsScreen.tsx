import React, { useCallback, useState } from 'react'
import { ScrollView, Switch, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
		title: 'Novos Registros',
		subtitle: 'Receba notificações sobre novos avistamentos',
	},
	{
		id: 'mapUpdates',
		title: 'Atualizações de Mapas',
		subtitle: 'Notifique quando houver mudanças nos mapas de calor',
	},
	{
		id: 'monthlyReport',
		title: 'Relatório Mensal',
		subtitle: 'Resumo mensal de atividades e estatísticas',
	},
	{
		id: 'systemAlerts',
		title: 'Alertas do Sistema',
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

	const goBack = useCallback(() => navigation.goBack(), [navigation])

	return (
		<View style={appStyles.profileScreen}>
			<Header title="Notificações" leftIcon={<HeaderBackButton onPress={goBack} />} />

			<ScrollView contentContainerStyle={appStyles.profileContent} style={appStyles.screen}>
				<View style={appStyles.notificationsCard}>
					<View style={appStyles.notificationsTitleRow}>
						<Ionicons name="notifications-outline" size={17} color={colors.secondary} />
						<Text accessibilityRole="header" style={appStyles.notificationsTitle}>
							PREFERÊNCIAS DE NOTIFICAÇÃO
						</Text>
					</View>

					{PREFERENCES.map((item) => (
						<View key={item.id} style={appStyles.notificationsItem}>
							<View style={appStyles.notificationsTextWrap}>
								<Text style={appStyles.notificationsItemTitle}>{item.title}</Text>
								<Text style={appStyles.notificationsItemSubtitle}>{item.subtitle}</Text>
							</View>
							<Switch
								value={enabled[item.id]}
								onValueChange={(value) =>
									setEnabled((current) => ({ ...current, [item.id]: value }))
								}
								accessibilityLabel={item.title}
								trackColor={{ false: colors.switchTrackOff, true: colors.secondary }}
								thumbColor={colors.switchThumb}
							/>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	)
}

export default NotificationsScreen
