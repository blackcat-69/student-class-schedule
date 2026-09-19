# Architecture

## Build Shape

Browser-local tool

## Stack Decision

- Vite
- React
- Plain CSS (no Tailwind)
- localStorage for persistence
- No backend, auth, database, payments, or live API

## Structure Overview

Single-page React app with a weekly grid layout (Mon–Sun). Classes render as colored blocks in their day/time slots. A modal form handles add/edit. A filter bar lets users filter by day and class name. All state lives in React and syncs to localStorage.

## Component Map

- `App` — root, holds schedule state, filters, localStorage sync
- `WeeklyGrid` — renders 7 day columns with time slots
- `DayColumn` — one day, lists classes in time order
- `ClassBlock` — clickable colored block for a class; opens edit modal
- `AddClassButton` — floating "+" button, opens empty add modal
- `ClassFormModal` — form with fields: name, lecture name, day, start time, end time, color, reminders (list)
- `FilterBar` — day filter (All/Mon/Tue/...), class name search input
- `EmptyState` — shows when no classes match filters
- `ReminderList` — inline list inside ClassFormModal for adding/editing/deleting reminders per class

## Data / State Model

```ts
type Reminder = {
  id: string;
  text: string;
  time: string; // e.g., "10 min before"
};

type Class = {
  id: string;
  name: string;           // e.g., "Calculus I"
  lectureName: string;    // e.g., "Prof. Smith"
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Mon ... 6=Sun
  startTime: string;      // "09:00" 24h
  endTime: string;        // "10:30" 24h
  color: string;          // hex or preset
  reminders: Reminder[];
};

type ScheduleState = {
  classes: Class[];
  filters: {
    day: 'all' | 0 | 1 | 2 | 3 | 4 | 5 | 6;
    search: string;
  };
};
```

## Storage Logic

- Key: `student-schedule`
- On app mount: read JSON from localStorage, parse into state, handle missing/corrupt gracefully (fallback to empty array)
- On any state change: debounced write to localStorage
- Versioning: store `{ version: 1, classes: [...] }` to allow future migration

## User Flow

1. App loads → reads `student-schedule` from localStorage
2. WeeklyGrid renders with current filters
3. User clicks "+" → ClassFormModal opens (empty)
4. User fills fields, adds reminders, saves → new Class added to state → localStorage updated
5. User clicks existing ClassBlock → ClassFormModal opens pre-filled
6. User edits/saves → state updated → localStorage updated
7. User clicks delete on ClassBlock → confirm → removed from state → localStorage updated
8. User changes filters → grid re-renders filtered classes
9. Refresh browser → data persists

## File Expectations

```
/src
  /components
    WeeklyGrid.tsx
    DayColumn.tsx
    ClassBlock.tsx
    AddClassButton.tsx
    ClassFormModal.tsx
    FilterBar.tsx
    EmptyState.tsx
    ReminderList.tsx
  /hooks
    useLocalStorage.ts
  /types
    schedule.ts
  /utils
    time.ts          // time parsing, sorting, overlap detection
    colors.ts        // preset color palette
  App.tsx
  main.tsx
  index.css
```

## Constraints

- Single data type (Class) with sub-items (Reminders)
- Max 7 fields per class
- localStorage only
- No multi-user, no backend
- Mobile-first responsive
- Accessible: keyboard navigation, ARIA labels, focus management in modal

## Technical Non-Goals

- No authentication
- No server/API
- No database
- No payments
- No real-time sync
- No drag-and-drop (v1)
- No recurring rules engine (v1)

## Verification Notes

- Add a class → refresh → class remains
- Edit a class → refresh → changes remain
- Delete a class → refresh → class gone
- Filter by day → only that day shows
- Filter by search → only matching names show
- Empty state shows when no classes or no matches
- Mobile: grid stacks to single column, modal fits screen