import React, { useCallback, useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Header } from '../components/Header'
import { ApiError } from '../services/apiClient'
import {
	configureOffline,
	getOfflineStatus,
	triggerOfflineSync,
	type OfflineStatus,
} from '../services/offlineApi'
import { getToken } from '../services/authService'
import { appStyles } from '../styles/appStyles'
import type { RootStackParamList } from '../types/navigation'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

function describeError(error: unknown) {
	if (error instanceof ApiError) {
		if (error.status === 401 || error.status === 403) {
			return 'Credenciais do servidor remoto inválidas.'
		}
		if (error.status === 502 || error.status === 503 || error.status === 504) {
			return 'Não foi possível alcançar o servidor remoto.'
		}
	}
	return 'Não foi possível concluir a operação. Tente novamente.'
}

function formatLastSync(value: string | null) {
	return value ? new Date(value).toLocaleString('pt-BR') : 'Nunca'
}

export function OfflineSyncScreen() {
	const navigation = useNavigation<NavigationProp>()
	const [status, setStatus] = useState<OfflineStatus | null>(null)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isBusy, setIsBusy] = useState(false)

	const loadStatus = useCallback(async () => {
		const token = await getToken()
		if (!token) return
		try {
			setStatus(await getOfflineStatus(token))
		} catch {
			setStatus(null)
		}
	}, [])

	useEffect(() => {
		void loadStatus()
	}, [loadStatus])

	const run = async (action: (token: string) => Promise<void>, success: string) => {
		if (isBusy) return
		setIsBusy(true)
		try {
			const token = await getToken()
			if (!token) throw new Error('Missing token')
			await action(token)
			Alert.alert('Pronto', success)
			await loadStatus()
		} catch (error) {
			Alert.alert('Erro', describeError(error))
		} finally {
			setIsBusy(false)
		}
	}

	const handleConfigure = () => {
		if (!email.trim() || !password) {
			Alert.alert('Atenção', 'Informe e-mail e senha da conta no servidor remoto.')
			return
		}
		void run(async (token) => {
			await configureOffline(token, email.trim(), password)
			setPassword('')
		}, 'Conta remota vinculada. Os registros serão sincronizados.')
	}

	const handleSync = () =>
		void run(triggerOfflineSync, 'Sincronização iniciada.')

	return (
		<View style={appStyles.profileScreen}>
			<Header
				title="Sincronização"
				leftIcon={
					<Pressable
						onPress={() => navigation.goBack()}
						hitSlop={8}
						style={appStyles.headerActionButton}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
				}
			/>

			<ScrollView contentContainerStyle={appStyles.profileContent}>
				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>STATUS</Text>
					{status ? (
						<>
							<Text style={appStyles.changePasswordHint}>
								{`Servidor remoto: ${status.remote_connected ? 'conectado' : 'sem conexão'}`}
							</Text>
							<Text style={appStyles.changePasswordHint}>
								{`Registros pendentes: ${status.pending_sync}`}
							</Text>
							<Text style={appStyles.changePasswordHint}>
								{`Última sincronização: ${formatLastSync(status.last_sync_at)}`}
							</Text>
							{status.last_sync_error ? (
								<Text style={appStyles.changePasswordHint}>
									{`Erro: ${status.last_sync_error}`}
								</Text>
							) : null}
						</>
					) : (
						<Text style={appStyles.changePasswordHint}>Status indisponível.</Text>
					)}
					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={handleSync}
							disabled={isBusy}
							style={appStyles.changePasswordSecondaryAction}
						>
							<Text style={appStyles.changePasswordSecondaryActionText}>
								SINCRONIZAR AGORA
							</Text>
						</Pressable>
					</View>
				</View>

				<View style={appStyles.changePasswordCard}>
					<Text style={appStyles.changePasswordLabel}>CONTA NO SERVIDOR REMOTO</Text>
					<Text style={appStyles.changePasswordHint}>
						Vincule sua conta do servidor remoto para que os registros feitos
						offline sejam enviados.
					</Text>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="mail-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>E-MAIL</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="email-address"
								style={appStyles.changePasswordInputNoPadding}
							/>
						</View>
					</View>

					<View style={appStyles.changePasswordFieldWrap}>
						<View style={appStyles.changePasswordLabelRow}>
							<Ionicons name="lock-closed-outline" size={13} color="#F2201F" />
							<Text style={appStyles.changePasswordLabel}>SENHA</Text>
						</View>
						<View style={appStyles.changePasswordInputRow}>
							<TextInput
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize="none"
								style={appStyles.changePasswordInputNoPadding}
							/>
							<Pressable
								onPress={() => setShowPassword((value) => !value)}
								style={appStyles.changePasswordEyeButton}
							>
								<Ionicons
									name={showPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color="#909097"
								/>
							</Pressable>
						</View>
					</View>

					<View style={appStyles.changePasswordActionsRow}>
						<Pressable
							onPress={handleConfigure}
							disabled={isBusy}
							style={appStyles.changePasswordPrimaryAction}
						>
							{isBusy ? (
								<ActivityIndicator color="#FFFFFF" />
							) : (
								<Text style={appStyles.changePasswordPrimaryActionText}>VINCULAR CONTA</Text>
							)}
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default OfflineSyncScreen
