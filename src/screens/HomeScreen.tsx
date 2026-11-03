import React from 'react'
import { ScrollView, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { MainTabParamList } from '../types/navigation'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { colors } from '../constants/theme'

type NavigationProp = BottomTabNavigationProp<MainTabParamList>

const homeLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function HomeScreen() {
	const navigation = useNavigation<NavigationProp>()

	return (
		<View style={appStyles.homeScreen}>
			<ScrollView
				contentContainerStyle={appStyles.homeContent}
			>
				<View style={appStyles.homeHeader}>
					<Image
						source={homeLogo}
						accessibilityLabel="Guará Vivo"
						style={appStyles.homeLogo}
						resizeMode="contain"
					/>
					<Text style={appStyles.homeKicker}>SISTEMA DE MONITORAMENTO</Text>
					<Text style={appStyles.homeSubtitle}>
						Auxílio ao monitoramento e proteção do Guará na ARIE
					</Text>
				</View>

				<ActionButton
					title="NOVO REGISTRO"
					onPress={() => navigation.navigate('Register')}
					containerStyle={appStyles.homePrimaryButton}
					textStyle={appStyles.homePrimaryButtonLabel}
					leftIcon={
						<Ionicons name="location-outline" size={26} color={colors.background} />
					}
					rightIcon={<Ionicons name="arrow-forward" size={24} color={colors.background} />}
				/>

				<View style={appStyles.homeShortcutRow}>
					<Pressable
						onPress={() => navigation.navigate('Maps')}
							accessibilityRole="button"
							accessibilityLabel="Ver mapas"
						style={appStyles.homeShortcutCard}
					>
						<View style={appStyles.homeShortcutIconBox}>
							<Ionicons name="map-outline" size={30} color={colors.secondary} />
						</View>
						<Text style={appStyles.homeShortcutLabel}>VER MAPAS</Text>
					</Pressable>

					<Pressable
						onPress={() => navigation.navigate('History')}
							accessibilityRole="button"
							accessibilityLabel="Histórico de registros"
						style={appStyles.homeShortcutCard}
					>
						<View style={appStyles.homeShortcutIconBox}>
							<Ionicons name="list-outline" size={30} color={colors.secondary} />
						</View>
						<Text style={appStyles.homeShortcutLabel}>HISTÓRICO</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	)
}

export default HomeScreen
