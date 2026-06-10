# Map Zone Detail Bottom Sheet

Transform overlay `mapZoneInfoCard` into a draggable bottom sheet for better map visibility.

## Problem

Current zone detail renders as an absolute-positioned card overlay on the map, blocking ~40% of the map area with no way to peek underneath.

## Solution

Replace the card with a non-modal `BottomSheet` using `@gorhom/bottom-sheet`. The sheet slides up from the bottom, covering the tab bar, while the map remains interactive behind it.

## Architecture

### Components

1. **`MapZoneDetailContext`** — React context holding zone detail state, rendered once at app root
2. **`MapZoneDetailSheet`** — `BottomSheet` (non-modal) with snap points, rendered via `@gorhom/portal` above the navigator
3. **`MapsScreen`** — simplified, card JSX removed, calls context actions

### Data Flow

```
Map press → MapsScreen.handleZonePress → context.openSheet(zone)
  ↓
Context triggers zone records fetch (same logic, moved from MapsScreen)
  ↓
MapZoneDetailSheet reads context state, renders content
  ↓
User pans down or taps close → context.closeSheet()
```

### Touch Handling

- `BottomSheet` (non-modal) renders inline in React tree — no `ReactNativeModal`
- No backdrop component → touches outside sheet area pass through to the map behind
- `enablePanDownToClose={true}` with `onChange` detecting index `-1`

### States

- **Closed:** `selectedZone === null`, sheet hidden
- **Partial (25%):** header (eyebrow, name, type), total records count, action buttons (close, delete)
- **Expanded (80%):** full content — metrics grid (radius, date), coordinates, records list

### States Covered

- **Loading:** `ActivityIndicator` + "Carregando registros..." (moved as-is)
- **Error:** Error text banner (moved as-is)
- **Empty:** "Nenhum registro com guarás identificados nesta área." (moved as-is)
- **Records:** Scrollable list with `ZoneRecordRow` items (moved as-is)

## Style Changes

- Remove `mapZoneRecordsList` fixed height (`height: 112`) — sheet scroll handles sizing
- All other `mapZoneInfo*` styles unchanged
- New `zoneDetailSheet*` styles if minimal adjustments needed for bottom sheet padding

## File Changes

| File | Action |
|------|--------|
| `src/contexts/MapZoneDetailContext.tsx` | Create — context + provider |
| `src/components/MapZoneDetailSheet.tsx` | Create — BottomSheet component |
| `src/screens/MapsScreen.tsx` | Edit — remove card, use context |
| `src/GuaraVivoApp.tsx` | Edit — add provider |
| `src/styles/appStyles.ts` | Edit — minor cleanup |

## Non-goals

- No visual changes to zone detail content
- No refactoring of `ZoneRecordRow` or record logic
- No changes to `MapZoneSelectionModal` or delete confirm sheet
