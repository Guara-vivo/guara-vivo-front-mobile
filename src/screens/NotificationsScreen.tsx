import React, { useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export function NotificationsScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [newRecords, setNewRecords] = useState(true)
	const [mapUpdates, setMapUpdates] = useState(false)
	const [monthlyReport, setMonthlyReport] = useState(true)
	const [systemAlerts, setSystemAlerts] = useState(true)

	return (
    <View style={appStyles.profileScreen}>
				<Header
						title="Notificações"
					leftIcon={
						<Pressable
							onPress={() => navigation.goBack()}
							hitSlop={8}
							style={appStyles.headerActionButton}
						>
							<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
						</Pressable>
					}
				/>


			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>

				<View style={appStyles.notificationsCard}>
					<View style={appStyles.notificationsTitleRow}>
						<Ionicons name="notifications-outline" size={17} color="#125ED0" />
						<Text style={appStyles.notificationsTitle}>
							PREFERÊNCIAS DE NOTIFICAÇÃO
						</Text>
					</View>

					<View style={appStyles.notificationsItem}>
						<View style={appStyles.notificationsTextWrap}>
							<Text style={appStyles.notificationsItemTitle}>
								Novos Registros
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Receba notificações sobre novos avistamentos
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
								Atualizações de Mapas
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Notifique quando houver mudanças nos mapas de calor
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
								Relatório Mensal
							</Text>
							<Text style={appStyles.notificationsItemSubtitle}>
								Resumo mensal de atividades e estatísticas
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
								Avisos importantes e atualizações do aplicativo
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
