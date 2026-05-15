import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActionButton } from '../components/common'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

const homeLogo = require('../assets/images/Logo Simplificada Fonte Escura.png')

export function HomeScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	return (
		<ScrollView
			contentContainerStyle={appStyles.homeContent}
			style={appStyles.homeScreen}
		>
			<View style={appStyles.homeHeader}>
				<Image
					source={homeLogo}
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
				onPress={() => onNavigate('register')}
				containerStyle={appStyles.homePrimaryButton}
				textStyle={appStyles.homePrimaryButtonLabel}
				leftIcon={
					<Ionicons name="location-outline" size={26} color="#F1F1F1" />
				}
				rightIcon={<Ionicons name="arrow-forward" size={24} color="#F1F1F1" />}
			/>

			<View style={appStyles.homeShortcutRow}>
				<Pressable
					onPress={() => onNavigate('maps')}
					style={appStyles.homeShortcutCard}
				>
					<View style={appStyles.homeShortcutIconBox}>
						<Ionicons name="map-outline" size={30} color="#125ED0" />
					</View>
					<Text style={appStyles.homeShortcutLabel}>VER MAPAS</Text>
				</Pressable>

				<Pressable
					onPress={() => onNavigate('history')}
					style={appStyles.homeShortcutCard}
				>
					<View style={appStyles.homeShortcutIconBox}>
						<Ionicons name="list-outline" size={30} color="#125ED0" />
					</View>
					<Text style={appStyles.homeShortcutLabel}>HISTÓRICO</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}

export default HomeScreen
