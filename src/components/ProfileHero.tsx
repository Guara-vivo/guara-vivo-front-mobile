import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function ProfileHero({
	onNavigate,
}: {
	onNavigate: (s: ScreenId) => void
}) {
	return (
		<View style={appStyles.profileHeroCard}>
			<View style={appStyles.profileAvatarCircle}>
				<Ionicons name="person-outline" size={58} color="#1F61C5" />
			</View>

			<Text style={appStyles.profileHeroName}>Joao da Silva Goulard</Text>
			<Text style={appStyles.profileHeroEmail}>joaosgoulard@email.com</Text>

			<Pressable
				onPress={() => onNavigate('edit-profile')}
				style={appStyles.profileEditButton}
			>
				<Text style={appStyles.profileEditButtonText}>EDITAR</Text>
			</Pressable>
		</View>
	)
}

export default ProfileHero
