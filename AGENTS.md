# 📘 Opencode Agent Instructions for guara-vivo-front-mobile

## 🚀 Core Workflow

- **Initialization:** O projeto é um aplicativo móvel construído com **React Native/Expo**. O ponto de entrada principal é `expo/AppEntry`.
- **Development Command:** Para iniciar o ambiente de desenvolvimento, use `npm start` ou `expo start`.
- **Validation:** Os comandos principais do projeto são `npm run lint`, `npm run typecheck` e `npx expo-doctor`.
- **Testing:** Testes devem seguir as convenções do Expo/React Native. Verifique a necessidade de mocking específico do Expo antes de testar componentes nativos. O Jest só pega `*.test.ts` de funções puras (não há `react-test-renderer` tipado nem teste de `.tsx`).
- **Teste visual no emulador:** gere o APK release e instale no BlueStacks pelo adb seguindo a seção **Fluxo de teste no BlueStacks** abaixo (`npm run android:install`).

## 📱 Fluxo de teste no BlueStacks (APK release)

Fluxo padrão para ver qualquer mudança de UI/JS rodando de verdade. **Sempre rode antes:** `npm run typecheck`, `npm run lint` e `npm test`.

- **Comando único:** `npm run android:install` (`scripts/android-install.ps1`). Faz o build `assembleRelease` minificado de **uma só ABI** (`x86_64`, a do BlueStacks), instala via adb com `-r` e abre o app. Rode em background (leva ~35 s com cache; ~10 min na primeira vez ou depois de adicionar módulo nativo, ex.: `expo install ...`).
- **Por que release e não debug:** o debug empacota as 4 ABIs (~181 MB), não tem JS embutido e exige Metro. O release x86_64 tem ~29 MB e funciona sem Metro. Consequência: **toda mudança de JS exige rebuild**; não há fast refresh.
- **Assinatura (só teste):** o script passa `-PlocalDebugSign` (ver `android/app/build.gradle`), que assina com `debug.keystore`. **Nunca publique esse APK.** O build de publicação usa `app.keystore` (alias `guaravivo`; senhas e alias vêm de `ANDROID_STORE_PASSWORD`, `ANDROID_KEY_ALIAS` e `ANDROID_KEY_PASSWORD`). Verificado em 2026-11-10: `gradlew assembleRelease` sem `-PlocalDebugSign` assina com sucesso (confira com `apksigner verify --print-certs`, SHA-1 `7A:75:BB:5A:57:3B:84:2A:B5:54:05:F2:62:3B:A4:1D:7F:23:6C:36`). O SHA-1 do `debug.keystore` é `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`; ambos devem estar na restrição da chave do Google Maps (pacote `com.guaravivo.app`).
- **Reinstalação:** se a assinatura instalada for diferente (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`), o script desinstala e reinstala; isso **apaga os dados locais** do app (sessão, registros pendentes).
- **adb:** `C:\Android\platform-tools\adb.exe` (não está no PATH). Dispositivo BlueStacks: `127.0.0.1:5555` (`adb connect 127.0.0.1:5555`), tela 900x1600, pacote `com.guaravivo.app`. Use sempre `-s 127.0.0.1:5555`.
- **Aparelho físico (USB):** `scripts/android-install.ps1` trava no `adb connect`; nesse caso rode o build à mão no PowerShell: `cd android; .\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a" -PlocalDebugSign --console=plain` e instale com `adb -s <serial do adb devices> install -r android\app\build\outputs\apk\release\app-release.apk` (repita se vier `INSTALL_FAILED_VERIFICATION_FAILURE`), depois `adb -s <serial> shell monkey -p com.guaravivo.app -c android.intent.category.LAUNCHER 1`. Tela 1080x2400; screenshots são exibidos em 900x2000 (multiplique por 1,2). **Não escolha fotos da galeria do usuário nos testes** (o seletor abre a galeria pessoal): peça que ele teste o fluxo de fotos.
- **Rode o adb pelo PowerShell**, não pelo Git Bash: o Git Bash converte `/sdcard/...` em `C:/Program Files/Git/sdcard/...` e o `screencap`/`pull` falham.
- **Screenshot:** `adb -s 127.0.0.1:5555 shell screencap -p /sdcard/s.png` + `adb pull /sdcard/s.png <pasta temporária>` e abra a imagem com a ferramenta Read.
- **Login após cada abertura:** no emulador o SecureStore falha e o token fica só em memória, então o app volta à boas-vindas a cada reinício. A conta de teste (e-mail/senha) deve ser pedida ao usuário; **não grave a senha neste arquivo**. Toques (px): "ACESSAR MINHA CONTA" `(450,1038)`, campo e-mail `(400,342)`, campo senha `(400,438)`, botão "ACESSAR" `(450,685)`; use `adb shell input text "..."`. **Não use `keyevent 4`** para fechar teclado (volta de tela).
- **Tab bar (y ≈ 1550 em 900x1600):** Início x=100, Mapas 275, Registrar 450 (botão central vermelho, some na aba Registrar), Histórico 625, Perfil 800. Em aparelho real 1080x2400: y≈2208, x = 126 / 333 / 540 / 746 / 960.
- **Overlays do emulador:** se aparecerem rastros vermelhos/números no topo, desligue "Localização do ponteiro": `adb -s 127.0.0.1:5555 shell settings put system pointer_location 0`.
- **Armadilhas no Windows:** `npx expo install --check` pode travar (rede); prefira `npx expo install <pacote>` direto. Processos `node` do Metro/Jest podem ficar pendurados e consumir CPU: só encerre com autorização do usuário. Scripts Python em heredoc perdem `\`; salve em arquivo na pasta temporária. O hook `rtk` reescreve `grep` (e não há `rg` no PATH): prefira as ferramentas Grep/Read.

## 📂 Codebase Structure

- **Entrypoints:** A lógica de telas, componentes e utilitários para o mobile deve ser procurada e manipulada dentro de `src`.
- **Separação:** O diretório `src/app` foi removido, pois continha componentes e telas obsoletos da web.
- **Main App:** A navegação principal fica em `src/GuaraVivoApp.tsx`.
- **Navigation:** Os estados de tela são definidos por `ScreenId` em `src/types/navigation.ts`.
- **Tipos de navegação:** `src/types/navigation.ts` exporta `MainTabNavigationProp` (aba + pilha raiz); use-o nas abas que abrem telas como `RecordDetail`. Para parâmetros de rota use `useRoute<RouteProp<RootStackParamList, 'Nome'>>()`.
- **Screens:** As telas principais ficam em arquivos individuais em `src/screens/` (ex.: `SplashScreen.tsx`, `WelcomeScreen.tsx`, `LoginScreen.tsx`, `RegisterEmailScreen.tsx`, `RegisterPasswordScreen.tsx`, `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Mapa:** A visualização do mapa fica em `src/components/MapLibreMapView.tsx` (apesar do nome, usa `react-native-maps`/Google Maps, assim como o seletor de local de `RegisterScreen`; o nome é legado), com a seleção de camadas controlada em `src/screens/MapsScreen.tsx`.
- **Estilos:** O visual do app fica em `src/styles/`, dividido por assunto (`common.ts`, `auth.ts`, `history.ts`, `record.ts`, `maps.ts`, ...), com `appStyles.ts` agregando tudo (as telas usam `appStyles.<nome>`) e `shared.ts` com as constantes comuns; tokens em `src/constants/theme.ts` (ver **Tokens de design** abaixo).
- **Dados/API:** Os registros reais vêm da API por `src/services/recordsService.ts` e `src/services/recordsApi.ts`. Tipos reais ficam em `src/types/api.ts`; formatadores em `src/utils/recordFormatters.ts`; opções de comportamento em `src/constants/behaviors.ts`.
- **Assets:** As logos usadas no app ficam em `src/assets/images`.

- **Nota:** Arquivos combinados anteriores como `mainScreens.tsx`, `profileScreens.tsx` e `authScreens.tsx` foram divididos em arquivos por tela para facilitar manutenção.

### Arquitetura Modular (atual)

- **Components:** `src/components/` contém componentes reutilizáveis na raiz (`Button`, `ErrorBoundary`, `FeedbackModal`, `Header`, `MapLibreMapView`, `BottomNavigation`, `common.tsx` com `ActionButton`/`TextField`/`ScreenHeader`), `HeaderBackButton`, `PasswordField`, `ComingSoonModal` (aviso para ações sem backend), `Skeleton` (bloco que pulsa, só opacidade com driver nativo) e `SkeletonImage` (foto com esqueleto até o `onLoad`; use no lugar de `expo-image` em fotos de registro) e subpastas por domínio: `history/` (+ `history/filters/` com as seções do modal de filtros), `recordDetail/` (inclui `RecordDetailSkeleton` e `RecordDetailMessage` com "Tentar de novo"), `recordImage/` (modal de análise por imagem), `register/` e `map/`.
- **Screens:** Cada tela agora é um arquivo único em `src/screens/` (ex.: `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Hooks:** Lógica reutilizável fica em `src/hooks/`: histórico (`useHistoryFilters`, `useHistoryRecords`, `useMapZoneOptions`, `useDebouncedValue` para a busca), conexão (`useIsOnline`, via NetInfo + `utils/connectivity.ts`), detalhe (`useRecordDetail`, `useImageCarousel`), registro (`useRegisterImages`, `useRegisterLocation`, `useRegisterSave`, `useRegisterFeedback`, `usePendingRecordsSync`), mapa (`useCurrentLocationTarget`, `useRecordMarkerFade`, `useStoredCameraRegion`), além de utilitários de senha em `utils/passwordRules.ts` (regra única: mínimo de 6 caracteres).
- **Utils:** Funções puras (com testes) em `src/utils/`: `historyRecords.ts` (ordenação por criação/id com `sortRecordsByRecency`, `getLatestRecord`, mescla de progresso, `needsRecordsRefresh`, `isAnalysisInProgress`), `refreshScheduler.ts` (recarga limitada por intervalo que adia pedidos em vez de descartá-los), `inputDate.ts` (dd/mm/aaaa <-> Date dos filtros), `connectivity.ts`, `registerFeedback.ts` (mensagens do registro), `recordFormatters.ts`, `detectionFormatters.ts`, `registerDateTime.ts`, `pendingRecords.ts`, `loadErrorMessage.ts` (texto amigável para falhas de carregamento), `mapZone*.ts`. Textos visíveis ao usuário devem manter a acentuação; arquivos novos com texto visível entram em `filesToCheck` de `src/utils/portugueseCopy.test.ts`.
- **Services:** Integração de API e cache ficam em `src/services/` (ex.: `apiClient.ts` com `apiFetch` e `apiGetJson`, `authService.ts`, `recordsApi.ts`, `recordsCache.ts`, `recordsService.ts`, `tokenStorage.ts`).
- **Styles:** estilos novos vão no arquivo de domínio em `src/styles/` (e passam a valer em `appStyles` automaticamente); crie um arquivo novo e registre-o em `appStyles.ts` se nenhum servir.
- **Guideline:** Evitar arquivos acima de 200–300 linhas para facilitar leitura e agentes locais.
- **Header padrão:** Use `src/components/Header.tsx` nas telas principais; mantenha o estilo compartilhado em `appStyles.header`, `appHeaderTitle` e `headerRight` para preservar a faixa azul em largura total.

### Tokens de design (`src/constants/theme.ts`)

Estilos novos **não usam literais**; use os tokens:

- **Cores:** `colors.*`. Base: `primary` (vermelho), `secondary` (azul), `text`, `muted`, `background`, `surface`, `border`. Semânticas: `onColor` (texto/ícone sobre cor), `accent`/`accentSoft` (ícones azuis), `danger`/`dangerBg`/`dangerText`, `success`, `placeholder`, `selectedBg`/`selectedBgActive`, `switchTrackOff`/`switchThumb`, `overlaySurface`, `scrim`/`scrimSoft`, `mediaBadge`. Branco em fundo/borda é `colors.surface`; branco em texto/ícone é `colors.onColor`.
- **Espaçamento:** `spacing` = xs 4, sm 8, sm2 12, md 16, lg 24, xl 32 (em `padding*`, `margin*`, `gap`).
- **Raio:** `radius` = sm 8, md 12, lg 16, pill 999 (círculos/pílulas); `cornerRadius` (12) em `shared.ts`.
- **Fonte:** `fontSize` = caption 12, body 14, bodyLarge 16, title 20, headline 22, display 26 (`typography` traz também `lineHeight`). `fontFamily.display`/`displaySemi` = Barlow Condensed (Bold/SemiBold, `@expo-google-fonts/barlow-condensed`, carregada com `useFonts` em `GuaraVivoApp.tsx`; a splash espera a fonte carregar ou falhar). Use só em títulos grandes e números (saudação, métricas, título do cabeçalho, títulos de tela); texto corrido usa a fonte do sistema. Não combine com `fontWeight`.
- **Cores novas:** `primaryDark`, `redSoft`, `blueSoft`, `field` (fundo de campo), `successSoft`, `warningSoft`.
- **Elevação:** `elevation.card` (`unifiedShadow` em `shared.ts`, cards) e `elevation.overlay` (`overlayShadow`, itens flutuantes: botões do mapa, banner, modal). **Botões são planos** (sem sombra).
- **Exceções aceitas (literais):** paleta de cores das detecções (`utils/detectionFormatters.ts`), estilo do Google Maps (`config/mapStyle.ts`), cores de zona do mapa (`utils/mapZoneStyle.ts`, cobertas por teste), neutros de marcador em `components/map/mapViewStyles.ts`, `fontSize: 7` do anel de progresso (`analysisProgressText`) e ajustes pontuais de 0/1/2 ou offsets grandes.

## 🛠️ Constraints & Quirks

- **Framework:** A plataforma é estritamente **React Native**. Evite qualquer lógica ou importação que dependa de APIs web (DOM, etc.).
- **Styling:** Os estilos e a aparência são gerenciados localmente em `src/styles/` (agregados em `appStyles.ts`) e nos tokens de `src/constants/theme.ts`.
- **Expo Setup:** O app usa `expo-font`, `expo-location`, `expo-image-picker` e `expo-image` (config em `app.config.js`). Localização centraliza o mapa e envia coordenadas no registro; image picker seleciona fotos do avistamento.
- **Platform:** `app.json` define orientação portrait, tema claro, suporte a tablet no iOS e adaptive icon no Android.
- **Scripts Atuais:** Use `npm start`, `npm run lint`, `npm run lint:fix` e `npm run typecheck`.
- **Mapa:** Remove POIs comerciais, usa marcadores personalizados neutros, a contagem de áreas aparece no cabeçalho do card CAMADA em `MapsScreen` (não mais sobre o mapa). **Sem re-renders em pan/zoom** (otimização performance). Mapas carregados de `MAP_RECORDS` em dev.
- **Map Layers:** `all` = total visível, `feeding` = pontos vermelhos (alimentação), `nests` = casas azuis (ninhos).
- **API URL:** `src/services/apiClient.ts` usa `EXPO_PUBLIC_API_URL` (variável de ambiente). Em dev: fallback para `192.168.18.145:8001` (Android) ou `localhost:8001` (iOS). Em produção: requer HTTPS, erro se HTTP.
- **Rede:** `apiFetch` aplica timeout (20s; 120s em upload). `apiGetJson` faz `GET` + leitura do JSON na mesma tentativa e repete **uma vez** em falha de rede/corpo inválido (ex.: "The specified blob is invalid" do RN/Android); não repete erro da API, timeout nem cancelamento. Telas mostram `getLoadErrorMessage(...)`, nunca `error.message` cru. Quando o refresh token é recusado, `setSessionExpiredHandler` leva o app de volta ao login e `clearExpiredSession` limpa os dados locais.
- **Auth:** Login salva `access_token` e `refresh_token` via `src/services/tokenStorage.ts` usando **Keychain (iOS)** e **Keystore (Android)** via `expo-secure-store`. Cada gravação é conferida por leitura; se o SecureStore falhar (alguns emuladores), o token fica **só em memória** durante a sessão e **nunca** vai para o `AsyncStorage` (texto puro). Tokens de versões antigas no `AsyncStorage` são migrados para o SecureStore e a cópia antiga é sempre apagada. `apiFetch` renova token em `401` usando `POST /users/refresh` e repete requisição.
- **Erros do login:** `utils/loginErrorMessage.ts` (`getLoginErrorFeedback`) separa credenciais (`ApiError` < 500), servidor indisponível (5xx), conexão lenta (timeout), sem conexão (`isNetworkFailure` em `apiClient.ts`) e erro local; nunca mostre `error.message` cru. `authService.login` repete **uma vez** só em falha de rede (não em timeout, porque o servidor pode ter recebido o pedido, nem em erro da API). A versão exibida vem de `utils/appVersion.ts` (lê o `package.json`); um teste confere que `package.json`, `app.config.js` e `build.gradle` têm a mesma versão.
- **Records API:** Histórico usa `GET /records/summary`; detalhe usa `GET /records/{record_id}/detail`; upload usa `POST /records/upload` com `FormData` sem definir manualmente `Content-Type`. **Requests suportam AbortSignal** para cancelamento em unmount (economiza bateria/dados).
- **Imagens:** fotos de registro usam `expo-image` (`cachePolicy="memory-disk"`, `contentFit`); o tamanho original para o overlay de detecções vem do `onLoad` da própria imagem (não use `Image.getSize`, que baixa a foto duas vezes).
- **Record Detail Modal:** `src/components/RecordImageDetailModal.tsx` shows per-image analysis with image preview, analysis status, technical accuracy summary, and per-individual detection details.
- **Per-image detections:** `RecordDetailItem.image_analyses` contains `detections` filtered by `analysis_image_id`; preserve `raw_detection` from the API to display `cor`, `fase_vida`, and `acuracia` fields.
- **Accuracy fields:** The modal expects `raw_detection.acuracia.deteccao_yolo`, `classificacao_guara`, `classificacao_cor`, and `classificacao_fase_vida` as decimal values and formats them as percentages.
- **Cache:** `src/services/recordsCache.ts` mantém cache em memória (TTL: 60 segundos) e é limpo no logout. Invalide com `invalidateRecordsCache()` após upload.
  - ⚠️ **Importante:** `/records/summary` (resumos) NUNCA devem ser salvos como detalhe. Apenas `/records/{id}/detail` (com `image_analyses`) é cacheado como detalhe. Modal de análise usa `image_analyses` e mostraria erro se alimentado com resumo.
- **Ordem dos registros:** histórico e "Último avistamento" da Home ordenam pelo **id** (criação), não pela data do avistamento, que pode ser retroativa (`sortRecordsByRecency`). Registro só do aparelho (`sync_state`) conta como o mais recente.
- **Atualização automática da lista:** `useHistoryRecords` recarrega em silêncio (via `createRefreshScheduler`, no máximo 1 pedido a cada 5 s, sem perder pedidos) quando uma análise termina em tempo real, a internet volta (NetInfo) ou o app volta ao primeiro plano com cache vencido. A API corrigiu a corrida de cache do servidor, então **não há recarga de confirmação extra**.
- **Contagem de guarás em análise:** com a análise ativa (`pending`/`processing`), na fila de envio ou logo após terminar em tempo real, o `ibis_quantity` (0) ainda não vale. `mergeProgressUpdates` marca `count_pending: true` ao concluir; `isAnalysisInProgress(record)` diz quando mostrar `Skeleton` no lugar do número (cartão do histórico e card da Home). A marca some quando a lista da API chega. Registro recusado mostra "Não enviado".
- **Detalhe do registro:** `useRecordDetail` parte do resumo em cache (sem `image_analyses`) e busca o detalhe completo; `isFetchingDetail` faz `AiAnalysisCard` e `RecordInfoCard` mostrarem esqueleto em vez de "Sem análise"/quantidade velha. Sem rede e sem cache, expõe `loadError` + `retry` (tela de erro com "Tentar de novo"; "Registro não encontrado" só se não existir).
- **Progresso em tempo real (WebSocket):** `recordProgressService` reconecta com backoff (1 s até 30 s) e, quando a internet volta, descarta o socket antigo (pode estar morto) e reconecta na hora com o backoff zerado.
- **Offline na Home/Histórico:** `useIsOnline` detecta a queda em tempo real. A Home mostra aviso amarelo de números parciais (só o que está no aparelho) e, ao voltar a internet com dados incompletos (começou offline, lista zerada ou falha), mostra esqueleto enquanto recarrega (`isRecovering` em `useHistoryRecords`). O filtro de localização avisa quando as áreas não carregaram.

## Performance Optimization Guidelines

### CRITICAL - List Rendering

- **ScrollView:** Use only for static content (images, cards without dynamic lists).
- **FlatList:** Use for dynamic, scrollable lists with data arrays.
- **Avoid:** Nested ScrollView + FlatList (causes layout thrashing).

**Pattern:**

```tsx
// ❌ Bad
<ScrollView>
  <FlatList data={...} />
</ScrollView>

// ✅ Good
<FlatList data={...} />
```

### HIGH - State Management

- **useReducer:** Use for complex form state with multiple inputs (password screens, edit profiles).
- **useState:** Use for simple, independent state values.
- **Atomic State:** Keep related form fields in single reducer for efficient updates.

**Pattern:**

```tsx
// ✅ Good - Atomic state
const [state, dispatch] = useReducer(reducer, {
	password,
	confirmPassword,
	showCurrentPassword,
})
```

## Acessibilidade

- Todo controle tocável precisa de `accessibilityRole` (`button`, `checkbox`, `radio`, `header`, `alert`) e, se não tiver texto próprio ou for repetido, de `accessibilityLabel` distinto (ex.: `Ver detalhes do registro 124`).
- Estados via `accessibilityState` (`selected`, `checked`, `expanded`, `busy`, `disabled`); inputs com `accessibilityLabel`; imagens com rótulo; ícones decorativos ocultos.
- Modais usam `accessibilityViewIsModal`; banners de erro usam `accessibilityRole="alert"` com `accessibilityLiveRegion`.
- `ActionButton`, `Button`, `TextField` e `ScreenHeader` já aplicam o básico; componentes novos devem seguir o mesmo padrão. Conferência rápida: `adb shell uiautomator dump` lista os `content-desc`.

## Agent / Developer Guidelines

- Manter tipagem TypeScript: `npm run typecheck` deve passar (strict mode ativo).
- Lint: `npm run lint` deve passar. Use `npm run lint -- --fix` para auto-fix.
- Saúde Expo: `npx expo-doctor` deve passar (warnings não-críticos são OK).
- Auditar dependências: `npm audit --omit=dev`. Os achados restantes vêm da cadeia de build (Babel, Metro, Expo CLI), fora do APK. O app está no Expo SDK 54; o upgrade de SDK é feito um por vez (hoje há SDKs até a 58) e foi adiado.

## 🏷️ Versionamento e releases

O app ainda não está na Play Store: o APK é entregue direto à equipe e às usuárias, então o número da versão é o que permite saber o que cada pessoa tem instalado.

### Modelo alvo (resumo)

```
feat/… fix/… chore/…  ──PR──►  develop  ──PR de release──►  main  ──(automático)──►  tag vX.Y.Z + APK assinado + GitHub Release
                               (acumula)   versão + changelog   (só o que foi entregue)
```

1. Todo trabalho passa pela `develop`: as branches abrem PR para ela e as mudanças se acumulam lá, sem gerar APK.
2. Quando o conjunto estiver pronto, prepara-se a release **na `develop`** (versão nos 3 lugares, `versionCode` e `CHANGELOG.md`) e abre-se **um** PR `develop` → `main`.
3. O merge na `main` é o que dispara a entrega: tag `vX.Y.Z`, build do APK assinado com o `app.keystore`, renomeação `guaravivo-X.Y.Z-vcN-release.apk` e GitHub Release com o APK anexado. **Nada é feito direto na `main`** (exceto correção urgente, ver abaixo).
4. **Situação hoje (2026-11-12):** a `develop` existe (foi avançada até a `main` em 2026-11-12; antes estava parada em março) e `main` e `develop` estão protegidas (ver "Proteção das branches"). A automação do passo 3 está em `.github/workflows/release.yml` (ver "Automação do passo 3"); já foi executada com sucesso: a `v0.1.2` (2026-11-12) foi o primeiro release gerado por ela, e o ambiente `release` e os Secrets já existem. O passo 3 manual (ver "Fluxo de release", passos 4 a 6) só vale se a automação estiver fora do ar.

- **Onde a versão vive (3 lugares, editados à mão e sempre juntos):** `app.config.js` (`version`), `package.json` (`version`) e `android/app/build.gradle` (`versionName` e `versionCode`). Esquecer um deles gera APK com número inconsistente.
- **Semver (`MAJOR.MINOR.PATCH`):** correção pequena sobe o PATCH (0.1.1 → 0.1.2); funcionalidade nova sobe o MINOR (0.1.x → 0.2.0); enquanto o app estiver em fase de testes com a equipe, fica em `0.x`.
- **`versionCode`:** sobe de 1 em 1 a cada APK entregue e nunca repete. O Android recusa instalar por cima um APK com `versionCode` menor ou igual ao instalado.
- **Só sobe versão ao entregar um APK.** Mudanças vão se acumulando sem mexer na versão. Entre builds, o teste é `npm run android:install` (assinado com `debug.keystore`, não conta como versão e **nunca** é entregue).
- **Branches (modelo `develop` → `main`):** a branch padrão do repositório continua `main`, então ao abrir PR **escolha a `develop` como base**.
  - `main` guarda só o que foi entregue e deve estar sempre pronta para gerar APK (`typecheck`, `lint` e `test` passando). Cada release é uma tag nela.
  - `develop` acumula as mudanças. Branches de trabalho (`feat/...`, `fix/...`, `chore/...`) saem da `develop` e abrem PR para ela.
  - Correção urgente em produção: branch a partir da `main`, PR para a `main`, tag de patch, e depois trazer a correção de volta para a `develop`.
  - **Proteção das branches (aplicada em 2026-11-12):** `main` só recebe mudança por PR (sem push direto, nem de admin), sem force-push e sem exclusão, e o PR precisa do check `checks` do CI (`.github/workflows/ci.yml`) verde. Nenhuma aprovação obrigatória (equipe pequena; quem abre pode mergear). `develop` aceita push, mas sem force-push e sem exclusão. O mesmo vale para a `main` dos outros repositórios públicos da organização (`guara-vivo-api`, `guara-vivo-worker`, `guara-vivo-identifier`, `website-equipe`) e para a `develop` da API; só a API e o front-mobile têm `develop`.
  - Como a `main` não aceita mais push direto, **mudança de documentação também vai por PR**. Só quem é admin do repositório altera essas regras e os Secrets do GitHub.
- **Fluxo de release:**
  1. Confirmar que `npm run typecheck`, `npm run lint` e `npm test` passam na `develop`.
  2. Na `develop`, mover o conteúdo de "Não lançado" do `CHANGELOG.md` para uma seção nova `## [X.Y.Z] - AAAA-MM-DD`, subir a versão nos 3 lugares e o `versionCode`, e conferir que `EXPO_PUBLIC_API_URL` aponta para `https://api.guaravivo.com.br` (é embutida no bundle no momento do build). Commit `chore(release): vX.Y.Z`.
  3. Abrir o PR de release `develop` → `main` e fazer o merge com **merge commit** (não squash: com squash a `develop` diverge da `main` e dá conflito na release seguinte).
  4. Com a `main` atualizada, criar a tag `vX.Y.Z` no commit do merge (`git tag vX.Y.Z`; só dar push da tag com autorização). O APK sai desse commit, para a tag apontar sempre para o que foi entregue.
  5. Build de publicação (assinado com `app.keystore`, sem `-PlocalDebugSign`) e conferência com `apksigner verify --print-certs`.
  6. Nome do APK: `guaravivo-X.Y.Z-vcN-release.apk`. Anexar à GitHub Release da tag, para ter o histórico de qual APK foi entregue.
  7. Os passos 4 a 6 são o que a automação abaixo faz sozinha depois do merge na `main`; só faça à mão se ela estiver fora do ar.
- **Automação do passo 3 (`.github/workflows/release.yml`, em uso desde a `v0.1.2`):** disparada **só** por `push` na `main`, nunca por PR (o repositório é público e o job usa a chave de assinatura).
  - Job `check` (sem segredos): lê a versão com `.github/scripts/release-info.sh` (falha se `package.json`, `app.config.js` e `build.gradle` divergirem), pula tudo se a tag `vX.Y.Z` já existir (merge de documentação, por exemplo), exige `versionCode` maior que o da última tag e exige a seção `## [X.Y.Z]` no `CHANGELOG.md`.
  - Job `build` (ambiente `release`): roda `typecheck`, `lint` e `jest`, decodifica o `app.keystore`, roda `assembleRelease` sem `-PlocalDebugSign` com `EXPO_PUBLIC_API_URL=https://api.guaravivo.com.br`, apaga o keystore do runner e confere com `apksigner` que o SHA-1 é o de release (`7A:75:BB:5A:…:6C:36`) e com `aapt2` que pacote, `versionCode` e `versionName` batem. Renomeia para `guaravivo-X.Y.Z-vcN-release.apk`, calcula o SHA-256 e cria a tag e a GitHub Release com as notas do `CHANGELOG.md`.
  - **Configuração manual no GitHub (só admin; já feita em 2026-11-12, só refazer se trocar a chave ou o repositório):** em Settings > Environments criar o ambiente `release`, com "Deployment branches" restrito a `main`, e nele os Secrets `ANDROID_KEYSTORE_BASE64` (o `app.keystore` em base64), `ANDROID_STORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` e `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`. **Use Secrets do ambiente, não do repositório:** segredo de repositório fica acessível a qualquer workflow de qualquer branch por quem tem push; o do ambiente só chega a jobs que rodam na `main`.
  - **Primeira execução (`v0.1.2`, 2026-11-12):** precisou de 4 tentativas, todas por defeitos na conferência do certificado do próprio workflow (Guara-vivo/guara-vivo-front-mobile#31, #33 e #35): o `apksigner` do runner Linux imprime `V2 Signer: certificate SHA-1 digest: …` (e não `Signer #1 …`, como no Windows) e a extração precisa tolerar prefixo e espaços. O APK sempre saiu assinado com a chave certa e nada foi publicado nas tentativas que falharam. Se uma execução falhar, veja `gh run view <id> --log-failed`; ajuste por PR para a `develop` e abra novo PR de release (a versão não muda enquanto a tag não existir).
  - **Duração:** de ~19 a ~26 min por execução (o `assembleRelease` compila as 4 ABIs: `arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`, e é o que mais pesa). O cache do npm funciona; o do Gradle só é salvo ao fim de uma execução bem-sucedida, então só passou a existir depois da `v0.1.2` (o ganho nos próximos releases ainda não foi medido).
  - `.github/CODEOWNERS` indica a revisão de `.github/`, `build.gradle`, `app.config.js` e `package*.json`. A aprovação do dono **não é obrigatória** enquanto só houver uma conta com acesso (ela travaria os próprios PRs); ligar "Require review from Code Owners" na proteção da `main` quando houver uma segunda pessoa.
- **`CHANGELOG.md`:** em português, uma seção por versão (Adicionado, Alterado, Corrigido). Toda mudança visível ao usuário entra em "Não lançado" no mesmo PR que a introduz.
- **Suporte:** ao investigar falha de uma usuária, confirme primeiro a versão instalada (Configurações > Apps > Guará Vivo). Instalar por cima só troca o app se o `versionCode` for maior.
- **Adiado, sem previsão (decisão da equipe em 2026-11-12):** derivar os 3 números da versão de uma fonte única (hoje seguem editados à mão nos 3 lugares) e reduzir as ABIs do build de release para encurtar o build (deixaria de atender aparelhos das ABIs removidas, por isso é decisão da equipe). A versão já aparece dentro do app (tela de entrar e "Sobre o app", desde a `v0.1.2`).

## Implementation Status by Category

### 🔐 Security (Recent)
- **API HTTPS enforcement:** `EXPO_PUBLIC_API_URL` obrigatório em produção. `apiClient.ts` bloqueia HTTP com erro claro.
- **Secure token storage:** `expo-secure-store` (Keychain/Keystore) implementado. `AsyncStorage` é fallback de migração apenas.
- **Error logging:** Condicionado a `__DEV__`. Produção não expõe detalhes sensíveis.

### 🚀 Performance (Recent)
- **Map optimization:** Removido `onRegionChangeComplete` que causava re-renders em pan/zoom.
- **Request cancellation:** `AbortController` suporta `signal` em `apiFetch()`, cancelando requests em unmount.
- **Date validation:** Parser rejeita overflow (`32/01`, `30/02`, etc.) no histórico.

### 🎨 UI/Layout (Recent)
- **Histórico:** busca com filtros/ordenação como botões secundários lado a lado; cartão compacto (área e quantidade na mesma linha, chips + "VER DETALHES" no rodapé); `React.memo` no cartão e no cabeçalho, callbacks estáveis, debounce de 250 ms na busca e `FlatList` com `initialNumToRender`/`windowSize`.
- **Registrar:** botões Cancelar (contorno) e Salvar ficam num rodapé fixo (`registerFooter`) acima da tab bar; comportamentos em grade 2×2 com estado selecionado visível; sem título redundante no cartão.
- **Boas-vindas/Splash/Sobre:** usam `Logo Simplificada Fonte Escura.png` sobre fundo claro; a splash nativa também é clara (`app.config.js` e `android/app/src/main/res/values/colors.xml`).
- **Redesign visual (branch `redesign-visual`):** abas Início/Mapas/Registrar/Histórico/Perfil com botão central de registro. Início (`HomeScreen`: saudação, CTA, 3 métricas via `utils/homeSummary.ts`, último avistamento, estado de sincronia). Histórico agrupado por dia (`utils/dayGroups.ts`, `dayLabels.ts`). Registrar em 3 passos (`utils/registerSteps.ts`, `RegisterStepHeader`, `DatePickerSheet` + `utils/monthGrid.ts`). Mapas em tela cheia com chips de camada, `LastUpdatedPill` e botões laterais (adicionar área só admin, localizar, atualizar); marcadores do mapa são **PNG estáticos** em @1x/2x/3x (`user-location*.png`, `zone-{feeding,nest}[-selected|-muted].png`, `record-marker[-selected].png`), porque marcadores de `View` customizados saem cortados no Android; `ZoneMarker` usa a versão cinza (`dimmed`) quando outra área está selecionada. Detalhe com hero + `AiAnalysisCard`/`RecordLocationCard`; análise por imagem em modal de tela cheia com `ConfidenceBanner` e barras de acurácia (`utils/confidence.ts`; abaixo de 70% mostra aviso). Perfil com `Avatar` (`utils/initials.ts`), grupos Conta/Sobre e telas de ajustes com rodapé fixo (`styles/settings.ts`).
- **Mapa:** animação de destaque da linha de registro só com `opacity` (driver nativo); contagem de áreas no card CAMADA.
- **Carregamento:** use `Skeleton`/`SkeletonImage` (e `RecordDetailSkeleton`) em vez de spinners ou texto "Carregando...". O mapa mostra a pílula "Carregando mapa…". Skeletons só animam opacidade (driver nativo).
- **Filtros do histórico:** folha em `HistoryFilterModal` com seções em cartões (`styles/filters.ts`), período escolhido no `DatePickerSheet` (sem digitar; a folha é montada só quando aberta e recebe `title`), comportamentos em chips. `DatePickerSheet` deve ser montado só ao abrir (abre no mount e avisa por `onClose`).
- **Botões:** `ActionButton` com `fullWidth={false}` deixa o conteúdo acompanhar o texto (sem isso o texto quebrava em duas linhas).
- **Ícone do app:** guará (SVG fornecido pelo usuário) sobre fundo azul `#7FA8E6` (`icon.png`, `adaptive_icon.png` só com o pássaro para a área segura, `adaptiveIcon.backgroundColor` em `app.config.js`, `iconBackground` em `res/values/colors.xml` e os `mipmap-*/ic_launcher*.webp` gerados à mão porque `android/` é editado à mão).

### ✨ Code Quality (Recent)
- **Type safety:** Todas instâncias de `any` removidas. Tipagem concreto (`HistoryFilterState`, `React.ErrorInfo`, `IoniconName`).
- **Error handling:** `ErrorBoundary` com logs seguros.
- **Modular architecture:** Hooks, Services, Screens e componentes por domínio separados. Meta de 200–300 linhas por arquivo atingida (telas grandes foram divididas em hook + utilitários + componentes); mantenha assim.

### 📋 Previous Features
- Shared `Header` component with blue bar, uppercase title, optional right action.
- Centralized styles em `src/styles/` (agregados por `appStyles.ts`) + `theme.ts`.
- `Button` component reusável (elimina duplicação).
- Regra de senha única em `utils/passwordRules.ts` (cadastro e troca de senha).
- Real API auth com token refresh automático.
- Real image selection + upload com `expo-image-picker`.
- Pull-to-refresh nativo (`RefreshControl`) no histórico e no detalhe do registro.
- Cache em memória para records/details com deduplicação.
- Clickable record images com `RecordImageDetailModal`.
- Per-image analysis summary + per-individual detection details.

### ⚠️ Known Issues & Next Steps
- **Telas ainda sem backend:** cadastro (**fechado**: o `POST /users` foi fechado na API e "Criar conta" mostra `RegistrationClosedModal` em vez de abrir `RegisterEmail`/`RegisterPassword`, que seguem no `AuthStack` sem entrada para reabrir depois), `ChangePasswordScreen`, `EditProfileScreen`, "Recuperar senha" e as preferências de `NotificationsScreen` são apenas visuais.
- **Keystore de release:** o `app.keystore` atual é diferente do que ficou no histórico público do git (confirmado pelo usuário em 2026-11-11), então não precisa gerar outro para publicar. Guarde-o fora do repositório (`android/app/app.keystore` está no `.gitignore`) e faça cópia segura: perdê-lo impede atualizar o app já instalado.
- **Senha do `app.keystore`:** funciona (build de publicação assinado em 2026-11-10). Se o shell não tiver as variáveis `ANDROID_STORE_PASSWORD`/`ANDROID_KEY_ALIAS`/`ANDROID_KEY_PASSWORD`, o build de publicação falha; o fluxo de teste usa `-PlocalDebugSign`.
- **Chave do Google Maps:** lida de `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (variável de ambiente ou `.env`) pelo Gradle via `manifestPlaceholders`. Restringir por pacote e SHA-1 no Google Cloud.
- **`android/` é versionado e editado à mão:** ao rodar `expo prebuild`, revisar o diff do `AndroidManifest.xml`, a flag `-PlocalDebugSign` em `app/build.gradle` e `splashscreen_background` em `res/values/colors.xml`.
- **Vulnerabilidades (`npm audit`):** vindas da cadeia de build (transitivas, fora do APK); só somem com upgrade do Expo SDK (adiado; subir um SDK por vez, testando mapa e `android/` a cada passo).
- **1 metro.config.js warning:** Não-crítico; atualizar para extends `expo/metro-config` se necessário.
