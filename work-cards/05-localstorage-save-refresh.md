# Work Card 05 — LocalStorage Save & Refresh Persistence

## Goal

Wire localStorage persistence: load on mount, debounced save on change, versioned storage. Prove refresh persistence.

## Inputs

- `build-blueprint.md` — Storage Logic, User Flow steps 1, 9
- `architecture.md` — Storage Logic (key, versioning, debounce)
- `work-cards/04-update-delete-item.md` — completed CRUD in memory

## Files likely touched

```
/src/hooks/useLocalStorage.ts
/src/hooks/useSchedule.ts (integrate localStorage)
/src/App.tsx (initialize from storage)
/src/utils/constants.ts (STORAGE_KEY, STORAGE_VERSION)
```

## Instructions for the coding agent

1. Write `src/hooks/useLocalStorage.ts`:
   - Generic hook: `useLocalStorage<T>(key: string, initialValue: T, options?: { version?: number; debounceMs?: number })`
   - On mount: read `localStorage.getItem(key)`, parse JSON
   - If stored version ≠ current version or parse fails → return `initialValue`
   - State: `value`, `setValue` (updates state + queues debounced write)
   - Debounced write: `setTimeout` with `debounceMs` (default 300ms), writes `{ version, data: value }`
   - Return `[value, setValue]`
   - Handle SSR safety (check `typeof window !== 'undefined'`)
2. Update `src/utils/constants.ts`:
   - `export const STORAGE_KEY = 'student-schedule'`
   - `export const STORAGE_VERSION = 1`
3. Update `src/hooks/useSchedule.ts`:
   - Replace internal `useState` for classes with `useLocalStorage<Class[]>(STORAGE_KEY, [], { version: STORAGE_VERSION, debounceMs: 300 })`
   - Keep filters in local state (not persisted)
   - `addClass`, `updateClass`, `deleteClass` call `setClasses` (from hook) — triggers debounced save
   - Derived `filteredClasses` still applies day + search filter
4. Update `src/App.tsx`:
   - Remove sample data constant
   - `useSchedule` now loads from localStorage automatically
   - If `classes.length === 0` on mount → optionally seed with 1 sample class (for first-run UX)
5. Test persistence:
   - Add a class → wait 500ms → refresh browser (F5) → class remains
   - Edit a class → refresh → changes remain
   - Delete a class → refresh → class gone
   - Add multiple classes across days → refresh → all remain in correct positions
6. Verify no hydration mismatch (SSR not used in Vite SPA, but good practice)

## What not to do

- No migration logic beyond version check (v1 only)
- No export/import
- No compression
- No error UI for quota exceeded (browser handles)

## Done when

- App loads classes from `student-schedule` on mount
- Any change (add/edit/delete) writes to localStorage within 300ms
- Refresh (F5) preserves all classes, positions, data
- Storage format: `{ "version": 1, "data": [...] }`
- No console errors on load/save
- Works in incognito/private mode (localStorage available)

## Verification steps

- [ ] Fresh localhost → no classes (or 1 seed class)
- [ ] Add class → wait → refresh → class persists
- [ ] Edit class (change name/time) → refresh → changes persist
- [ ] Delete class → refresh → class gone
- [ ] Add 5 classes across Mon–Fri → refresh → all present, correct days, correct widths
- [ ] Open DevTools Application → LocalStorage → `student-schedule` shows `{ version: 1, data: [...] }`
- [ ] No errors in console on load or save
- Design check: refresh proof visibility — data survives refresh visibly

## Localhost test before continuing

After this card, the learner should test:

- Add a class → wait 1 second → press F5 (hard refresh) → class still there
- Edit that class → change subject name → F5 → new name shows
- Delete that class → F5 → class gone
- Check DevTools → LocalStorage → `student-schedule` key exists with versioned data

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If data doesn't persist after refresh, or localStorage key missing, or version mismatch — stop and fix.

## Status

Done