# 📘 Opencode Agent Instructions for pi_namorada_linda

## 🚀 Core Workflow

- **Initialization:** O projeto é um aplicativo móvel construído com **React Native/Expo**. O ponto de entrada principal é `expo/AppEntry`.
- **Development Command:** Para iniciar o ambiente de desenvolvimento, use `npm start` ou `expo start`.
- **Validation:** Os comandos principais do projeto são `npm run lint` e `npm run typecheck`.
- **Testing:** Testes devem seguir as convenções do Expo/React Native. Verifique a necessidade de mocking específico do Expo antes de testar componentes nativos.

## 📂 Codebase Structure

- **Entrypoints:** A lógica de telas, componentes e utilitários para o mobile deve ser procurada e manipulada dentro de `src/native`.
- **Separação:** O diretório `src/app` foi removido, pois continha componentes e telas obsoletos da web.
- **Main App:** A navegação principal fica em `src/native/GuaraVivoApp.tsx`.
- **Navigation:** Os estados de tela são definidos por `ScreenId` em `src/native/types/navigation.ts`.
- **Screens:** As telas principais ficam em `src/native/screens/authScreens.tsx`, `src/native/screens/mainScreens.tsx` e `src/native/screens/profileScreens.tsx`.
- **Mapa:** A visualização do mapa fica em `src/native/components/MapLibreMapView.tsx`, com a seleção de camadas controlada em `src/native/screens/mainScreens.tsx`.
- **Estilos:** O visual do app fica centralizado em `src/native/styles/appStyles.ts` e `src/native/constants/theme.ts`.
- **Dados:** Os registros mockados e tipos do mapa ficam em `src/native/config/map.ts` e `src/native/data/mockRecords.ts`.
- **Assets:** As logos usadas no app ficam em `src/native/assets/images`.

## 🛠️ Constraints & Quirks

- **Framework:** A plataforma é estritamente **React Native**. Evite qualquer lógica ou importação que dependa de APIs web (DOM, etc.).
- **Styling:** Os estilos e a aparência são gerenciados localmente em `src/native/styles/appStyles.ts` e `src/native/constants/theme.ts`.
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
