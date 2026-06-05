# Register Screen Image Loading And Date Defaults Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visible image preparation feedback and compute default date/time at save time on the new record screen.

**Architecture:** Keep UI changes local to `RegisterScreen.tsx` and one shared style entry. Store date and time independently as nullable values, then compose a final `Date` through a tested utility in the save handler.

**Tech Stack:** React Native, Expo ImagePicker, Expo Location, TypeScript, Jest Expo, existing `appStyles`.

---

### Task 1: Image Picking Loading State

**Files:**
- Modify: `src/screens/RegisterScreen.tsx`

- [ ] **Step 1: Add picking state**

Add this state beside `isSaving`:

```tsx
const [isPickingImages, setIsPickingImages] = useState(false)
```

- [ ] **Step 2: Guard the picker**

Update the first guard in `handlePickImages`:

```tsx
if (isSaving || isPickingImages) {
	return
}
```

- [ ] **Step 3: Wrap picker flow in `try/finally`**

Set `isPickingImages` to `true` before requesting permission. Reset it in `finally` after result handling completes.

```tsx
setIsPickingImages(true)

try {
	const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
	// existing permission, launch, mapping, merge logic
} finally {
	setIsPickingImages(false)
}
```

- [ ] **Step 4: Update drop-zone UI**

Use `isPickingImages` to disable the pressable, swap the icon, and change the label.

```tsx
disabled={isSaving || isPickingImages}
```

```tsx
{isPickingImages ? (
	<ActivityIndicator size="large" color="#125ED0" />
) : (
	<Ionicons name="camera-outline" size={44} color="#8FB0F4" />
)}
```

```tsx
{isPickingImages ? 'Preparando imagens...' : 'Clique para adicionar fotos'}
```

### Task 2: Nullable Date And Time State

**Files:**
- Modify: `src/screens/RegisterScreen.tsx`
- Modify: `src/styles/appStyles.ts`
- Create: `src/utils/registerDateTime.ts`
- Create: `src/utils/registerDateTime.test.ts`
- Create: `jest.config.js`
- Modify: `package.json`

- [ ] **Step 1: Replace `selectedAt` state**

Replace:

```tsx
const [selectedAt, setSelectedAt] = useState(new Date())
```

With:

```tsx
const [selectedDate, setSelectedDate] = useState<Date | null>(null)
const [selectedTime, setSelectedTime] = useState<Date | null>(null)
```

- [ ] **Step 2: Replace display labels**

Replace date/time labels with nullable labels.

```tsx
const selectedDateLabel = selectedDate?.toLocaleDateString('pt-BR')
const selectedTimeLabel = selectedTime?.toLocaleTimeString('pt-BR', {
	hour: '2-digit',
	minute: '2-digit',
})
```

- [ ] **Step 3: Add compose helper inside component**

Add a local helper before `handleSave`:

```tsx
const getRecordDateTime = () => {
	const now = new Date()
	const dateSource = selectedDate ?? now
	const timeSource = selectedTime ?? now
	const recordDateTime = new Date(dateSource)

	recordDateTime.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0)
	return recordDateTime
}
```

- [ ] **Step 4: Use composed date on upload**

Replace:

```tsx
dateTime: selectedAt,
```

With:

```tsx
dateTime: getRecordDateTime(),
```

- [ ] **Step 5: Reset fields after success and cancel**

After successful upload, reset both states to `null`. On cancel, also clear both states.

```tsx
setSelectedDate(null)
setSelectedTime(null)
```

- [ ] **Step 6: Update picker handlers**

Date handler:

```tsx
const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
	setShowDatePicker(false)
	if (event.type !== 'set' || !date) {
		return
	}

	setSelectedDate(date)
}
```

Time handler:

```tsx
const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
	setShowTimePicker(false)
	if (event.type !== 'set' || !date) {
		return
	}

	setSelectedTime(date)
}
```

- [ ] **Step 7: Update picker values**

Use the selected value or the current date when opening the native picker.

```tsx
value={selectedDate ?? new Date()}
```

```tsx
value={selectedTime ?? new Date()}
```

- [ ] **Step 8: Render placeholders**

Date field:

```tsx
<Text
	style={[
		appStyles.registerDateFieldText,
		!selectedDateLabel && appStyles.registerDateFieldPlaceholder,
	]}
>
	{selectedDateLabel ?? 'Insira a data...'}
</Text>
```

Time field:

```tsx
<Text
	style={[
		appStyles.registerDateFieldText,
		!selectedTimeLabel && appStyles.registerDateFieldPlaceholder,
	]}
>
	{selectedTimeLabel ?? 'Insira a hora...'}
</Text>
```

- [ ] **Step 9: Add placeholder style**

Add this beside `registerDateFieldText` in `src/styles/appStyles.ts`:

```ts
registerDateFieldPlaceholder: {
	color: colors.muted,
},
```

### Task 3: Verification

**Files:**
- Verify: `src/screens/RegisterScreen.tsx`
- Verify: `src/styles/appStyles.ts`

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`

Expected: command exits successfully.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: command exits successfully or reports only pre-existing unrelated warnings.

## Self-Review

Spec coverage: image loading, nullable date/time fields, fallback rules, and verification are covered. No placeholders. Type names and state names are consistent.
