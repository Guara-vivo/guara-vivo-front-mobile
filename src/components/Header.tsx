import React from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../styles/appStyles'

interface HeaderProps {
	title: string
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

export function Header({ title, leftIcon, rightIcon }: HeaderProps) {
	return (
		<View style={appStyles.header}>
			{leftIcon && <View style={appStyles.headerLeft}>{leftIcon}</View>}
			<Text numberOfLines={1} style={appStyles.appHeaderTitle}>
				{title}
			</Text>
			{rightIcon && <View style={appStyles.headerRight}>{rightIcon}</View>}
		</View>
	)
}

export default Header
