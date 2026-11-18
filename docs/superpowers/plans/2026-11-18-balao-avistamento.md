# Balão do avistamento (mapa do admin) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** No mapa do admin, tocar num registro abre um balão ancorado nele (autor, número, quantidade de guarás, data e hora); tocar no balão abre o detalhe.

**Architecture:** O balão é uma `View` desenhada por cima do `MapView` dentro de `MapLibreMapView`, posicionada com `mapRef.pointForCoordinate`. A conta (acima/abaixo, margens) é uma função pura testada; o texto é um componente só de apresentação; a regra "folha de zona aberta continua como antes" fica numa função pura em `adminMapRecords.ts`. Só o admin recebe a prop `recordBalloon`; sem ela o mapa se comporta como hoje.

**Tech Stack:** Expo SDK 54, React Native 0.81 (New Architecture), `react-native-maps` 1.20.1, TypeScript com tabs e arquivos CRLF, jest-expo (só `**/?(*.)+(test).ts`, sem teste de componente), i18n `map` pt-BR/en-US com teste de paridade de chaves.

**Spec:** `docs/superpowers/specs/2026-11-17-balao-avistamento-design.md` (aprovado em 2026-11-18)

**Base:** branch `feat/balao-avistamento-admin`, empilhada sobre `feat/agrupamento-mapa-admin` (PR #48), que está sobre `feat/admin-mapa-todos-registros` (PR #47).

## Global Constraints

- Só no mapa do admin (`markerViewerId !== undefined`); contas comuns seguem exatamente como hoje.
- Conteúdo do balão: autor (`author_name`), número (`#182`), quantidade de guarás, data e hora. Sem foto, comportamento, status ou botões.
- Sem chamada nova na API; os quatro dados já estão em `MapZoneRecordRead`.
- Visual só com tokens de `src/constants/theme.ts` e `elevation.overlay`/`overlayShadow` (sem cores literais); textos em pt-BR **e** en-US (`src/i18n/locales/*/map.ts`).
- Data e hora com `formatDateAtTime` (`src/utils/recordFormatters.ts`); quantidade com `countLabel` (`src/utils/countLabel.ts`).
- Margem lateral mínima de 16 dp (`spacing.md`); o balão nunca fica sob os chips de camada nem sob o selo "N áreas" (até 104 dp do topo da área do mapa).
- Com a folha de uma zona aberta e o registro na lista dela, o toque continua destacando e rolando até o registro (sem balão).
- Toque em grupo de marcadores continua só aproximando o mapa, sem balão.
- Acessibilidade: o balão é um botão (`accessibilityRole="button"`) com rótulo "Abrir detalhes do registro N".
- Arquivos do repositório usam tabs e CRLF; novos arquivos podem nascer LF (o Git normaliza), mas edições em arquivos existentes preservam o fim de linha.
- `npm run typecheck`, `npm run lint` e `npm test` verdes antes de cada commit. Mensagem de commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Entradas e condições que o spec implica e nenhuma tarefa de UI cobre sozinha (cada uma tem teste na tarefa dona):

1. Marcador colado na borda esquerda ou direita da tela: o balão desliza para dentro das margens e a pontinha continua apontando para o marcador (Task 1).
2. Marcador perto do topo ou sob os chips: o balão vai para baixo do marcador (Task 1).
3. Marcador em cima e embaixo sem espaço (mapa muito baixo): escolhe o lado com mais espaço, em vez de sair da área (Task 1).
4. Autor com nome muito longo ou vazio: não quebra o layout; vazio mostra só o número e o resto (Task 3).
5. Registro tocado some da lista (recarga do admin, troca de camada) com o balão aberto: o balão fecha sozinho (Task 4).

---

### Task 1: Posição do balão (função pura)

**Files:**
- Create: `src/utils/balloonPlacement.ts`
- Test: `src/utils/balloonPlacement.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  ```ts
  export const BALLOON_MARGIN_DP = 16        // margem lateral mínima
  export const BALLOON_TOP_INSET_DP = 104    // chips (até 52) + selo "N áreas" (até ~96) + respiro
  export const BALLOON_POINTER_DP = 8        // altura da pontinha
  export const BALLOON_MARKER_RADIUS_DP = 23 // metade do marcador (46 dp)

  export type BalloonPlacement = {
  	left: number          // x da borda esquerda do balão, no container
  	top: number           // y da borda de cima do balão, no container
  	pointerLeft: number   // x do centro da pontinha, relativo à borda esquerda do balão
  	side: 'above' | 'below'
  }

  export function placeBalloon(input: {
  	anchor: { x: number; y: number }          // centro do marcador, em dp, no container
  	balloon: { width: number; height: number }
  	container: { width: number; height: number }
  }): BalloonPlacement
  ```

Regra: o balão fica centralizado no x do marcador e limitado a `[BALLOON_MARGIN_DP, container.width - BALLOON_MARGIN_DP - balloon.width]`. "Acima" = `top = anchor.y - BALLOON_MARKER_RADIUS_DP - BALLOON_POINTER_DP - balloon.height`; "abaixo" = `top = anchor.y + BALLOON_MARKER_RADIUS_DP + BALLOON_POINTER_DP`. Prefere acima; vai para baixo se `top` acima for menor que `BALLOON_TOP_INSET_DP`. Se nenhum lado cabe (acima fica sob o limite e abaixo passa de `container.height`), escolhe o lado com mais espaço livre, medido como `anchor.y - BALLOON_MARKER_RADIUS_DP` (acima) contra `container.height - (anchor.y + BALLOON_MARKER_RADIUS_DP)` (abaixo); em empate, acima. `pointerLeft = anchor.x - left`, limitado para a pontinha não passar dos cantos arredondados (mínimo 16, máximo `balloon.width - 16`).

- [ ] **Step 1: Escrever os testes (vermelhos).** Container 360×640, balão 232×60. Casos, cada um um `it`:
  - `places the balloon centered above a marker in the middle of the map`: âncora (180, 400) → `side 'above'`, `left` 64, `top` 400-23-8-60 = 309, `pointerLeft` 116.
  - `slides inside the left margin and keeps the pointer on the marker`: âncora (10, 400) → `left` 16, `pointerLeft` 16 (limitado ao mínimo).
  - `slides inside the right margin and keeps the pointer on the marker`: âncora (355, 400) → `left` 360-16-232 = 112, `pointerLeft` 216 (= `balloon.width - 16`).
  - `goes below the marker when there is no room above (near the top and the chips)`: âncora (180, 120) → `side 'below'`, `top` 120+23+8 = 151.
  - `goes below when the room above would end under the chips`: âncora (180, 190) → acima daria `top` 99 < 104 → `side 'below'`.
  - `picks the side with more room when neither fits`: container 360×140. Com âncora (180, 80): em cima daria `top` -11 (< 104) e embaixo terminaria em 171 (> 140), então nenhum cabe; espaço livre acima 57 (`anchor.y - 23`) contra 37 abaixo (`140 - (anchor.y + 23)`) → `side 'above'`. Com âncora (180, 60): acima 37, abaixo 57 → `side 'below'`.
  - `never returns a balloon wider than the container allows`: container de 240 de largura e balão de 232: `left` = 16 (a margem vence, sem lançar erro).
- [ ] **Step 2: Rodar e ver falhar.** `npx jest src/utils/balloonPlacement.test.ts` → FAIL: `Cannot find module './balloonPlacement'`.
- [ ] **Step 3: Implementar `placeBalloon` e as constantes** em `src/utils/balloonPlacement.ts` conforme a regra acima.
- [ ] **Step 4: Rodar e ver passar.** `npx jest src/utils/balloonPlacement.test.ts` → 7 passed.
- [ ] **Step 5: Commit.** `git add src/utils/balloonPlacement.ts src/utils/balloonPlacement.test.ts` e `feat(mapa): cálculo da posição do balão do avistamento`.

---

### Task 2: Regra de quando mostrar o balão

**Files:**
- Modify: `src/utils/adminMapRecords.ts` (acrescentar export)
- Test: `src/utils/adminMapRecords.test.ts` (acrescentar casos)

**Interfaces:**
- Consumes: `MapZoneRead`, `MapZoneRecordRead` de `src/types/api`.
- Produces:
  ```ts
  // Verdadeiro quando o toque no registro deve abrir o balão; falso quando a folha de uma zona está
  // aberta e o registro está na lista dela (aí o toque destaca e rola, como sempre).
  export function shouldShowRecordBalloon(
  	recordId: number,
  	selectedZone: MapZoneRead | null,
  	zoneRecords: MapZoneRecordRead[],
  ): boolean
  ```

- [ ] **Step 1: Testes (vermelhos)**, em um `describe('shouldShowRecordBalloon')`:
  - `shows the balloon when no zone sheet is open`: `(5, null, [])` → `true`.
  - `shows the balloon when a zone sheet is open but the record is not in its list`: zona aberta, `zoneRecords` sem o id 5 → `true`.
  - `does not show the balloon for a record listed in the open zone sheet`: zona aberta e `zoneRecords` com id 5 → `false`.
  - `ignores the zone list when no zone is selected`: `selectedZone null` e `zoneRecords` com id 5 → `true`.
- [ ] **Step 2: Ver falhar.** `npx jest src/utils/adminMapRecords.test.ts` → FAIL: `shouldShowRecordBalloon is not a function`.
- [ ] **Step 3: Implementar** a função em `adminMapRecords.ts`.
- [ ] **Step 4: Ver passar.** Mesmo comando → todos verdes.
- [ ] **Step 5: Commit.** `feat(mapa): regra de quando o toque no registro abre o balão`.

---

### Task 3: Componente do balão e textos

**Files:**
- Create: `src/components/map/RecordBalloon.tsx`
- Modify: `src/components/map/mapViewStyles.ts` (estilos do balão), `src/i18n/locales/pt-BR/map.ts`, `src/i18n/locales/en-US/map.ts`
- Test: o teste de paridade de chaves existente (`src/i18n/keys.test.ts`) cobre os textos; o componente é conferido no aparelho (Task 4).

**Interfaces:**
- Consumes: `BalloonPlacement`, `BALLOON_POINTER_DP` (Task 1); `formatDateAtTime`; `countLabel`; `MapZoneRecordRead`.
- Produces:
  ```ts
  export const BALLOON_WIDTH_DP = 232
  export const BALLOON_HEIGHT_DP = 60
  export function RecordBalloon(props: {
  	record: MapZoneRecordRead
  	placement: BalloonPlacement
  	onPress: () => void
  }): JSX.Element
  ```
  Chaves novas em `map` (pt-BR / en-US): `balloon.open` = "Abrir detalhes do registro {{id}}" / "Open details for record {{id}}"; `balloon.unknownAuthor` = "Autor não informado" / "Unknown author".

Layout (largura fixa `BALLOON_WIDTH_DP`, altura `BALLOON_HEIGHT_DP`, posição absoluta em `placement.left/top`): linha 1 com o autor (`numberOfLines={1}`, `ellipsizeMode="tail"`, peso 700, `colors.text`) à esquerda e `#{id}` (`colors.muted`) à direita; linha 2 com `countLabel(ibis_quantity ?? 0)` e `formatDateAtTime(date_time)` separados por " · " (`colors.muted`, `fontSize.caption`, uma linha com reticências). Fundo `colors.surface`, `radius.md`, `...overlayShadow`, padding `spacing.sm2`/`spacing.md`. Pontinha: triângulo de 8 dp de altura (borda CSS de `View`) na cor `colors.surface`, em `pointerLeft`, embaixo do balão se `side 'above'` e em cima se `'below'`. `Pressable` com `accessibilityRole="button"` e `accessibilityLabel={t('balloon.open', { id })}`; `author_name` vazio mostra `balloon.unknownAuthor`.

- [ ] **Step 1: Adicionar as duas chaves** nos dois arquivos de idioma (mesma estrutura aninhada de `marker`). Rodar `npx jest src/i18n` → verde (paridade).
- [ ] **Step 2: Criar `RecordBalloon.tsx`** e os estilos conforme o layout acima. Estilos em `mapViewStyles.ts` com tokens do tema.
- [ ] **Step 3: Verificar.** `npm run typecheck` e `npm run lint` → sem erros.
- [ ] **Step 4: Commit.** `feat(mapa): componente do balão do avistamento`.

---

### Task 4: Ligar o balão ao mapa do admin

**Files:**
- Modify: `src/hooks/useAdminMapMarkers.ts`, `src/components/MapLibreMapView.tsx`, `src/screens/MapsScreen.tsx`

**Interfaces:**
- Consumes: `placeBalloon`, `BalloonPlacement` (Task 1); `shouldShowRecordBalloon` (Task 2); `RecordBalloon`, `BALLOON_WIDTH_DP`, `BALLOON_HEIGHT_DP` (Task 3).
- Produces:
  ```ts
  // useAdminMapMarkers passa a devolver (e deixa de devolver handleMarkerPress):
  recordBalloon: { shouldShow: (recordId: number) => boolean; onPress: (recordId: number) => void }
  // MapLibreMapView ganha a prop opcional:
  recordBalloon?: { shouldShow: (recordId: number) => boolean; onPress: (recordId: number) => void }
  ```

- [ ] **Step 1: Hook.** Em `useAdminMapMarkers`, remover `handleMarkerPress` e devolver `recordBalloon` (memoizado com `useMemo`): `shouldShow = (id) => shouldShowRecordBalloon(id, selectedZone, zoneRecords)` e `onPress = (id) => navigation.navigate('RecordDetail', { recordId: id })`.
- [ ] **Step 2: Tela.** Em `MapsScreen.tsx`, para o admin passar `onRecordMarkerPress={!selectionMode ? onRecordMarkerPress : undefined}` (o do contexto, para os dois tipos de conta) e `recordBalloon={!selectionMode && admin.isAdmin ? admin.recordBalloon : undefined}`.
- [ ] **Step 3: Mapa, estado e toque.** Em `MapLibreMapView`, estado `balloon: { recordId: number; anchor: { x: number; y: number } | null } | null` e tamanho do container via `onLayout` da `View` raiz. Toque no marcador (`handleRecordPress`): se `recordBalloon?.shouldShow(id)` for verdadeiro, abre o balão (`anchor: null`, escondido) e agenda o cálculo da âncora; senão chama `onRecordMarkerPress?.(id)`. Passar `handleRecordPress` ao `RecordMarker` no lugar de `onRecordMarkerPress`.
- [ ] **Step 4: Âncora.** `computeAnchor(recordId)`: acha o registro em `visibleRecordMarkers`, chama `await mapRef.current?.pointForCoordinate({ latitude: latitude_camera, longitude: longitude_camera })` e guarda o ponto (em dp). Calcular em `onRegionChangeComplete` (o Google Maps recentra a câmera no toque, então a posição só é final depois) **e** por um temporizador de 400 ms após o toque (cobre o caso de o marcador já estar no centro e nenhuma região mudar). Conferir no aparelho se `pointForCoordinate` devolve dp (esperado no Android); se vier em pixels, dividir por `PixelRatio.get()` e registrar isso num comentário.
- [ ] **Step 5: Fechar e reaparecer.** Fechar (`setBalloon(null)`) no `onPress` do mapa (qualquer toque no mapa; o teste da área da zona continua depois) e quando o registro do balão não estiver mais em `visibleRecordMarkers` (efeito). Em `onPanDrag` esconder (`anchor: null`, mantendo `recordId`); `onRegionChangeComplete` recalcula a âncora se houver `recordId`. Tocar em grupo (`fitToCoordinates`) fecha o balão. Tocar em outro marcador abre o dele.
- [ ] **Step 6: Desenhar.** Quando `balloon?.anchor` e o registro existirem, renderizar `RecordBalloon` depois do `MapView` (sibling dentro do container) com `placement = placeBalloon({ anchor, balloon: { width: BALLOON_WIDTH_DP, height: BALLOON_HEIGHT_DP }, container })` e `onPress={() => { recordBalloon.onPress(recordId); setBalloon(null) }}`. `placeBalloon` com `useMemo`.
- [ ] **Step 7: Verificar.** `npm run typecheck`, `npm run lint`, `npm test` → tudo verde, sem teste vermelho novo.
- [ ] **Step 8: Conferir no aparelho** (emulador e celular; `build-install.ps1` com o clone curto, como nas rodadas anteriores). Lista de conferência, anotar o que passou e o que não:
  - toque num registro → balão sobre ele, com autor, número, guarás e data/hora;
  - toque no balão → abre o detalhe do registro;
  - toque no mapa vazio, em outro marcador e em grupo → fecha / abre o outro / aproxima;
  - mover o mapa → balão some e volta no lugar certo ao soltar;
  - registro perto do topo e das bordas esquerda/direita → balão dentro das margens, abaixo quando não cabe em cima;
  - folha de zona aberta + registro dela → destaca e rola, sem balão; registro de fora da lista → balão;
  - conta comum (se houver uma à mão) → toque no marcador como antes, sem balão.
- [ ] **Step 9: Commit.** `feat(mapa): balão do avistamento no mapa do admin`.

---

### Task 5: Documentação e fechamento

**Files:**
- Modify: `AGENTS.md` (bullet "Mapa do admin", linha ~75)

- [ ] **Step 1: Atualizar o bullet.** Trocar "com a folha de uma zona aberta e o registro na lista dela, destaca e rola; fora disso abre `RecordDetail` direto" por: com a folha aberta e o registro na lista dela, destaca e rola; fora disso mostra o balão (`RecordBalloon`, posição em `utils/balloonPlacement.ts`, regra em `shouldShowRecordBalloon`), e tocar no balão abre `RecordDetail`. Acrescentar também que os grupos (`utils/clusterRecords.ts`, `clusterPlacement.ts`) só aproximam o mapa.
- [ ] **Step 2: Verificação final.** `npm run typecheck && npm run lint && npm test` → verdes.
- [ ] **Step 3: Commit e push.** `docs: balão do avistamento no AGENTS.md`; `git push -u origin feat/balao-avistamento-admin`. **Não abrir o PR sem a equipe pedir**; a base do PR é `feat/agrupamento-mapa-admin` enquanto o #48 não entrar.
