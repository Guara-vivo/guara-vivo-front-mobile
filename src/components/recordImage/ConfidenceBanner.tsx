import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import type { ConfidenceLevel } from '../../utils/confidence'

type Props = {
	// null: a imagem não tem detecções para avaliar
	level: ConfidenceLevel | null
	detectionCount: number
}

type Variant = {
	icon: React.ComponentProps<typeof Ionicons>['name']
	iconColor: string
	title: string
	text: string
	box: object
	textStyle: object
}

function getVariant(level: ConfidenceLevel | null, count: number): Variant {
	const guaras = `${count} ${count === 1 ? 'guará' : 'guarás'}`

	if (level === 'alta') {
		return {
			icon: 'checkmark-circle',
			iconColor: colors.success,
			title: 'Alta confiança',
			text: `${guaras} com notas altas. Você pode confiar neste resultado.`,
			box: appStyles.recordImageBannerHigh,
			textStyle: appStyles.recordImageBannerTextHigh,
		}
	}

	if (level === 'media') {
		return {
			icon: 'alert-circle',
			iconColor: colors.warning,
			title: 'Confiança média',
			text: `${guaras} com notas medianas. Vale conferir a foto.`,
			box: appStyles.recordImageBannerMedium,
			textStyle: appStyles.recordImageBannerTextMedium,
		}
	}

	if (level === 'baixa') {
		return {
			icon: 'warning',
			iconColor: colors.dangerText,
			title: 'Baixa confiança',
			text: `${guaras} com notas baixas. Revise esta foto antes de usar o resultado.`,
			box: appStyles.recordImageBannerLow,
			textStyle: appStyles.recordImageBannerTextLow,
		}
	}

	return {
		icon: 'information-circle',
		iconColor: colors.muted,
		title: 'Sem detecções nesta imagem',
		text: 'A análise não encontrou guarás nesta foto.',
		box: appStyles.recordImageBannerNeutral,
		textStyle: appStyles.recordImageBannerTextNeutral,
	}
}

// Faixa de resumo da análise: cor, ícone e texto dizem o mesmo (a cor nunca é a única pista).
export function ConfidenceBanner({ level, detectionCount }: Props) {
	const variant = getVariant(level, detectionCount)

	return (
		<View
			style={[appStyles.recordImageBanner, variant.box]}
			accessible
			accessibilityRole="summary"
			accessibilityLabel={`${variant.title}. ${variant.text}`}
		>
			<Ionicons name={variant.icon} size={28} color={variant.iconColor} />
			<View style={appStyles.recordImageBannerBody}>
				<Text style={[appStyles.recordImageBannerTitle, variant.textStyle]}>
					{variant.title}
				</Text>
				<Text style={[appStyles.recordImageBannerText, variant.textStyle]}>
					{variant.text}
				</Text>
			</View>
		</View>
	)
}
