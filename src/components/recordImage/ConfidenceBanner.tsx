import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { colors } from '../../constants/theme'
import { appStyles } from '../../styles/appStyles'
import { WARNING_CODES } from '../../utils/analysisWarningCodes'
import { countLabel } from '../../utils/countLabel'
import {
	getWarningMessage,
	getWarningMessages,
	needsAttention,
	type AnalysisStatus,
} from '../../utils/analysisWarnings'
import type { ConfidenceLevel } from '../../utils/confidence'

type Props = {
	// null: a imagem não tem detecções para avaliar
	level: ConfidenceLevel | null
	detectionCount: number
	// Vindos da API; ausentes em registros antigos
	status?: AnalysisStatus | null
	avisos?: string[]
}

type Variant = {
	icon: React.ComponentProps<typeof Ionicons>['name']
	iconColor: string
	title: string
	text: string
	box: object
	textStyle: object
}

const ATTENTION_TITLES: Record<string, string> = {
	sem_ave: 'banner.noBirdTitle',
	sem_guara: 'banner.noIbisTitle',
}

const ATTENTION_FALLBACK_CODES: Record<string, string> = {
	sem_ave: WARNING_CODES.noBird,
	sem_guara: WARNING_CODES.noIbis,
}

// Aviso da API (foto fora das melhores condições): vale mais que a nota de confiança.
function getAttentionVariant(status: AnalysisStatus | null, avisos: string[]): Variant {
	const messages = getWarningMessages(avisos)
	const fallback = status ? ATTENTION_FALLBACK_CODES[status] : undefined
	const text =
		messages.length > 0
			? messages.join(' ')
			: getWarningMessage(fallback ?? 'foto_com_ressalvas')

	return {
		icon: 'alert-circle',
		iconColor: colors.warning,
		title: i18n.t(`detail:${(status && ATTENTION_TITLES[status]) || 'banner.attentionTitle'}`),
		text,
		box: appStyles.recordImageBannerMedium,
		textStyle: appStyles.recordImageBannerTextMedium,
	}
}

function getVariant(
	level: ConfidenceLevel | null,
	count: number,
	status: AnalysisStatus | null,
	avisos: string[],
): Variant {
	if (needsAttention(status, avisos)) {
		return getAttentionVariant(status, avisos)
	}

	const guaras = countLabel(count)

	if (level === 'alta') {
		return {
			icon: 'checkmark-circle',
			iconColor: colors.success,
			title: i18n.t('detail:banner.highTitle'),
			text: i18n.t('detail:banner.highText', { guaras }),
			box: appStyles.recordImageBannerHigh,
			textStyle: appStyles.recordImageBannerTextHigh,
		}
	}

	if (level === 'media') {
		return {
			icon: 'alert-circle',
			iconColor: colors.warning,
			title: i18n.t('detail:banner.mediumTitle'),
			text: i18n.t('detail:banner.mediumText', { guaras }),
			box: appStyles.recordImageBannerMedium,
			textStyle: appStyles.recordImageBannerTextMedium,
		}
	}

	if (level === 'baixa') {
		return {
			icon: 'warning',
			iconColor: colors.dangerText,
			title: i18n.t('detail:banner.lowTitle'),
			text: i18n.t('detail:banner.lowText', { guaras }),
			box: appStyles.recordImageBannerLow,
			textStyle: appStyles.recordImageBannerTextLow,
		}
	}

	return {
		icon: 'information-circle',
		iconColor: colors.muted,
		title: i18n.t('detail:banner.noneTitle'),
		text: i18n.t('detail:banner.noneText'),
		box: appStyles.recordImageBannerNeutral,
		textStyle: appStyles.recordImageBannerTextNeutral,
	}
}

// Faixa de resumo da análise: cor, ícone e texto dizem o mesmo (a cor nunca é a única pista).
export function ConfidenceBanner({ level, detectionCount, status = null, avisos = [] }: Props) {
	// Só para re-renderizar quando o idioma muda; os textos saem de i18n.t em getVariant.
	useTranslation('detail')
	const variant = getVariant(level, detectionCount, status, avisos)

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
