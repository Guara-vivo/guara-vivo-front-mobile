# History Screen Sort Toggle

**Date:** 2026-05-25  
**Author:** OpenCode  
**Status:** Approved

## Overview

Add a sort order toggle button to the history screen that allows users to view records in descending order (most recent first, default) or ascending order (oldest first). The button is placed below the search/filter card and toggles between "Mais recentes" and "Mais antigos" labels.

## Scope

- **In scope:** Sort toggle UI and state in `HistoryScreen.tsx` only
- **Out of scope:** Cache sorting, API sorting, or changes to `fetchRecords()` or `recordsService.ts`
- **Affected file:** `src/screens/HistoryScreen.tsx`

## Design

### UI Placement

The sort button is placed below the search/filter card in `ListHeaderComponent`:

- Location: After the filter button row in the `ScreenCard`
- Label text: Toggles between "Mais recentes" (desc, default) and "Mais antigos" (asc)
- Icon: `swap-vertical` from `@expo/vector-icons/Ionicons` to indicate direction toggle
- Styling: Match the existing filter button style (blue background, white text/icon)

### State Management

Add local state to `HistoryScreen`:

```typescript
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
```

Toggle handler:

```typescript
const toggleSortOrder = () => {
  setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
}
```

### Data Flow

1. `filteredRecords` comes from `useHistoryFilters` (after search and filter logic)
2. Add `useMemo` in `HistoryScreen` to sort `filteredRecords` by `datetime` based on `sortOrder`
3. Pass sorted array to `FlatList` as `data`

```typescript
const orderedRecords = useMemo(() => {
  if (sortOrder === 'desc') {
    return [...filteredRecords].sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    )
  }
  return [...filteredRecords].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )
}, [filteredRecords, sortOrder])
```

### Edge Cases & Behavior

- **Empty list:** Button remains visible and functional even when no records match filters
- **Invalid dates:** `new Date(record.datetime)` returns `Invalid Date` which converts to `NaN` in `.getTime()`. Sorting treats `NaN` as less than valid timestamps. This is acceptable since API should never send invalid dates
- **Order persistence:** Sort order persists during filtering/searching, resets on screen unmount
- **Pull-to-refresh:** Refresh fetches fresh data; sort order is preserved

## Testing Strategy

**Manual testing:**
1. Load history screen—verify default is "Mais recentes" with most recent records first
2. Tap sort button—verify toggle to "Mais antigos" and list re-orders to oldest first
3. Apply filters—verify order is maintained while filtered
4. Tap sort again—verify re-orders back to "Mais recentes"
5. Pull-to-refresh—verify fetch works and order is preserved

**No new unit tests required** (local state toggle is trivial; sorting logic is standard array sort)

## Implementation Notes

- No changes to hooks, services, or cache layer
- Sorting happens only in `HistoryScreen.tsx` within the render logic
- Use `[...filteredRecords].sort()` to avoid mutating the original array
- Dependencies for `useMemo`: `[filteredRecords, sortOrder]`

## Rollback Plan

Remove:
- `sortOrder` state
- `toggleSortOrder` function
- `useMemo` sorting logic
- Sort button from UI

No database or API changes, so rollback is a code-only revert.
