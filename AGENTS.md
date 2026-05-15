# 📘 Opencode Agent Instructions for pi_namorada_linda

## 🚀 Core Workflow

- **Initialization:** O projeto é um aplicativo móvel construído com **React Native/Expo**. O ponto de entrada principal é `expo/AppEntry`.
- **Development Command:** Para iniciar o ambiente de desenvolvimento, use `npm start` ou `expo start`.
- **Validation:** Os comandos principais do projeto são `npm run lint` e `npm run typecheck`.
- **Testing:** Testes devem seguir as convenções do Expo/React Native. Verifique a necessidade de mocking específico do Expo antes de testar componentes nativos.

## 📂 Codebase Structure

- **Entrypoints:** A lógica de telas, componentes e utilitários para o mobile deve ser procurada e manipulada dentro de `src`.
- **Separação:** O diretório `src/app` foi removido, pois continha componentes e telas obsoletos da web.
- **Main App:** A navegação principal fica em `src/GuaraVivoApp.tsx`.
- **Navigation:** Os estados de tela são definidos por `ScreenId` em `src/types/navigation.ts`.
- **Screens:** As telas principais ficam em arquivos individuais em `src/screens/` (ex.: `SplashScreen.tsx`, `WelcomeScreen.tsx`, `LoginScreen.tsx`, `RegisterEmailScreen.tsx`, `RegisterPasswordScreen.tsx`, `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Mapa:** A visualização do mapa fica em `src/components/MapLibreMapView.tsx`, com a seleção de camadas controlada em `src/screens/MapsScreen.tsx`.
- **Estilos:** O visual do app fica centralizado em `src/styles/appStyles.ts` e `src/constants/theme.ts`.
- **Dados:** Os registros mockados e tipos do mapa ficam em `src/config/map.ts` e `src/data/mockRecords.ts`.
- **Assets:** As logos usadas no app ficam em `src/assets/images`.

- **Nota:** Arquivos combinados anteriores como `mainScreens.tsx`, `profileScreens.tsx` e `authScreens.tsx` foram divididos em arquivos por tela para facilitar manutenção.

### Arquitetura Modular (atual)

- **Components:** `src/components/` contém componentes reutilizáveis e pequenos componentes por domínio (ex.: `auth/`, `history/`).
- **Screens:** Cada tela agora é um arquivo único em `src/screens/` (ex.: `HomeScreen.tsx`, `HistoryScreen.tsx`, `MapsScreen.tsx`, `RecordDetailScreen.tsx`, `RegisterScreen.tsx`, `ProfileScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `NotificationsScreen.tsx`, `AboutScreen.tsx`).
- **Hooks:** Lógica reutilizável foi extraída para `src/hooks/` (ex.: `useHistoryFilters.ts`).
- **Services:** Abstrações de dados e APIs locais em `src/services/` (ex.: `recordsService.ts`).
- **Styles:** `src/styles/appStyles.ts` mantém estilos globais; prefira mover estilos muito grandes para arquivos por domínio.
- **Guideline:** Evitar arquivos acima de 200–300 linhas para facilitar leitura e agentes locais.

## 🛠️ Constraints & Quirks

- **Framework:** A plataforma é estritamente **React Native**. Evite qualquer lógica ou importação que dependa de APIs web (DOM, etc.).
- **Styling:** Os estilos e a aparência são gerenciados localmente em `src/styles/appStyles.ts` e `src/constants/theme.ts`.
- **Expo Setup:** O app usa `expo-font` e `expo-location` no `app.json`. A permissão de localização está configurada para centralizar o mapa no aparelho.
- **Platform:** `app.json` define orientação portrait, tema claro, suporte a tablet no iOS e adaptive icon no Android.
- **Scripts Atuais:** Use `npm start`, `npm run lint`, `npm run lint:fix` e `npm run typecheck`.
- **Mapa:** O mapa já remove POIs comerciais, usa marcadores personalizados neutros e exibe badge de contagem por camada.
- **Map Layers:** `all` mostra o total visível, `feeding` mostra pontos vermelhos e `nests` mostra casas azuis.

## Agent Behavior Rules

- Use short sentences (3–6 words when possible).
- No introductions, greetings, or filler.
- Execute tools first.
- Show result, then stop.
- Do not narrate actions.
- Remove unnecessary articles and helper words.
- Prefer direct phrasing.
- Example:
  - "Fix code"
  - Not: "I will fix the code"

## Agent / Developer Guidelines

- **Preserve negócio:** Não alterar regras de negócio ou validações existentes enquanto refatorar.
- **Tipagem:** Manter tipagem TypeScript; rode `npm run typecheck` após mudanças.
- **Validação:** Rode `npm run lint` e, se apropriado, `npm run lint -- --fix` antes de abrir PR.
- **Small commits:** Faça commits pequenos com descrições claras ao extrair componentes ou hooks.

## Response Style

- Minimal output.
- No motivational text.
- No explanations unless requested.
- No step-by-step reasoning unless requested.
- Prioritize action over commentary.

## Tool Usage

- Call tools immediately when needed.
- Avoid asking confirmation for obvious actions.
- Return concise summaries after execution.
- Stop after completing requested task.
