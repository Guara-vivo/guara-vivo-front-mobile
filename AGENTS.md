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
- **Mapa:** O mapa já remove POIs comerciais, usa marcadores personalizados neutros e exibe badge de contagem por camada.
- **Map Layers:** `all` mostra o total visível, `feeding` mostra pontos vermelhos e `nests` mostra casas azuis.
- **API URL:** `src/services/apiClient.ts` define a base URL por plataforma. Android usa o IP local configurado para acessar a API na rede.
- **Auth:** Login salva `access_token` e `refresh_token` via `src/services/tokenStorage.ts`. `apiFetch` renova token automaticamente em `401` usando `POST /users/refresh` e repete a requisição original.
- **Records API:** Histórico usa `GET /records/summary`; detalhe usa `GET /records/{record_id}/detail`; upload usa `POST /records/upload` com `FormData` sem definir manualmente `Content-Type`.
- **Record Detail Modal:** `src/components/RecordImageDetailModal.tsx` shows per-image analysis with image preview, analysis status, technical accuracy summary, and per-individual detection details.
- **Per-image detections:** `RecordDetailItem.image_analyses` contains `detections` filtered by `analysis_image_id`; preserve `raw_detection` from the API to display `cor`, `fase_vida`, and `acuracia` fields.
- **Accuracy fields:** The modal expects `raw_detection.acuracia.deteccao_yolo`, `classificacao_guara`, `classificacao_cor`, and `classificacao_fase_vida` as decimal values and formats them as percentages.
- **Cache:** `src/services/recordsCache.ts` mantém cache em memória de histórico e detalhes. Invalide com `invalidateRecordsCache()` após upload ou mudanças nos registros.
  - **Important:** `/records/summary` (resumos) nunca devem ser salvos como detalhe completo. Apenas `/records/{id}/detail` (com `image_analyses`) deve ser cacheado como detalhe. O modal de análise de imagens usa `image_analyses` e mostraria "Aguardando análise..." se alimentado só com resumo.

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

- Manter tipagem TypeScript; rode `npm run typecheck` após mudanças.
- Rode `npm run lint` e, se apropriado, `npm run lint -- --fix` após grandes linhas de códigos escritas.

## Recent Changes by Agent

- Implemented shared `Header` component in `src/components/Header.tsx` with a full-width blue bar, rounded top corners, uppercase white title, and optional right-side action.
- Centralized the Header styling in `src/styles/appStyles.ts` using `appHeaderTitle` for the shared title and `headerRight` for trailing actions.
- Standardized colors in `src/styles/appStyles.ts` to use `src/constants/theme.ts`.
- Centralized shared base styles (`baseCard`, `basePrimaryButton`, `basePrimaryButtonLabel`) and added `palette` aliases.
- Replaced hardcoded hex literals with existing theme tokens; did not add new tokens to `src/constants/theme.ts` (reverted prior additions).
- Fixed syntax errors and balanced braces in `src/styles/appStyles.ts` that caused widespread type failures.
- Restored `src/constants/theme.ts` to original token set (no new tokens added).
- Ran `npm run typecheck` — passed.
- Ran `npm run lint` — passed.
- Created ErrorBoundary component for error handling.
- Created Button reusable component to eliminate duplication.
- Created usePasswordValidation hook with password complexity rules.
- Moved hardcoded record details to recordDetails.ts.
- Implemented password validation in ChangePasswordScreen.
- Fixed TypeScript type issues throughout the codebase.
- **Optimized list rendering:** Replaced nested ScrollView+FlatList with FlatList for HistoryScreen.
- **Optimized state management:** Implemented useReducer for atomic state in ChangePasswordScreen and EditProfileScreen.
- **React Native performance best practices:** ScrollView used for static content, FlatList for dynamic lists.
- Integrated real API auth, token persistence, automatic refresh token flow, and API logout.
- Removed mock records and mock record details from app runtime.
- Added real image selection with `expo-image-picker`, image previews, remove buttons, upload loading feedback, and cache invalidation after successful upload.
- Added lightweight frontend cache for records and record details with request deduplication.
- History and record detail screens use backend aggregate endpoints (`/records/summary`, `/records/{id}/detail`) and support pull-to-refresh.
- Added animated pull-to-refresh movement via `usePullRefreshAnimation` while keeping native `RefreshControl`.
- Added clickable record detail images with `RecordImageDetailModal`.
- Added per-image technical summary and per-individual detection details for plumage, life stage, and accuracy percentages.
- Preserved `raw_detection` in record detail mapping so the modal can render identifier metadata without extra API calls.
- **Fixed image analysis modal:** Corrected cache logic to always load full detail (`/records/{id}/detail`) before showing image analysis modal; prevents showing "Aguardando análise..." with completed analyses.
