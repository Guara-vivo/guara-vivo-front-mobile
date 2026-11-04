import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { HeaderBackButton } from '../HeaderBackButton'
import { appStyles } from '../../styles/appStyles'

type Props = {
	title: string
	subtitle?: string
	onBack: () => void
	// Passo atual do cadastro (ex.: 2 de 2): mostra o texto e a barra de progresso.
	step?: { current: number; total: number }
	children: React.ReactNode
	// Botões fixos no rodapé, acima do teclado.
	footer: React.ReactNode
}

// Moldura comum do login e do cadastro: voltar, título grande, corpo rolável e rodapé fixo.
export function AuthFrame({ title, subtitle, onBack, step, children, footer }: Props) {
	return (
		<View style={appStyles.authScreen}>
			<ScrollView
				style={appStyles.screen}
				contentContainerStyle={appStyles.authScroll}
				keyboardShouldPersistTaps="handled"
			>
				<View style={appStyles.authHeaderRow}>
					<HeaderBackButton onPress={onBack} />
					{step ? (
						<Text style={appStyles.authStepText}>
							{step.current} de {step.total}
						</Text>
					) : null}
				</View>
				{step ? (
					<View style={appStyles.authProgress} accessible accessibilityLabel={`Passo ${step.current} de ${step.total}`}>
						{Array.from({ length: step.total }, (_, index) => (
							<View
								key={index}
								style={[
									appStyles.authProgressBar,
									index < step.current && appStyles.authProgressBarDone,
								]}
							/>
						))}
					</View>
				) : null}
				<Text accessibilityRole="header" style={appStyles.authTitle}>
					{title}
				</Text>
				{subtitle ? <Text style={appStyles.authSubtitle}>{subtitle}</Text> : null}
				<View style={appStyles.authBody}>{children}</View>
			</ScrollView>
			<View style={appStyles.authFooter}>{footer}</View>
		</View>
	)
}

export default AuthFrame
