import React from 'react'
import { Text, View } from 'react-native'
import { appStyles } from '../../styles/appStyles'
import type { RegisterStep } from '../../utils/registerSteps'
import { HeaderBackButton } from '../HeaderBackButton'

const STEPS: RegisterStep[] = [1, 2, 3]

type Props = {
	step: RegisterStep
	title: string
	hint: string
	onBack: () => void
}

// Topo do registro: voltar, "Passo n de 3", barra de progresso e a pergunta do passo.
export function RegisterStepHeader({ step, title, hint, onBack }: Props) {
	return (
		<View style={appStyles.registerStepHeader}>
			<View style={appStyles.registerStepTopRow}>
				<HeaderBackButton onPress={onBack} />
				<Text style={appStyles.registerStepCount}>{`Passo ${step} de ${STEPS.length}`}</Text>
			</View>
			<View
				style={appStyles.registerProgressRow}
				accessible
				accessibilityRole="progressbar"
				accessibilityLabel={`Passo ${step} de ${STEPS.length}`}
				accessibilityValue={{ min: 1, max: STEPS.length, now: step }}
			>
				{STEPS.map((item) => (
					<View
						key={item}
						style={[
							appStyles.registerProgressSegment,
							item <= step && appStyles.registerProgressSegmentOn,
						]}
					/>
				))}
			</View>
			<Text style={appStyles.registerStepTitle} accessibilityRole="header">
				{title}
			</Text>
			<Text style={appStyles.registerStepHint}>{hint}</Text>
		</View>
	)
}
