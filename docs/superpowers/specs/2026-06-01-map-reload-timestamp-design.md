# Map Reload & Last Updated Timestamp Design

**Date:** 2026-06-01  
**Scope:** Add manual reload button and last updated timestamp to MapsScreen  
**Status:** Approved

## Goal

Enable users to manually refresh map zone data and see when zones were last updated, improving feedback and control over data freshness.

## Features

### 1. Manual Reload Button
- **Position:** Overlay on map, top-right corner
- **Style:** Circular button, blue secondary color (#125ED0), white refresh icon
- **States:**
  - Default: refresh icon, enabled
  - Loading: spinner/disabled with reduced opacity (0.6)
  - Error: refresh icon, enabled (data not updated, error shown in banner)
- **Behavior:** On press, fetch zones again using `getMapZones()` with AbortSignal

### 2. Last Updated Timestamp Display
- **Position:** Below reload button in top-right overlay
- **Text Format:**
  - First load: `Atualizado agora`
  - < 1 minute: `Atualizado agora`
  - 1-59 minutes: `Atualizado há X min`
  - ≥ 1 hour: `Atualizado há X h`
  - Before first success: `Nunca atualizado`
- **Update Trigger:** When `loadZones()` succeeds, store ISO timestamp in state
- **Refresh Rate:** Timestamp updates every minute (optional timer, or just reformat on component render)

### 3. Error Handling
- Existing `zonesError` banner continues to show
- Failed reload keeps current `zones` data intact
- Timestamp does NOT update on error
- Reload button remains enabled for retry

## Implementation Details

### State Changes (MapsScreen.tsx)

```typescript
const [isReloading, setIsReloading] = useState(false)
const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
```

### Extract loadZones Function

Move zones fetching logic into a reusable function to support:
- Initial load on mount
- Manual reload via button

```typescript
const loadZones = useCallback(async (signal?: AbortSignal) => {
  try {
    setZonesError(null)
    const data = await getMapZones(signal)
    setZones(data)
    setLastUpdatedAt(new Date())
  } catch (error) {
    setZonesError(error instanceof Error ? error.message : 'Erro ao carregar áreas')
  }
}, [])
```

### Initial Load

Keep existing useEffect, call new `loadZones()`:

```typescript
useEffect(() => {
  let isMounted = true
  const controller = new AbortController()

  loadZones(controller.signal)

  return () => {
    isMounted = false
    controller.abort()
  }
}, [loadZones])
```

### Manual Reload Handler

```typescript
const handleReloadZones = async () => {
  setIsReloading(true)
  try {
    await loadZones()
  } finally {
    setIsReloading(false)
  }
}
```

### Timestamp Formatting

Create helper utility `formatTimeSince(date: Date): string`:
- Returns `"agora"`, `"5 min"`, `"2 h"`, or `"Nunca"`
- Used in overlay text rendering

### UI Component

New overlay component in MapsScreen or inline JSX:
- Position: `position: 'absolute'`, `top: 10`, `right: 10`
- Contains:
  - Circular button with refresh icon (or spinner if loading)
  - Text label below showing formatted timestamp
- Disable/opacity control when `isReloading`

## Data Flow

1. **Mount:** `useEffect` calls `loadZones()` → fetches zones → updates `lastUpdatedAt`
2. **User taps reload:** `handleReloadZones()` → `isReloading = true` → `loadZones()` → `lastUpdatedAt` updated → `isReloading = false`
3. **Error:** `zonesError` shown in banner, timestamp NOT updated, retry available
4. **Timestamp display:** Every render, format `lastUpdatedAt` using utility (or optional 1-min timer if dynamic updates desired)

## Styles (appStyles.ts)

Add new styles for overlay:

```typescript
mapReloadOverlay: {
  position: 'absolute',
  top: 10,
  right: 10,
  alignItems: 'center',
  gap: 6,
  zIndex: 10,
},
mapReloadButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.secondary,
  alignItems: 'center',
  justifyContent: 'center',
  ...unifiedShadow,
},
mapReloadButtonDisabled: {
  opacity: 0.6,
},
mapReloadText: {
  fontSize: 11,
  color: colors.text,
  fontWeight: '500',
},
```

## Testing Criteria

- [ ] Reload button visible in top-right overlay
- [ ] Initial load shows `Atualizado agora`
- [ ] Reload freezes button, shows spinner/disabled state
- [ ] Successful reload updates zones and timestamp
- [ ] Failed reload shows error banner, keeps old data, allows retry
- [ ] Timestamp formatting: `"agora"` < 1min, `"X min"` for 1-59min, `"X h"` for ≥1h
- [ ] Pressing reload multiple times works correctly (no race conditions)

## Files Modified

- `src/screens/MapsScreen.tsx` – state, handlers, overlay JSX
- `src/styles/appStyles.ts` – new overlay + button styles
- `src/utils/formatters.ts` (new) – `formatTimeSince()` helper

## Success Criteria

✅ Users can manually refresh zones via overlay button  
✅ Last updated timestamp visible below button  
✅ Timestamp formats correctly (agora, X min, X h)  
✅ Loading state disables button with visual feedback  
✅ Error handling preserves existing data  
✅ No race conditions on rapid reloads
