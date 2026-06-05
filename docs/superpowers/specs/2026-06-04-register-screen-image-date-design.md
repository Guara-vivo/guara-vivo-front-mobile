# Register Screen Image Loading And Date Defaults Design

## Goal

Improve feedback on the new record screen while selected images are being prepared, and avoid sending stale auto-filled date/time values.

## Current State

`src/screens/RegisterScreen.tsx` initializes `selectedAt` with `new Date()`, so date and time show the moment the screen opened. Image picking uses `expo-image-picker`; after the native gallery closes, large selections can leave the UI without feedback while assets are mapped into upload files.

## Design

Use separate nullable state for date and time selections. Both fields start empty and show placeholders. The final `Date` is computed only when saving.

Date/time rules:

- Date empty and time empty: use `new Date()` at the exact save moment.
- Date filled and time empty: use selected date plus current hour/minute at save time.
- Date filled and time filled: use selected date plus selected hour/minute.
- Date empty and time filled: use current date plus selected hour/minute.

Image feedback rules:

- Add `isPickingImages` state.
- Set it before opening the gallery.
- Keep it active while returned assets are converted to `ReactNativeFile` objects and merged into existing selection.
- Replace the camera icon with an `ActivityIndicator` and change drop-zone text to `Preparando imagens...` while picking.
- Disable the drop-zone while saving or picking.

## Files

- `src/screens/RegisterScreen.tsx`: state, pick-image feedback, date/time state, save-time date composition.
- `src/styles/appStyles.ts`: muted placeholder text style for empty date/time fields.
- `src/utils/registerDateTime.ts`: pure date/time composition helper.
- `src/utils/registerDateTime.test.ts`: coverage for all date/time fallback rules.
- `jest.config.js` and `package.json`: Jest Expo test setup.

## Error Handling

Existing feedback modal behavior stays unchanged for permission, authentication, location, and upload errors. Picking state must be reset in a `finally` block so canceled selections and errors do not leave the UI stuck.

## Testing

Run TypeScript and lint checks:

- `npm test -- --runInBand`
- `npm run typecheck`
- `npm run lint`

## Self-Review

No placeholders. Scope is limited to the new record screen. Date/time rules are explicit. UI loading behavior is explicit.
