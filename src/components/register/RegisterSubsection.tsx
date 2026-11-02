import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../../styles/appStyles'

type Props = {
	icon: keyof typeof Ionicons.glyphMap
	title: string
	children: React.ReactNode
}

// Bloco do formulario de registro: titulo com icone e o conteudo logo abaixo.
export function RegisterSubsection({ icon, title, children }: Props) {
	return (
		<View style={appStyles.registerSubsection}>
			<View style={appStyles.registerSubTitleRow}>
				<Ionicons name={icon} size={18} color="#F2201F" />
				<Text style={appStyles.registerSubTitleText}>{title}</Text>
			</View>

			{children}
		</View>
	)
}
