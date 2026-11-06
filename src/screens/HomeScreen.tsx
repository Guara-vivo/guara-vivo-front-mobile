import React, { useMemo } from 'react'
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../constants/theme'
import { Skeleton } from '../components/Skeleton'
import { SkeletonImage } from '../components/SkeletonImage'
import { useHistoryRecords } from '../hooks/useHistoryRecords'
import { appStyles } from '../styles/appStyles'
import type { MainTabNavigationProp } from '../types/navigation'
import AnalysisProgressIndicator from '../components/AnalysisProgressIndicator'
import { getLatestRecord, isAnalysisInProgress } from '../utils/historyRecords'
import { summarizeRecords } from '../utils/homeSummary'
import { formatTime } from '../utils/recordFormatters'
import { formatLongDate } from '../utils/timeFormatters'
import { formatRelativeDay } from '../utils/dayLabels'

function firstName(name?: string | null) {
	return name?.trim().split(/\s+/)[0] || null
}

function Stat({
	value,
	label,
	loading,
}: {
	value: number
	label: string
	loading: boolean
}) {
	if (loading) {
		return (
			<View style={appStyles.homeStat} accessible accessibilityLabel={`Carregando ${label}`}>
				<View style={appStyles.homeStatSkeleton}>
					<Skeleton width={44} height={30} radius={8} />
				</View>
				<Text style={appStyles.homeStatLabel}>{label}</Text>
			</View>
		)
	}

	return (
		<View style={appStyles.homeStat} accessible accessibilityLabel={`${value} ${label}`}>
			<Text style={appStyles.homeStatValue}>{value}</Text>
			<Text style={appStyles.homeStatLabel}>{label}</Text>
		</View>
	)
}

function LatestSkeleton() {
	return (
		<View style={appStyles.homeLatest} accessible accessibilityLabel="Carregando último avistamento">
			<Skeleton width={56} height={56} radius={8} />
			<View style={appStyles.homeLatestText}>
				<Skeleton width="55%" height={18} radius={6} />
				<Skeleton width="80%" height={14} radius={6} style={appStyles.homeSkeletonLine} />
			</View>
		</View>
	)
}

export function HomeScreen({ userName }: { userName?: string | null }) {
	const navigation = useNavigation<MainTabNavigationProp>()
	const { allRecords, isLoading, isRefreshing, loadError, staleSince, handleRefresh } =
		useHistoryRecords()
	const now = new Date()
	const summary = useMemo(() => summarizeRecords(allRecords, new Date()), [allRecords])
	const latest = useMemo(() => getLatestRecord(allRecords), [allRecords])
	const waiting = allRecords.filter((item) => item.sync_state).length
	const greeting = firstName(userName)
	const behavior = latest?.flock_size ? String(latest.flock_size).split(',')[0].trim() : ''
	const photo = latest?.images?.[0]
	const guaras = latest?.ibis_quantity ?? 0
	// Em análise a contagem ainda é 0: mostra esqueleto e a barra de progresso, como no histórico.
	const analyzing = Boolean(latest && isAnalysisInProgress(latest))

	const syncText = isLoading
		? 'Atualizando…'
		: waiting
		? `${waiting} ${waiting === 1 ? 'registro aguardando' : 'registros aguardando'} envio`
		: loadError || staleSince
			? 'Sem conexão · mostrando os dados guardados'
			: 'Tudo sincronizado'
	const syncOk = !waiting && !loadError && !staleSince

	return (
		<ScrollView
			style={appStyles.homeScreen}
			contentContainerStyle={appStyles.homeContent}
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={handleRefresh}
					colors={[colors.secondary]}
					tintColor={colors.secondary}
				/>
			}
		>
			<Text style={appStyles.homeBrand} accessibilityRole="header">
				GUARÁ<Text style={appStyles.homeBrandAccent}>VIVO</Text>
			</Text>
			<Text style={appStyles.homeGreeting}>{greeting ? `Olá, ${greeting}` : 'Olá'}</Text>
			<Text style={appStyles.homeDate}>{formatLongDate(now)}</Text>

			<Pressable
				onPress={() => navigation.navigate('Register')}
				accessibilityRole="button"
				accessibilityLabel="Novo registro"
				style={appStyles.homeCta}
			>
				<View style={appStyles.homeCtaIcon}>
					<Ionicons name="camera-outline" size={24} color={colors.onColor} />
				</View>
				<View style={appStyles.homeCtaText}>
					<Text style={appStyles.homeCtaTitle}>Novo registro</Text>
					<Text style={appStyles.homeCtaHint}>Foto, comportamento, local e hora</Text>
				</View>
				<Ionicons name="chevron-forward" size={22} color={colors.onColor} />
			</Pressable>

			<View style={appStyles.homeStatRow}>
				<Stat loading={isLoading} value={summary.weekRecords} label="registros nesta semana" />
				<Stat loading={isLoading} value={summary.ibis} label="guarás avistados" />
				<Stat
					loading={isLoading}
					value={summary.areas}
					label={summary.areas === 1 ? 'área mapeada' : 'áreas mapeadas'}
				/>
			</View>

			<Text style={appStyles.homeSectionTitle} accessibilityRole="header">
				Último avistamento
			</Text>
			{isLoading ? (
				<LatestSkeleton />
			) : latest ? (
				<Pressable
					onPress={() => navigation.navigate('RecordDetail', { recordId: latest.id })}
					disabled={Boolean(latest.sync_state)}
					accessibilityRole="button"
					accessibilityLabel={`Ver registro ${latest.id}${analyzing ? ', em análise' : ''}`}
					style={appStyles.homeLatest}
				>
					{photo ? (
						<SkeletonImage uri={photo} style={appStyles.homeLatestThumb} />
					) : (
						<View style={[appStyles.homeLatestThumb, appStyles.homeLatestThumbEmpty]}>
							<Ionicons name="image-outline" size={22} color={colors.muted} />
						</View>
					)}
					<View style={appStyles.homeLatestText}>
						{latest.sync_state === 'failed' ? (
							<Text style={appStyles.homeLatestTitle}>Não enviado</Text>
						) : analyzing || latest.sync_state ? (
							<Skeleton width={96} height={18} radius={6} />
						) : (
							<Text style={appStyles.homeLatestTitle}>
								{guaras} {guaras === 1 ? 'guará' : 'guarás'}
							</Text>
						)}
						<Text style={appStyles.homeLatestMeta}>
							{formatRelativeDay(latest.datetime, now)}, {formatTime(latest.datetime)}
							{latest.sync_state ? '' : ` · #${latest.id}`}
						</Text>
						{latest.sync_state ? (
							<View
								style={[
									appStyles.historySyncChip,
									appStyles.homeLatestSyncChip,
									latest.sync_state === 'failed' && appStyles.historySyncChipFailed,
								]}
							>
								<Text
									style={[
										appStyles.historySyncChipText,
										latest.sync_state === 'failed' && appStyles.historySyncChipTextFailed,
									]}
								>
									{latest.sync_state === 'failed' ? 'Recusado' : 'Aguardando envio'}
								</Text>
							</View>
						) : analyzing ? (
							<AnalysisProgressIndicator progress={latest.analysis_progress} status={latest.status} />
						) : null}
					</View>
					{behavior ? (
						<View style={appStyles.homeLatestChip}>
							<Text style={appStyles.homeLatestChipText}>{behavior}</Text>
						</View>
					) : null}
					<Ionicons name="chevron-forward" size={18} color={colors.muted} />
				</Pressable>
			) : (
				<View style={appStyles.homeEmpty}>
					<Text style={appStyles.homeEmptyText}>
						Nenhum registro ainda. Toque em “Novo registro” para começar.
					</Text>
				</View>
			)}

			<View style={appStyles.homeSync} accessibilityRole="text" accessibilityLiveRegion="polite">
				{isLoading ? (
					<ActivityIndicator size="small" color={colors.muted} style={appStyles.homeSyncSpinner} />
				) : (
					<View style={[appStyles.homeSyncDot, !syncOk && appStyles.homeSyncDotWarn]}>
						<Ionicons
							name={syncOk ? 'checkmark' : 'cloud-offline-outline'}
							size={12}
							color={colors.onColor}
						/>
					</View>
				)}
				<Text style={appStyles.homeSyncText}>{syncText}</Text>
			</View>
		</ScrollView>
	)
}

export default HomeScreen
