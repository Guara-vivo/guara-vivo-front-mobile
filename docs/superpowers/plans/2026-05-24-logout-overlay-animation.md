# Logout Overlay Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen overlay animation during logout that blocks UI interaction and displays loading feedback.

**Architecture:** ProfileScreen manages `isLoggingOut` state. When logout starts, overlay renders with dark semi-transparent background, centered card with ActivityIndicator, and text. Navigation happens automatically after logout completes.

**Tech Stack:** React Native, Expo, TypeScript

---

## File Structure

- **Modify:** `src/screens/ProfileScreen.tsx` — add state management and overlay JSX
- **Modify:** `src/styles/appStyles.ts` — add overlay styling (container, background, card, text)

---

## Task 1: Add Overlay Styles

**Files:**
- Modify: `src/styles/appStyles.ts`

- [ ] **Step 1: Read appStyles to find insertion point**

Open `src/styles/appStyles.ts` and locate the profile-related styles section (around line 1658+).

- [ ] **Step 2: Add overlay container styles**

After the `profileMenuItemTextLogout` style (around line 1672), add:

```typescript
	logoutOverlayContainer: {
		position: 'absolute' as const,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	logoutOverlayCard: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		paddingVertical: 32,
		paddingHorizontal: 24,
		alignItems: 'center',
		gap: 16,
		...unifiedShadow,
	},
	logoutOverlayText: {
		color: colors.text,
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
	},
```

- [ ] **Step 3: Verify styles compile**

Run: `npm run typecheck`

Expected: No errors. All new style keys should have proper TypeScript types.

- [ ] **Step 4: Commit styles**

```bash
git add src/styles/appStyles.ts
git commit -m "style: add logout overlay styles"
```

---

## Task 2: Update ProfileScreen to Show Overlay

**Files:**
- Modify: `src/screens/ProfileScreen.tsx`

- [ ] **Step 1: Add useState import**

Open `src/screens/ProfileScreen.tsx`. At the top, ensure `useState` is imported from `react`:

```typescript
import React, { useState } from 'react'
```

If already imported with other hooks, just verify it's there.

- [ ] **Step 2: Add ActivityIndicator import**

In the imports section, add `ActivityIndicator` to the React Native import (around line 2):

```typescript
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
```

- [ ] **Step 3: Add isLoggingOut state to component**

Inside the `ProfileScreen` function body, after the `const displayEmail = ...` line (around line 19), add:

```typescript
	const [isLoggingOut, setIsLoggingOut] = useState(false)
```

- [ ] **Step 4: Create wrapper for logout handler**

Inside the `ProfileScreen` function body, after the state declaration, add a new async handler:

```typescript
	const handleLogoutPress = async () => {
		setIsLoggingOut(true)
		try {
			await onLogout()
		} finally {
			setIsLoggingOut(false)
		}
	}
```

- [ ] **Step 5: Update Pressable to use new handler**

Find the logout Pressable (line 75) and change:

```typescript
// OLD:
<Pressable onPress={onLogout} style={appStyles.profileMenuItem}>

// NEW:
<Pressable
	onPress={handleLogoutPress}
	disabled={isLoggingOut}
	style={appStyles.profileMenuItem}
>
```

- [ ] **Step 6: Add overlay JSX after ScrollView**

After the `</ScrollView>` closing tag (after line 82), add the overlay conditionally:

```typescript
			{isLoggingOut && (
				<View style={appStyles.logoutOverlayContainer}>
					<View style={appStyles.logoutOverlayCard}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={appStyles.logoutOverlayText}>
							Saindo da conta...
						</Text>
					</View>
				</View>
			)}
```

- [ ] **Step 7: Add colors import if missing**

Verify that `colors` is imported at the top of the file. If not already present, add to the imports:

```typescript
import { colors } from '../constants/theme'
```

- [ ] **Step 8: Verify full ProfileScreen structure**

The complete structure should be:

```typescript
export function ProfileScreen({
	onNavigate,
	onLogout,
	user,
}: {
	onNavigate: (screen: ScreenId) => void
	onLogout: () => void | Promise<void>
	user: UserRead | null
}) {
	const displayName = user?.name ?? 'Usuario Guara Vivo'
	const displayEmail = user?.email ?? 'Sessao local'
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogoutPress = async () => {
		setIsLoggingOut(true)
		try {
			await onLogout()
		} finally {
			setIsLoggingOut(false)
		}
	}

	return (
		<View style={appStyles.profileScreen}>
			<Header title="Meu Perfil" />
			<ScrollView
				contentContainerStyle={appStyles.profileContent}
				style={appStyles.screen}
			>
				{/* existing content */}
				<Pressable
					onPress={handleLogoutPress}
					disabled={isLoggingOut}
					style={appStyles.profileMenuItem}
				>
					<Ionicons name="log-out-outline" size={19} color="#F2201F" />
					<Text style={appStyles.profileMenuItemTextLogout}>
						Sair da conta
					</Text>
				</Pressable>
			</ScrollView>

			{isLoggingOut && (
				<View style={appStyles.logoutOverlayContainer}>
					<View style={appStyles.logoutOverlayCard}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={appStyles.logoutOverlayText}>
							Saindo da conta...
						</Text>
					</View>
				</View>
			)}
		</View>
	)
}
```

- [ ] **Step 9: Run typecheck**

Run: `npm run typecheck`

Expected: No errors. All types should resolve correctly.

- [ ] **Step 10: Run lint**

Run: `npm run lint`

Expected: No errors or warnings introduced by changes.

- [ ] **Step 11: Commit ProfileScreen changes**

```bash
git add src/screens/ProfileScreen.tsx
git commit -m "feat: add logout overlay animation with loading state"
```

---

## Task 3: Manual Testing

**Files:**
- Test: `src/screens/ProfileScreen.tsx` (runtime)

- [ ] **Step 1: Start dev server**

Run: `npm start`

Expected: Expo dev server starts successfully.

- [ ] **Step 2: Navigate to profile screen**

1. Build and run app on device/emulator
2. Log in with test credentials
3. Tap bottom navigation profile icon
4. Verify profile screen renders without errors

Expected: Profile screen displays normally, logout button is visible.

- [ ] **Step 3: Test logout interaction**

1. Tap "Sair da conta" button
2. Verify overlay appears immediately with dark background
3. Verify centered card displays with spinner and "Saindo da conta..." text
4. Verify overlay blocks interaction (tap other buttons — nothing happens)
5. Wait for logout to complete
6. Verify screen navigates back to Welcome screen

Expected: Smooth animation, no freezing, auto-navigation after logout.

- [ ] **Step 4: Test error recovery**

If network error occurs during logout:
1. Verify overlay disappears after error
2. Verify button is re-enabled
3. Verify user can retry logout

Expected: Graceful error handling via `finally` block.

- [ ] **Step 5: Commit testing note (optional)**

```bash
git commit --allow-empty -m "test: manual verification of logout overlay animation passed"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Overlay bloqueante durante logout — Task 2, Step 6
- ✅ ActivityIndicator visível — Task 2, Step 6
- ✅ Texto "Saindo da conta..." — Task 2, Step 6
- ✅ Botão desabilitado durante logout — Task 2, Step 5
- ✅ Card centralizado com styling — Task 1

**Placeholder Scan:**
- ✅ No "TBD", "TODO", or vague instructions
- ✅ All code blocks complete and copy-paste ready
- ✅ All file paths exact

**Type Consistency:**
- ✅ `isLoggingOut` is `boolean`
- ✅ `handleLogoutPress` is `async () => Promise<void>`
- ✅ `onLogout` already supports `Promise<void>`
- ✅ `colors.primary` matches existing imports

**No Unresolved Dependencies:**
- ✅ All imports already exist in project
- ✅ `ActivityIndicator` from React Native
- ✅ `useState` from React
- ✅ All style references map to Task 1 definitions

---

## Execution

Plan complete and saved. Ready for implementation.

**Execution options:**

1. **Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks
2. **Inline Execution** — Execute tasks in this session with checkpoints

Which approach?
