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

	componentDidCatch(error: Error, errorInfo: any) {
		console.error('Error caught by boundary:', error)
	}

	render() {
		if (this.state.hasError) {
			return (
				<View style={{ padding: 20 }}>
					<Text style={{ fontSize: 16 }}>Erro inesperado</Text>
				</View>
			)
		}

		return this.props.children
	}
}
