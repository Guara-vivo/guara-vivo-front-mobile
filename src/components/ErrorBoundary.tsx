import i18n from '../i18n'
import React from 'react'
import { View, Text } from 'react-native'
import type { ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
	state = { hasError: false }

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (__DEV__) {
			console.error('Error caught by boundary:', error)
			console.error('Error stack:', errorInfo.componentStack)
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<View style={{ padding: 20 }}>
					<Text style={{ fontSize: 16 }}>{i18n.t('common:unexpectedError')}</Text>
				</View>
			)
		}

		return this.props.children
	}
}
