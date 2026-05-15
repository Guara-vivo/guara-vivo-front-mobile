import React, { useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function NotificationsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [newRecords, setNewRecords] = useState(true)
	const [mapUpdates, setMapUpdates] = useState(false)
	const [monthlyReport, setMonthlyReport] = useState(true)
	const [systemAlerts, setSystemAlerts] = useState(true)

	return (
		<View style={appStyles.profileScreen}>
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				<Pressable
					onPress={() => onNavigate('profile')}
					style={appStyles.pageBackButton}
				>
					<Ionicons name="chevron-back" size={28} color="#125ED0" />
				</Pressable>

				<View style={appStyles.notificationsCard}>
					<View style={appStyles.notificationsTitleRow}>
						<Ionicons name="notifications-outline" size={17} color="#125ED0" />
						<Text style={appStyles.notificationsTitle}>
							PREFERENCIAS DE NOTIFICACAO
						</Text>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Novos Registros
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Receba notificacoes sobre novos avistamentos
							</Text>
						</View>
						<Switch
							value={newRecords}
							onValueChange={setNewRecords}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Atualizacoes de Mapas
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Notifique quando houver mudancas nos mapas de calor
							</Text>
						</View>
						<Switch
							value={mapUpdates}
							onValueChange={setMapUpdates}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Relatorio Mensal
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Resumo mensal de atividades e estatisticas
							</Text>
						</View>
						<Switch
							value={monthlyReport}
							onValueChange={setMonthlyReport}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Alertas do Sistema
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Avisos importantes e atualizacoes do aplicativo
							</Text>
						</View>
						<Switch
							value={systemAlerts}
							onValueChange={setSystemAlerts}
							trackColor={{ false: '#C9CED8', true: '#125ED0' }}
							thumbColor="#F2F2F2"
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default NotificationsScreen
