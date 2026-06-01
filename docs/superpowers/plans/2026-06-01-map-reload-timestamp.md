# Map Reload Timestamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating map reload button and last-updated label to the Maps screen.

**Architecture:** `MapsScreen` owns zone fetching, reload state, and last-success timestamp. `appStyles.ts` owns the overlay visual styles. A small pure formatter in `src/utils/timeFormatters.ts` formats elapsed update time.

**Tech Stack:** React Native, Expo, TypeScript, `react-native-maps`, existing `getMapZones()` API service.

---

## File Structure

- Create: `src/utils/timeFormatters.ts`
- Modify: `src/screens/MapsScreen.tsx`
- Modify: `src/styles/appStyles.ts`

## Tasks

### Task 1: Add Timestamp Formatter

**Files:**
- Create: `src/utils/timeFormatters.ts`

- [ ] Add `formatLastUpdatedAt(lastUpdatedAt: Date | null, now = new Date())`.

```ts
export function formatLastUpdatedAt(
	lastUpdatedAt: Date | null,
	now = new Date(),
) {
	if (!lastUpdatedAt) {
		return 'Nunca atualizado'
	}

	const diffMs = Math.max(0, now.getTime() - lastUpdatedAt.getTime())
	const diffMinutes = Math.floor(diffMs / 60000)

	if (diffMinutes < 1) {
		return 'Atualizado agora'
	}

	if (diffMinutes < 60) {
		return `Atualizado há ${diffMinutes} min`
	}

	const diffHours = Math.floor(diffMinutes / 60)
	return `Atualizado há ${diffHours} h`
}
```

- [ ] Verify with `npm run typecheck`.

### Task 2: Refactor Zone Loading

**Files:**
- Modify: `src/screens/MapsScreen.tsx`

- [ ] Import `useCallback`, `ActivityIndicator`, and `formatLastUpdatedAt`.
- [ ] Add state: `isReloading`, `lastUpdatedAt`, and `lastUpdatedLabel`.
- [ ] Extract `loadZones(signal?: AbortSignal)` with `useCallback`.
- [ ] On successful fetch, set zones and `lastUpdatedAt`.
- [ ] On failed fetch, keep current zones and set `zonesError`.
- [ ] Keep initial load using `AbortController`.

### Task 3: Add Floating Reload UI

**Files:**
- Modify: `src/screens/MapsScreen.tsx`
- Modify: `src/styles/appStyles.ts`

- [ ] Add overlay inside `mapsMapCard`, above `MapLibreMapView`.
- [ ] Render circular button at top-right.
- [ ] Show spinner while reloading.
- [ ] Show refresh icon when idle.
- [ ] Disable button while reloading.
- [ ] Render `lastUpdatedLabel` under the button.

### Task 4: Add Styles

**Files:**
- Modify: `src/styles/appStyles.ts`

- [ ] Add `mapReloadOverlay`.
- [ ] Add `mapReloadButton`.
- [ ] Add `mapReloadButtonDisabled`.
- [ ] Add `mapReloadTextPill`.
- [ ] Add `mapReloadText`.

### Task 5: Verify

**Commands:**

```powershell
npm run typecheck
npm run lint
```

**Expected:** Both pass.

### Task 6: Commit

**Commands:**

```powershell
git add src/screens/MapsScreen.tsx src/styles/appStyles.ts src/utils/timeFormatters.ts docs/superpowers/plans/2026-06-01-map-reload-timestamp.md docs/superpowers/specs/2026-06-01-map-reload-timestamp-design.md
git commit -m "feat: add map reload timestamp overlay"
```

## Self-Review

- Spec coverage: reload button, loading state, timestamp, error preservation, styles, and verification are covered.
- Placeholder scan: no placeholders remain.
- Type consistency: `lastUpdatedAt`, `isReloading`, and `formatLastUpdatedAt` names are consistent.
