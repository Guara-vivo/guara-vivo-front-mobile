import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import type { ScreenId } from '../types/navigation'

export function EditProfileScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [name, setName] = useState('Joao da Silva Goulard')
	const [email, setEmail] = useState('joaosgoulard@email.com')

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

				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>NOME</Text>
					<TextInput
						value={name}
						onChangeText={setName}
						placeholder="Nome completo"
						placeholderTextColor="#8F9098"
						style={appStyles.changePasswordInput}
					/>

					<Text style={appStyles.changePasswordLabel}>E-MAIL</Text>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="E-mail"
						placeholderTextColor="#8F9098"
						keyboardType="email-address"
						style={appStyles.changePasswordInput}
					/>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordPrimaryAction}
						>
							<Text style={appStyles.changePasswordPrimaryActionText}>
								SALVAR
							</Text>
						</Pressable>

						<Pressable
							onPress={() => onNavigate('profile')}
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								CANCELAR
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default EditProfileScreen
