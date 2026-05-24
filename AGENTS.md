# 📘 Opencode Agent Instructions for guara-vivo-front-mobile

## 🚀 Core Workflow

- **Initialization:** O projeto é um aplicativo móvel construído com **React Native/Expo**. O ponto de entrada principal é `expo/AppEntry`.
- **Development Command:** Para iniciar o ambiente de desenvolvimento, use `npm start` ou `expo start`.
- **Validation:** Os comandos principais do projeto são `npm run lint`, `npm run typecheck` e `npx expo-doctor`.
- **Testing:** Testes devem seguir as convenções do Expo/React Native. Verifique a necessidade de mocking específico do Expo antes de testar componentes nativos.

## 📂 Codebase Structure

- **Entrypoints:** A lógica de telas, componentes e utilitários para o mobile deve ser procurada e manipulada dentro de `src`.
- **Separação:** O diretório `src/app` foi removido, pois continha componentes e telas obsoletos da web.
- **Main App:** A navegação principal fica em `src/GuaraVivoApp.tsx`.
- **Navigation:** Os estados de tela são definidos por `ScreenId` em `src/types/navigation.ts`.
- **Screens:** As telas principais ficam em arquivos individuais em `src/screens/` (ex.: `SplashScreen.tsx`, `WelcomeScreen.tsx`, `LoginScreen.tsx`, `RegisterEmailScreen.tsx`, `RegisterPasswordScreen.tsx`, `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Mapa:** A visualização do mapa fica em `src/components/MapLibreMapView.tsx`, com a seleção de camadas controlada em `src/screens/MapsScreen.tsx`.
- **Estilos:** O visual do app fica centralizado em `src/styles/appStyles.ts` e `src/constants/theme.ts`.
- **Dados/API:** Os registros reais vêm da API por `src/services/recordsService.ts` e `src/services/recordsApi.ts`. Tipos reais ficam em `src/types/api.ts`; formatadores em `src/utils/recordFormatters.ts`; opções de comportamento em `src/constants/behaviors.ts`.
- **Assets:** As logos usadas no app ficam em `src/assets/images`.

- **Nota:** Arquivos combinados anteriores como `mainScreens.tsx`, `profileScreens.tsx` e `authScreens.tsx` foram divididos em arquivos por tela para facilitar manutenção.

### Arquitetura Modular (atual)

- **Components:** `src/components/` contém componentes reutilizáveis e pequenos componentes por domínio (ex.: `auth/`, `history/`, `common`). Componentes padrão: `Button`, `ErrorBoundary`, `MapLibreMapView`, `BottomNavigation`.
- **Screens:** Cada tela agora é um arquivo único em `src/screens/` (ex.: `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Hooks:** Lógica reutilizável foi extraída para `src/hooks/` (ex.: `useHistoryFilters.ts`, `usePasswordValidation.ts`, `usePullRefreshAnimation.ts`).
- **Services:** Integração de API e cache ficam em `src/services/` (ex.: `apiClient.ts`, `authService.ts`, `recordsApi.ts`, `recordsCache.ts`, `recordsService.ts`, `tokenStorage.ts`).
- **Styles:** `src/styles/appStyles.ts` mantém estilos globais; prefira mover estilos muito grandes para arquivos por domínio.
- **Guideline:** Evitar arquivos acima de 200–300 linhas para facilitar leitura e agentes locais.
- **Header padrão:** Use `src/components/Header.tsx` nas telas principais; mantenha o estilo compartilhado em `appStyles.header`, `appHeaderTitle` e `headerRight` para preservar a faixa azul em largura total.

## 🛠️ Constraints & Quirks

- **Framework:** A plataforma é estritamente **React Native**. Evite qualquer lógica ou importação que dependa de APIs web (DOM, etc.).
- **Styling:** Os estilos e a aparência são gerenciados localmente em `src/styles/appStyles.ts` e `src/constants/theme.ts`.
- **Expo Setup:** O app usa `expo-font`, `expo-location` e `expo-image-picker` no `app.json`. Localização centraliza o mapa e envia coordenadas no registro; image picker seleciona fotos do avistamento.
- **Platform:** `app.json` define orientação portrait, tema claro, suporte a tablet no iOS e adaptive icon no Android.
- **Scripts Atuais:** Use `npm start`, `npm run lint`, `npm run lint:fix` e `npm run typecheck`.
- **Mapa:** Remove POIs comerciais, usa marcadores personalizados neutros, exibe badge de contagem. **Sem re-renders em pan/zoom** (otimização performance). Mapas carregados de `MAP_RECORDS` em dev.
- **Map Layers:** `all` = total visível, `feeding` = pontos vermelhos (alimentação), `nests` = casas azuis (ninhos).
- **API URL:** `src/services/apiClient.ts` usa `EXPO_PUBLIC_API_URL` (variável de ambiente). Em dev: fallback para `192.168.18.145:8001` (Android) ou `localhost:8001` (iOS). Em produção: requer HTTPS, erro se HTTP.
- **Auth:** Login salva `access_token` e `refresh_token` via `src/services/tokenStorage.ts` usando **Keychain (iOS)** e **Keystore (Android)** via `expo-secure-store`. Fallback automático de `AsyncStorage` para migração (apenas leitura). `apiFetch` renova token em `401` usando `POST /users/refresh` e repete requisição.
- **Records API:** Histórico usa `GET /records/summary`; detalhe usa `GET /records/{record_id}/detail`; upload usa `POST /records/upload` com `FormData` sem definir manualmente `Content-Type`. **Requests suportam AbortSignal** para cancelamento em unmount (economiza bateria/dados).
- **Record Detail Modal:** `src/components/RecordImageDetailModal.tsx` shows per-image analysis with image preview, analysis status, technical accuracy summary, and per-individual detection details.
- **Per-image detections:** `RecordDetailItem.image_analyses` contains `detections` filtered by `analysis_image_id`; preserve `raw_detection` from the API to display `cor`, `fase_vida`, and `acuracia` fields.
- **Accuracy fields:** The modal expects `raw_detection.acuracia.deteccao_yolo`, `classificacao_guara`, `classificacao_cor`, and `classificacao_fase_vida` as decimal values and formats them as percentages.
- **Cache:** `src/services/recordsCache.ts` mantém cache em memória (TTL: 5 minutos). Invalide com `invalidateRecordsCache()` após upload.
  - ⚠️ **Importante:** `/records/summary` (resumos) NUNCA devem ser salvos como detalhe. Apenas `/records/{id}/detail` (com `image_analyses`) é cacheado como detalhe. Modal de análise usa `image_analyses` e mostraria erro se alimentado com resumo.

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

## Agent / Developer Guidelines

- Manter tipagem TypeScript: `npm run typecheck` deve passar (strict mode ativo).
- Lint: `npm run lint` deve passar. Use `npm run lint -- --fix` para auto-fix.
- Saúde Expo: `npx expo-doctor` deve passar (warnings não-críticos são OK).
- Auditar dependências: `npm audit --omit=dev` (11 vulnerabilidades moderadas em Expo 54; upgrade para 56 resolve).

## Implementation Status by Category

### 🔐 Security (Recent)
- **API HTTPS enforcement:** `EXPO_PUBLIC_API_URL` obrigatório em produção. `apiClient.ts` bloqueia HTTP com erro claro.
- **Secure token storage:** `expo-secure-store` (Keychain/Keystore) implementado. `AsyncStorage` é fallback de migração apenas.
- **Error logging:** Condicionado a `__DEV__`. Produção não expõe detalhes sensíveis.

### 🚀 Performance (Recent)
- **Map optimization:** Removido `onRegionChangeComplete` que causava re-renders em pan/zoom.
- **Request cancellation:** `AbortController` suporta `signal` em `apiFetch()`, cancelando requests em unmount.
- **Date validation:** Parser rejeita overflow (`32/01`, `30/02`, etc.) no histórico.

### ✨ Code Quality (Recent)
- **Type safety:** Todas instâncias de `any` removidas. Tipagem concreto (`HistoryFilterState`, `React.ErrorInfo`, `IoniconName`).
- **Error handling:** `ErrorBoundary` com logs seguros.
- **Modular architecture:** Componentes < 300 linhas. Hooks, Services, Screens bem separados.

### 📋 Previous Features
- Shared `Header` component with blue bar, uppercase title, optional right action.
- Centralized styles em `appStyles.ts` + `theme.ts`.
- `Button` component reusável (elimina duplicação).
- `usePasswordValidation` hook com regras de complexidade.
- Real API auth com token refresh automático.
- Real image selection + upload com `expo-image-picker`.
- Pull-to-refresh animado via `usePullRefreshAnimation`.
- Cache em memória para records/details com deduplicação.
- Clickable record images com `RecordImageDetailModal`.
- Per-image analysis summary + per-individual detection details.

### ⚠️ Known Issues & Next Steps
- **11 dependency vulnerabilities (Expo 54):** Requerem upgrade para Expo 56.0.4.
- **2 unused variables (RecordImageDetailModal):** Cleanup opcional.
- **1 metro.config.js warning:** Não-crítico; atualizar para extends `expo/metro-config` se necessário.
