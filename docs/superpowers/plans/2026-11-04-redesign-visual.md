# Redesign visual do GuaráVivo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar no app React Native o redesign aprovado nos mockups: mais claro, vermelho só na ação principal, azul para informação e navegação, telas mais enxutas.

**Architecture:** Tudo parte dos tokens em `src/constants/theme.ts` (as telas já usam `appStyles.*` e `colors.*`, então trocar tokens e estilos de domínio muda o app inteiro). Depois cada tela é refeita em cima desses tokens. Lógica nova que dá para testar (agrupar por dia, calendário, regras de senha, confiança) vira função pura em `src/utils/` com teste Jest.

**Tech Stack:** Expo SDK 54, React Native, `@react-navigation` (bottom-tabs e native-stack), `react-native-maps`, `expo-image`, `@gorhom/bottom-sheet`, Jest (`jest-expo`) só para `*.test.ts` de funções puras.

**Spec:** `design-mockup/index.html` (também publicado em https://claude.ai/artifact/E3jASFna1AgSnpKgMK9yBP). Cada tela tem a captura de hoje, a proposta e a lista de motivos. O plano segue o mockup; onde o plano decide algo que o mockup não mostra, está marcado "decisão minha".

## Global Constraints

- Plataforma estritamente React Native, sem APIs web. Sem dependência nova, exceto a fonte da Task 12 (isolada, pode ser cortada).
- Estilos novos usam tokens (`colors`, `spacing`, `radius`, `fontSize`, `elevation`), sem literais. Estilos vão em `src/styles/<domínio>.ts` (registrados em `appStyles.ts`) ou em `registerStyles.ts` para o fluxo de registro.
- Arquivos de 200 a 300 linhas no máximo; telas grandes se dividem em componente + hook + util.
- Texto visível mantém a acentuação, em português. Arquivo novo com texto visível entra em `filesToCheck` de `src/utils/portugueseCopy.test.ts`.
- Acessibilidade: todo controle tocável tem `accessibilityRole` e, se não tiver texto próprio, `accessibilityLabel`; alvo de toque mínimo 44 px (48 no Android); estados via `accessibilityState`; modais com `accessibilityViewIsModal`.
- Lista dinâmica usa `FlatList`, nunca `ScrollView` com lista dentro.
- Botões são planos (sem sombra). Cartões: sem sombra, borda de 1 px (`colors.border`), `radius.lg`.
- Cores do mockup: primário `#E5202A` (decisão minha: o `#F2201F` atual dá 4,2:1 com texto branco, abaixo dos 4,5:1; o novo dá 4,6:1), azul `#1560D0`, fundo `#FAF9F7`, texto `#1B1B1F`, apagado `#6C6C75`, linha `#ECE9E4`, campo `#EFECE6`, ok `#1E8E5A`, aviso `#9A5B00`.
- Sem commit automático: cada task termina com `typecheck`, `lint` e `test` verdes; o commit só acontece quando o usuário pedir.
- Antes de cada demonstração no celular: `npm run typecheck`, `npm run lint`, `npm test`, depois `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/android-install.ps1 -Device RX8RA03FC3E -Abi arm64-v8a` (celular real, arm64).

## Review Focus

1. Registro sem foto no `images` do resumo: o cartão do Histórico e o detalhe mostram um espaço reservado, sem quebrar o layout.
2. Registros pendentes ou recusados (`sync_state`): continuam com selo "AGUARDANDO ENVIO" ou "RECUSADO" e o botão de descartar, mesmo com o cartão inteiro tocável.
3. Análise sem detecções ou sem `acuracia` em `raw_detection`: o modal mostra "Sem detecções" e nunca `NaN%`.
4. Calendário: fevereiro de 2028 (bissexto), mês que começa no domingo e no sábado, dia de hoje no fim do mês, e datas futuras desabilitadas.
5. Fonte do sistema em tamanho máximo (Dynamic Type): rótulos da tab bar e títulos grandes não cortam nem quebram o layout.

---

## File Structure

- `src/constants/theme.ts`: tokens novos. `src/styles/shared.ts`: cartão plano.
- `src/styles/common.ts`, `home.ts`, `history.ts`, `record.ts`, `recordImage.ts`, `maps.ts`, `profile.ts`, `settings.ts`, `auth.ts`, `register.ts`/`registerStyles.ts`: estilos por domínio.
- `src/navigation/MainTabs.tsx`: tab bar com botão central.
- Utilitários novos (puros, com teste): `src/utils/dayGroups.ts`, `monthGrid.ts`, `confidence.ts`, `initials.ts`, `homeSummary.ts`, `registerSteps.ts`; ampliar `passwordRules.ts`.
- Componentes novos: `components/DatePickerSheet.tsx`, `components/history/HistoryRow.tsx` (substitui o miolo de `HistoryRecordCard`), `components/map/RecordSummarySheet.tsx`, `components/recordImage/ConfidenceBanner.tsx`, `components/PasswordRules.tsx`, `components/Avatar.tsx`.

---

### Task 1: Tokens e base visual

**Files:**
- Modify: `src/constants/theme.ts`, `src/styles/shared.ts`, `src/styles/common.ts` (cartão, campos, botões)
- Test: `src/constants/theme.test.ts` (novo)

**Interfaces:**
- Produces em `colors`: `primary` (`#E5202A`), `primaryDark`, `redSoft` (`#FDECEC`), `secondary` (`#1560D0`), `blueSoft` (`#E8F0FC`), `background` (`#FAF9F7`), `text`, `muted`, `border`, `field` (`#EFECE6`), `success` (`#1E8E5A`), `successSoft` (`#E4F4EC`), `warning` (`#9A5B00`), `warningSoft` (`#FFF1D6`). Os tokens antigos continuam existindo (mesmo nome, valor novo) para nada quebrar.
- Produces `export function contrastRatio(foreground: string, background: string): number` em `src/utils/contrast.ts`.

- [ ] **Step 1: Write the failing test** `theme.test.ts`: `contrastRatio(colors.onColor, colors.primary) >= 4.5`, `contrastRatio(colors.onColor, colors.secondary) >= 4.5`, `contrastRatio(colors.text, colors.background) >= 7`, `contrastRatio(colors.muted, colors.background) >= 4.5`, `contrastRatio(colors.success, colors.successSoft) >= 4.5`, `contrastRatio(colors.warning, colors.warningSoft) >= 4.5`, `contrastRatio('#000000', '#FFFFFF')` igual a 21.
- [ ] **Step 2: Run** `npx jest src/constants/theme.test.ts`. Expected: FAIL (`contrast` não existe).
- [ ] **Step 3: Implement** `contrastRatio` (luminância WCAG, aceita `#RRGGBB`) e os tokens. Cartão (`baseCard` em `shared.ts`) fica sem `...unifiedShadow`; `elevation.card` passa a ser sombra nula (mantém o nome para não quebrar importações) e `overlay` fica como está.
- [ ] **Step 4: Run** `npx jest`, `npm run typecheck`, `npm run lint`. Expected: PASS.

### Task 2: Cabeçalho claro e botões/campos novos

**Files:**
- Modify: `src/components/Header.tsx`, `src/components/HeaderBackButton.tsx`, `src/components/common.tsx`, `src/components/Button.tsx`, `src/components/PasswordField.tsx`, `src/styles/common.ts`

**Interfaces:**
- `Header({ title, leftIcon?, rightIcon? })` mantém a assinatura. Visual: fundo `colors.background`, sem sombra, altura 56, título `fontSize.display` em `colors.text`, sem `textTransform`. `HeaderBackButton`: círculo 40 px `colors.surface` com borda `colors.border`, seta `chevron-back`.
- `ActionButton`: `primary` = vermelho cheio, `secondary` = contorno neutro (`colors.border`, texto `colors.text`), `outline` = fundo `blueSoft` e texto azul, `ghost` = só texto azul. Texto em caixa normal, 16 px, peso 600. `TextField` e `PasswordField`: rótulo acima em `fontSize.caption` cinza, campo com fundo `colors.field`, sem borda, borda azul de 1,5 px em foco (estado `focused` interno).

- [ ] **Step 1: Implement** as mudanças acima. Remover `textTransform: 'uppercase'` de `fieldLabel`, `actionButtonText`, `backButtonText`, `sectionTitle`, `bottomNavLabel`, `appHeaderTitle`.
- [ ] **Step 2: Verify** `npm run typecheck && npm run lint && npm test`. Depois build no celular e conferir Perfil e Editar perfil (usam essas peças): título claro, campos cinza.

### Task 3: Tab bar com botão "Registrar" central

**Files:**
- Modify: `src/navigation/MainTabs.tsx`, `src/styles/common.ts` (`bottomNav*`)

**Interfaces:**
- Ordem das abas: `Home`, `Maps`, `Register` (central), `History`, `Profile`. `MainTabParamList` não muda.
- Aba ativa: ícone dentro de pílula `colors.blueSoft` (50×28), rótulo azul. Aba `Register`: botão circular de 56 px em `colors.primary`, elevado 28 px acima da barra, ícone `add`, rótulo "Registrar" em vermelho abaixo. Altura base 72 + inset.

- [ ] **Step 1: Implement** com `tabBarButton` customizado só para `Register`, mantendo `tabBarAccessibilityLabel`.
- [ ] **Step 2: Verify** no celular: as cinco abas navegam, a ordem nova funciona e o rótulo "Registrar" não corta com fonte grande (Review Focus 5).

### Task 4: Boas-vindas, Splash e Login

**Files:**
- Modify: `src/screens/WelcomeScreen.tsx`, `SplashScreen.tsx`, `LoginScreen.tsx`, `RegisterEmailScreen.tsx`, `RegisterPasswordScreen.tsx`, `src/styles/auth.ts`, `AGENTS.md`
- Create: `src/components/PasswordRules.tsx`
- Modify: `src/utils/passwordRules.ts`; Test: `src/utils/passwordRules.test.ts`

**Interfaces:**
- `export type PasswordRuleStatus = { minLength: boolean; matches: boolean; withinByteLimit: boolean }`
- `export function getPasswordRuleStatus(password: string, confirm: string): PasswordRuleStatus` (mínimo 8 caracteres, máximo 72 bytes UTF-8, igualdade; confirmação vazia conta como não igual).
- `PasswordRules({ status }: { status: PasswordRuleStatus })`: lista com ícone de visto verde e texto ("Pelo menos 8 caracteres", "As duas senhas são iguais"); a regra dos 72 bytes só aparece, em vermelho, quando violada.

- [ ] **Step 1: Write the failing tests**: `'1234567'` → `minLength` falso, `'12345678'` → verdadeiro; senha de 73 bytes (`'a'.repeat(73)`) → `withinByteLimit` falso; `'ç'.repeat(37)` (74 bytes, 37 caracteres) → `withinByteLimit` falso; `getPasswordRuleStatus('12345678', '')` → `matches` falso; confirmações iguais → `matches` verdadeiro.
- [ ] **Step 2: Run** `npx jest src/utils/passwordRules.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** a função e o componente. Trocar o arquivo da logo em `WelcomeScreen` e `SplashScreen` para `Logo Simplificada Fonte Escura.png` (corrige o quadrado azul). Telas: fundo claro, título grande, campos novos da Task 2, botão vermelho no rodapé, "Esqueci minha senha" azul à direita, barra de 2 passos no cadastro.
- [ ] **Step 4: Corrigir `AGENTS.md`**: a frase "Boas-vindas/Splash usam a logo `Logo Fonte Clara.png` (feita para fundo branco)" passa a descrever `Logo Simplificada Fonte Escura.png` em fundo branco; atualizar também a seção de tokens.
- [ ] **Step 5: Verify** `npm test` e conferir no celular, deslogado, Boas-vindas, Login e Cadastro (e-mail e senha). Splash: conferir só pelo código, pois ela some em menos de 1 s.

### Task 5: Início

**Files:**
- Modify: `src/screens/HomeScreen.tsx`, `src/styles/home.ts`
- Create: `src/utils/homeSummary.ts`, `src/utils/homeSummary.test.ts`, `src/utils/initials.ts`, `initials.test.ts`

**Interfaces:**
- `export type HomeSummary = { weekRecords: number; ibis: number; areas: number }`
- `export function summarizeRecords(records: { datetime: string; ibis_quantity: number; map_zones: { id: number }[] }[], now: Date): HomeSummary` (últimos 7 dias corridos; `areas` conta ids distintos de zonas).
- `export function formatLongDate(now: Date): string` em `src/utils/timeFormatters.ts`: `new Date(2026, 10, 4)` → `'Quarta-feira, 4 de novembro'`.
- `export function getInitials(name: string): string`: `'Ana Flávia'` → `'AF'`, `'  ana '` → `'A'`, `''` → `'?'`.

- [ ] **Step 1: Write the failing tests** com os exemplos acima, mais `summarizeRecords([], now)` → zeros e um registro de exatamente 7 dias atrás contado, com 8 dias atrás ignorado.
- [ ] **Step 2: Run** `npx jest src/utils`. Expected: FAIL.
- [ ] **Step 3: Implement** as funções. Tela: logo pequena no topo, "Olá, {primeiro nome}", data longa, cartão vermelho "Novo registro" (leva a `Register`), três métricas, "Último avistamento" (cartão que abre `RecordDetail`), linha "Tudo sincronizado" que muda para "N registros aguardando envio" usando o estado de `usePendingRecordsSync`/`pendingRecords`. Dados vêm de `recordsService` (cache de 60 s), com carregamento e erro amigável (`getLoadErrorMessage`); sem registros, mostra estado vazio com a ação.
- [ ] **Step 4: Verify** `npm test` e celular.

### Task 6: Histórico

**Files:**
- Modify: `src/screens/HistoryScreen.tsx`, `src/components/HistoryRecordCard.tsx`, `src/components/history/HistoryListHeader.tsx`, `src/styles/history.ts`
- Create: `src/utils/dayGroups.ts`, `src/utils/dayGroups.test.ts`

**Interfaces:**
- `export type HistoryRow = { kind: 'header'; key: string; label: string } | { kind: 'record'; key: string; item: RecordItem }`
- `export function groupRecordsByDay(records: RecordItem[], now: Date): HistoryRow[]`: rótulos `"Hoje"`, `"Ontem · 3 de novembro"`, `"31 de julho"` (ano só se diferente do atual); mantém a ordem recebida; registro com `sync_state` entra no grupo da sua data.

- [ ] **Step 1: Write the failing tests**: dois registros de ontem formam um cabeçalho e dois itens; `datetime` de hoje → `"Hoje"`; `2026-07-31T20:29:00` com `now` em novembro de 2026 → `"31 de julho"`; mesma data em 2025 → `"31 de julho de 2025"`; lista vazia → `[]`.
- [ ] **Step 2: Run** `npx jest src/utils/dayGroups.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** a função. Cartão: miniatura `expo-image` 64×64 de `item.images?.[0]` (sem foto: quadrado `colors.field` com ícone de imagem, Review Focus 1), título "N guarás" (singular para 1), hora e número, chip do comportamento. O cartão inteiro é `Pressable` com `accessibilityLabel` "Ver detalhes do registro {id}"; para `sync_state`, manter selo e botão de descartar (Review Focus 2), sem navegação. `HistoryScreen` passa a renderizar `HistoryRow[]` num único `FlatList` (cabeçalhos como itens). Busca com ícone, botão de filtros quadrado e pílula "Mais recentes".
- [ ] **Step 4: Verify** `npm test`, celular: rolagem, busca com debounce, filtros, registros pendentes.

### Task 7: Registrar em passos e seletor de data

**Files:**
- Modify: `src/screens/RegisterScreen.tsx`, `src/components/register/*`, `src/components/register/registerStyles.ts`, `src/hooks/useRegisterLocation.ts`, `src/utils/registerDateTime.ts`
- Create: `src/utils/registerSteps.ts`, `registerSteps.test.ts`, `src/utils/monthGrid.ts`, `monthGrid.test.ts`, `src/components/DatePickerSheet.tsx`

**Interfaces:**
- `export type RegisterStep = 1 | 2 | 3`
- `export function canAdvance(step: RegisterStep, state: { imageCount: number; behaviors: string[]; hasLocation: boolean; dateTimeValid: boolean }): boolean` (passo 1: `imageCount >= 1`; passo 2: `behaviors.length >= 1`; passo 3: `hasLocation && dateTimeValid`).
- `export type DayCell = { day: number; disabled: boolean; selected: boolean } | null`
- `export function buildMonthGrid(year: number, month: number, today: Date, selected: Date | null): DayCell[]`: 6 linhas × 7 colunas no máximo, começando no domingo; células vazias são `null`; dias depois de `today` ficam `disabled`.
- `DatePickerSheet({ visible, value, onConfirm, onClose })`: folha inferior em pt-BR com atalhos "Hoje" e "Ontem", navegação de mês (não passa do mês atual), botões Cancelar e Confirmar. Usa `BottomSheetModal`. A hora continua no seletor nativo de hora (decisão minha, fora do escopo do mockup).

- [ ] **Step 1: Write the failing tests**: `canAdvance(1, { imageCount: 0, ... })` falso e com 1 foto verdadeiro; passo 2 sem comportamento falso; `buildMonthGrid(2026, 10, new Date(2026, 10, 4), null)` tem o dia 1 na coluna 0 (domingo), 30 dias e dias 5 a 30 `disabled`; `buildMonthGrid(2028, 1, ...)` tem 29 dias (Review Focus 4); mês começando no sábado (agosto de 2026) tem o dia 1 na coluna 6; `selected` marca só o dia escolhido.
- [ ] **Step 2: Run** `npx jest src/utils`. Expected: FAIL.
- [ ] **Step 3: Implement** utilitários e componentes. `RegisterScreen`: topo com fechar (confirma descarte se houver fotos), barra de 3 segmentos, passo 1 fotos, passo 2 comportamento (chips com ícone e alvo de 64 px, múltipla escolha), passo 3 local e hora **já preenchidos** (local atual; data e hora = agora, ajustando `useRegisterLocation`/`registerDateTime` para iniciar assim) com "Alterar". A tab bar fica oculta durante o fluxo (`tabBarStyle: { display: 'none' }` via `navigation.setOptions` enquanto o fluxo está ativo). Rodapé fixo: "Voltar" e "Continuar"; no passo 3, "Salvar registro". O estado e o salvamento reaproveitam `useRegisterSave`/`useRegisterImages` sem mudar contrato.
- [ ] **Step 4: Verify** `npm test`; no celular: registrar de ponta a ponta com foto, trocar a data pelo calendário novo, salvar e ver o registro no Histórico. Registrar sem rede continua indo para a fila de pendentes.

### Task 8: Mapas

**Files:**
- Modify: `src/screens/MapsScreen.tsx`, `src/components/MapLibreMapView.tsx`, `src/components/map/RecordMarker.tsx`, `src/components/map/LastUpdatedPill.tsx`, `src/styles/maps.ts`
- Create: `src/components/map/RecordSummarySheet.tsx`

**Interfaces:**
- `RecordSummarySheet({ record, onOpen, onClose }: { record: RecordItem | null; onOpen: (id: number) => void; onClose: () => void })`: folha inferior com miniatura, "N guarás", data e hora, chip do comportamento e botão "Ver detalhes".

- [ ] **Step 1: Implement**: mapa ocupa a área entre o topo e a tab bar; chips de camada (Todos, Alimentação, Ninhos) flutuando no topo com a cor do ponto; pílula "N áreas · atualizado há X min"; botões de localizar e atualizar na lateral; marcadores com ícone (vermelho/talher = alimentação, azul/casa = ninho) e o selecionado maior. Tocar num marcador abre `RecordSummarySheet`; zonas continuam abrindo o `MapZoneDetailSheet` existente. Sem re-render em pan/zoom (não reintroduzir `onRegionChangeComplete`).
- [ ] **Step 2: Verify** celular: trocar camadas, tocar marcador e zona, o ponto azul do usuário no lugar certo, fade dos marcadores intacto.

### Task 9: Detalhe do registro e análise da imagem

**Files:**
- Modify: `src/screens/RecordDetailScreen.tsx`, `src/components/recordDetail/*`, `src/components/RecordImageDetailModal.tsx`, `src/components/recordImage/*`, `src/styles/record.ts`, `src/styles/recordImage.ts`
- Create: `src/utils/confidence.ts`, `confidence.test.ts`, `src/components/recordImage/ConfidenceBanner.tsx`

**Interfaces:**
- `export type ConfidenceLevel = 'alta' | 'media' | 'baixa'`
- `export function getConfidenceLevel(value: number): ConfidenceLevel` (valor decimal 0 a 1: `>= 0.85` alta, `>= 0.7` média, senão baixa; fora de 0 a 1 ou `NaN` → `'baixa'`).
- `export function isLowScore(value: number): boolean` (`< 0.7`).
- `export function formatPercent(value: number | undefined | null): string`: `0.934` → `'93%'`, `undefined` → `'–'` (nunca `NaN%`, Review Focus 3).

- [ ] **Step 1: Write the failing tests** com os exemplos acima e bordas 0,85, 0,7, 0, 1.
- [ ] **Step 2: Run** `npx jest src/utils/confidence.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Detalhe: foto em largura total com botão de voltar e contador, título "N guarás" + chip, linha "Registro #id · data e hora", cartão "Análise por IA" (abre o modal; selo "Alta confiança" conforme `getConfidenceLevel` da média das detecções; sem análise, selo "Em análise"), cartão Local com mini-mapa (`MapView` com `liteMode` e sem gestos) e coordenadas, comportamentos. Modal: X no topo, imagem com caixas, `ConfidenceBanner` (verde/âmbar/vermelho com ícone e texto), um cartão por guará com cor da caixa e nota geral, barras para ave, guará, cor e fase que abrem ao tocar, e aviso escrito para notas abaixo de 70%. Sem detecções: mensagem "Sem detecções nesta imagem". Manter `raw_detection` e o cache de detalhe intactos.
- [ ] **Step 4: Verify** `npm test`; celular com o registro #135 (2 guarás) e um registro sem análise, se existir.

### Task 10: Perfil, formulários e Sobre

**Files:**
- Modify: `src/screens/ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`, `src/styles/profile.ts`, `src/styles/settings.ts`
- Create: `src/components/Avatar.tsx`

**Interfaces:**
- `Avatar({ name, size }: { name: string; size: number })`: círculo `colors.redSoft` com iniciais de `getInitials` (Task 5) em vermelho.

- [ ] **Step 1: Implement**: Perfil com cartão de usuário (avatar, nome, e-mail, "Editar"), grupos "Conta" (Alterar senha, Notificações) e "Sobre", "Sair da conta" separado em vermelho; linhas com ícone em quadrado `blueSoft` e seta. Editar perfil e Alterar senha com campos da Task 2, botão salvar fixo no rodapé e "Cancelar" em texto; Alterar senha usa `PasswordRules`. Notificações e Sobre só ganham o visual novo; as telas sem backend continuam apenas visuais.
- [ ] **Step 2: Verify** `npm run typecheck && npm run lint && npm test` e celular, todas as telas do Perfil.

### Task 11: Revisão de ponta a ponta

**Files:** `AGENTS.md`, `src/utils/portugueseCopy.test.ts`

- [ ] **Step 1: Cobrir textos novos**: acrescentar a `filesToCheck` todos os arquivos novos com texto visível; rodar `npx jest src/utils/portugueseCopy.test.ts`.
- [ ] **Step 2: Procurar sobras**: com a ferramenta Grep, buscar `textTransform: 'uppercase'`, `colors.splash` e `unifiedShadow` fora dos usos intencionais, e literais de cor fora das exceções aceitas do `AGENTS.md`. Corrigir ou justificar cada um.
- [ ] **Step 3: Rodar** `npm run typecheck`, `npm run lint`, `npm test`, `npx expo-doctor`. Expected: sem erros.
- [ ] **Step 4: Atualizar `AGENTS.md`** (seções Estilos, Tokens de design, UI/Layout, Header padrão, Tab bar) para o estado novo. Build e instalação no celular, com captura de cada tela comparada ao mockup. Registrar as diferenças que sobraram.

### Task 12 (opcional, pode ser cortada): Fonte dos títulos

**Files:**
- Modify: `package.json`, `src/constants/theme.ts`, `src/GuaraVivoApp.tsx`, estilos de título em `src/styles/*.ts`

**Interfaces:**
- `fontFamily.display` (`BarlowCondensed_700Bold`) e `fontFamily.displaySemi` (`BarlowCondensed_600SemiBold`) em `theme.ts`; só títulos grandes e números de destaque usam; o texto corrido segue na fonte do sistema (decisão minha, para não aumentar o peso do app).

- [ ] **Step 1: Instalar** `npx expo install @expo-google-fonts/barlow-condensed` (se travar na rede, instalar com `npm install --save-exact`). Carregar com `useFonts` em `GuaraVivoApp.tsx` e manter a Splash até a fonte carregar.
- [ ] **Step 2: Aplicar** `fontFamily.display` nos estilos de `h1` das telas (`headerTitle`, saudação do Início, título do cartão) e nos números das métricas.
- [ ] **Step 3: Verify** build completo no celular (primeira compilação do asset); se a fonte falhar em carregar, o app deve abrir com a fonte do sistema.

---

## Self-review

- **Cobertura do mockup:** Boas-vindas, Login, Cadastro (T4), Recuperar senha (T4, só visual: continua o aviso "Em breve", agora no visual novo), Início (T5), Registrar e data (T7), Mapas e marcador (T8, o marcador já foi feito), Histórico (T6), Detalhe e Análise (T9), Perfil e Editar perfil (T10), tab bar (T3), tokens e cabeçalho (T1, T2). Splash entra na T4.
- **Fora do plano:** tema escuro, tela de Recuperar senha com backend, backend do cadastro e do editar perfil, hora com seletor próprio.
- **Consistência de tipos:** `getInitials` (T5) usado em `Avatar` (T10); `getPasswordRuleStatus` (T4) usado em T4 e T10; `HistoryRow` (T6) só dentro da T6; `RecordSummarySheet` (T8) usa `RecordItem` existente; `contrastRatio` (T1) só em teste e utilitário.
- **Riscos assumidos:** T7 é a maior (reescreve o fluxo de registro); T12 mexe em dependência e pode ser descartada sem afetar as outras.
