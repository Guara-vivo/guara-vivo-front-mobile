# 📘 Opencode Agent Instructions for pi_namorada_linda

## 🚀 Core Workflow
*   **Initialization:** O projeto é um aplicativo móvel construído com **React Native/Expo**. O ponto de entrada principal é Expo/AppEntry.
*   **Development Command:** Para iniciar o ambiente de desenvolvimento, use `npm start` ou `expo start`.
*   **Testing:** O teste de unidade ou integração deve seguir as convenções do Expo/React Native (geralmente `npm test` ou comandos específicos do Jest/Jest-Expo).

## 📂 Codebase Structure
*   **Entrypoints:** A lógica de telas, componentes e utilitários para o mobile deve ser procurada e manipulada dentro do diretório `src/native`.
*   **Separação:** O diretório `src/app` foi removido, pois continha componentes e telas obsoletos da web.

## 🛠️ Constraints & Quirks
*   **Framework:** A plataforma é estritamente **React Native**. Evite qualquer lógica ou importação que dependa de APIs web (DOM, etc.).
*   **Styling:** Os estilos e a aparência são gerenciados localmente em `src/native/styles/appStyles.ts` e `src/native/constants/theme.ts`.
*   **Testes:** Sempre verificar a necessidade de *mocking* específico do Expo para qualquer teste de unidad e utilizar o comando npx expo-doctor para identificar qualquer problema após grandes alteracoes.

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