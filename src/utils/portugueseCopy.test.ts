import { readFileSync } from 'fs'
import { join } from 'path'

const filesToCheck = [
	'src/components/AnalysisProgressIndicator.tsx',
	'src/components/InAppNotificationBanner.tsx',
	'src/contexts/InAppNotificationContext.tsx',
	'src/screens/AboutScreen.tsx',
	'src/screens/HistoryScreen.tsx',
	'src/screens/LoginScreen.tsx',
	'src/screens/NotificationsScreen.tsx',
	'src/screens/ProfileScreen.tsx',
	'src/screens/RecordDetailScreen.tsx',
	'src/screens/RegisterEmailScreen.tsx',
	'src/screens/RegisterPasswordScreen.tsx',
	'src/screens/RegisterScreen.tsx',
]

const unaccentedVisibleCopy = [
	'Identificacao',
	'concluida',
	'Analise',
	'Nao foi possivel',
	'notificacao',
	'Versao',
	'auxilio',
	'protecao',
	'Guara',
	'geracao',
	'concentracao',
	'gestao',
	'areas de alimentacao',
	'Historico',
	'Visualizacao',
	'Area de Relevante Interesse Ecologico',
	'obrigatorio',
	'obrigatorios',
	'Recuperacao',
	'recuperacao',
	'proxima etapa',
	'Notificacoes',
	'PREFERENCIAS DE NOTIFICACAO',
	'Atualizacoes',
	'mudancas',
	'Relatorio',
	'estatisticas',
	'atualizacoes',
	'Usuario Guara Vivo',
	'Sessao',
	'CONFIGURACOES',
	'Permissao necessaria',
	'acesso as fotos',
	'obrigatoria',
	'invalido',
	'localizacao',
	'confirmacao nao',
	'nao encontrado',
	'disponivel',
]

describe('visible Portuguese copy', () => {
	it('uses accents in user-facing strings', () => {
		const source = filesToCheck
			.map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
			.join('\n')

		const found = unaccentedVisibleCopy.filter((text) => source.includes(text))

		expect(found).toEqual([])
	})
})
