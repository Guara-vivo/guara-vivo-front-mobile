# History Sort Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sort order toggle button to the history screen that allows users to switch between viewing records by most recent first (default) or oldest first.

**Architecture:** Add local state (`sortOrder`) and a `useMemo` sorting function in `HistoryScreen.tsx`. The sorted array is passed to `FlatList`. A toggle button below the filter card switches the sort order and updates the state.

**Tech Stack:** React Native, React hooks (`useState`, `useMemo`), Ionicons for button icon

---

## File Structure

**Modified Files:**
- `src/screens/HistoryScreen.tsx` — Add sort state, sorting logic, and toggle button UI

**No new files required.**

---

## Task 1: Add Sort State and Toggle Handler

**Files:**
- Modify: `src/screens/HistoryScreen.tsx:38-50` (state declarations section)

- [ ] **Step 1: Add sortOrder state**

In `HistoryScreen.tsx`, after the existing state declarations (around line 44), add:

```typescript
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
```

This declares the sort order state with a default of `'desc'` (most recent first).

- [ ] **Step 2: Add toggle handler**

Right after the state declaration, add the toggle function:

```typescript
const toggleSortOrder = () => {
  setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
}
```

- [ ] **Step 3: Verify syntax**

Open `HistoryScreen.tsx` and visually confirm the new state and handler are added. No test needed — React will complain at compile time if there's a syntax error.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
git add src/screens/HistoryScreen.tsx
git commit -m "feat(history): add sort order state and toggle handler"
```

Expected output: `1 file changed, 5 insertions(+)`

---

## Task 2: Create Sorted Records Memoization

**Files:**
- Modify: `src/screens/HistoryScreen.tsx:109-120` (after filteredRecords retrieval)

- [ ] **Step 1: Import useMemo (if not already imported)**

Check the top of `HistoryScreen.tsx` for the React import. If it doesn't include `useMemo`, update it:

```typescript
import React, { useEffect, useState, useMemo } from 'react'
```

If `useMemo` is already imported, skip this step.

- [ ] **Step 2: Add sorted records memoization**

After the line `const { ... } = useHistoryFilters(records)` (around line 109), add:

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

This creates a sorted copy of `filteredRecords` based on the `sortOrder` state. Dependencies are `[filteredRecords, sortOrder]`.

- [ ] **Step 3: Verify sorting logic**

Read through the code to ensure:
- Descending order: `b.datetime - a.datetime` (newer first)
- Ascending order: `a.datetime - b.datetime` (older first)

Both should be present and correct.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
git add src/screens/HistoryScreen.tsx
git commit -m "feat(history): add sorted records memoization based on sortOrder"
```

Expected output: `1 file changed, X insertions(+)`

---

## Task 3: Update FlatList to Use Sorted Records

**Files:**
- Modify: `src/screens/HistoryScreen.tsx:121-135` (FlatList data prop)

- [ ] **Step 1: Replace data prop**

Find the `<FlatList>` component (around line 121). Change:

```typescript
data={filteredRecords}
```

to:

```typescript
data={orderedRecords}
```

- [ ] **Step 2: Verify change**

Confirm the change is made and the line now references `orderedRecords`.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
git add src/screens/HistoryScreen.tsx
git commit -m "feat(history): use sorted records in FlatList"
```

Expected output: `1 file changed, 1 insertion(+), 1 deletion(-)`

---

## Task 4: Add Sort Button to ListHeaderComponent

**Files:**
- Modify: `src/screens/HistoryScreen.tsx:136-161` (ListHeaderComponent, inside ScreenCard)

- [ ] **Step 1: Add sort button after filter button**

Inside the `ListHeaderComponent`, after the `</Pressable>` closing tag of the filter button (around line 159), add a new line and insert:

```typescript
<Pressable
  onPress={toggleSortOrder}
  disabled={isLoading}
  style={[
    appStyles.historyFilterButton,
    isLoading && appStyles.historyFilterButtonDisabled,
  ]}
>
  <Ionicons name="swap-vertical" size={17} color="#FFFFFF" />
  <Text style={appStyles.historyFilterButtonText}>
    {sortOrder === 'desc' ? 'MAIS RECENTES' : 'MAIS ANTIGOS'}
  </Text>
</Pressable>
```

This creates a button that:
- Calls `toggleSortOrder` on press
- Disables when loading (consistent with filter button)
- Uses same styling as filter button
- Shows "MAIS RECENTES" when `sortOrder === 'desc'`, otherwise "MAIS ANTIGOS"
- Uses the `swap-vertical` icon

- [ ] **Step 2: Verify button placement**

Read the code to confirm the button is placed after the filter button but still within the `ScreenCard`. The structure should be:
```
<ScreenCard>
  <View>
    {search input}
  </View>
  <Pressable>
    {filter button}
  </Pressable>
  <Pressable>
    {sort button}  ← newly added
  </Pressable>
</ScreenCard>
```

If the structure looks different, you may need to wrap both buttons in a `<View>` for layout. Check existing code for patterns.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
git add src/screens/HistoryScreen.tsx
git commit -m "feat(history): add sort order toggle button to UI"
```

Expected output: `1 file changed, X insertions(+)`

---

## Task 5: Manual Testing

**Files:** No code changes

- [ ] **Step 1: Start the app**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
npm start
```

Wait for the Expo server to start and connect your device/emulator.

- [ ] **Step 2: Navigate to history screen**

Open the app, tap the history/clock icon to navigate to the history screen.

- [ ] **Step 3: Verify default sort order**

Confirm that records are displayed with the most recent record first. Check the dates at the top and bottom of the list — the top should have a newer date.

- [ ] **Step 4: Tap sort button**

Tap the "MAIS RECENTES" button. The list should re-order instantly to show the oldest record first. The button text should change to "MAIS ANTIGOS".

- [ ] **Step 5: Tap sort button again**

Tap the "MAIS ANTIGOS" button. The list should re-order back to most recent first. Button text should change back to "MAIS RECENTES".

- [ ] **Step 6: Test with filters**

Apply a behavior filter (e.g., "Alimentando"). The filtered list should still respect the sort order. Toggle sort again — order should change.

- [ ] **Step 7: Test with search**

Search for a location or date. The search results should be sorted according to the current sort order.

- [ ] **Step 8: Test pull-to-refresh**

Pull down to refresh the list. After refresh completes, the sort order should be preserved (not reset).

- [ ] **Step 9: Verify no errors**

Check the terminal/console for any React warnings or errors. There should be none.

- [ ] **Step 10: No commit needed**

Manual testing produces no changes to commit.

---

## Task 6: Final Verification and Summary

**Files:** No code changes

- [ ] **Step 1: Check git log**

```bash
cd "C:\Users\Vinicius Leal\Desktop\pi_namorada_linda\guara-vivo-front-end"
git log --oneline -5
```

Expected output: 5 most recent commits, with 4 new commits for this feature:
- `feat(history): add sort order toggle button to UI`
- `feat(history): use sorted records in FlatList`
- `feat(history): add sorted records memoization based on sortOrder`
- `feat(history): add sort order state and toggle handler`

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: No errors. All types should be inferred correctly (sortOrder is `'asc' | 'desc'`, toggle function is inferred as `() => void`, etc.).

- [ ] **Step 3: Verify lint passes**

```bash
npm run lint
```

Expected: No linting errors related to the new code.

- [ ] **Step 4: Summary**

Feature complete:
- ✅ Sort state added with default `'desc'`
- ✅ Toggle handler switches between `'asc'` and `'desc'`
- ✅ Sorted records memoized and passed to FlatList
- ✅ Sort button added to UI with dynamic label
- ✅ Manual testing passed
- ✅ No type or lint errors
- ✅ 4 commits created (one per logical step)

---

## Rollback Instructions

If rollback is needed, revert the 4 commits:

```bash
git revert HEAD~3..HEAD
```

Or reset to the commit before the feature:

```bash
git reset --hard <commit-hash-before-feature>
```

No database or API changes were made, so rollback is safe and complete.
