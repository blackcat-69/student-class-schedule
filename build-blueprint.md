# Build Blueprint

## Source Files

- `project-brief.md` — project identity, user, scope, build shape, success target
- `architecture.md` — stack, structure, logic, data/storage decisions
- `design.md` — inspiration translated into layout, style, mobile, accessibility, anti-slop rules

## Project Identity

**Student Class Schedule** — A browser-local weekly class schedule where students can view, add, edit classes and reminders, filter by day, and have data persist in localStorage.

**Target User:** Students managing their weekly class schedule

**User Goal:** See weekly view of classes, add/edit classes and reminders, filter by day or class, with a clean, easy-to-navigate interface

**Build Shape:** Browser-local tool (confirmed)

## Version-One Promise

A working bookshelf-style schedule (Mon–Fri shelves, books=classes) with:
- Add/edit/delete classes (name, lecture name, day, start/end time, type, color, reminders)
- Book width = duration, book style = type (lecture/lab/tutorial)
- Spine shows course code, subject, time
- Hover lift + click-to-open modal with details + quick-launch links
- Filter by day pills + search
- localStorage persistence (key: `student-schedule`)
- Responsive: stacks on mobile, bottom-sheet modal
- Accessible: keyboard, ARIA, focus trap, WCAG AA contrast, reduced motion

## Scope Lock

### Now

- 5 horizontal shelves (Mon–Fri) with frosted glass aesthetic
- Books as classes: width ∝ duration, style = type (textbook/spiral/etc.)
- Spine labels: course code, subject name, time block (all horizontal)
- Hover elevation (desktop), tap to open (mobile)
- Detail modal: instructor, location, time, type badge, quick-launch links (portal/video/PDF)
- Day filter pills (All/Mon–Fri) + search input
- Add class: floating "+" → modal form with all fields + reminder list
- Edit: click book → pre-filled modal
- Delete: trash icon in modal → confirm → remove
- localStorage key `student-schedule` with versioning
- Empty states per shelf + global no-results
- System font stack, fluid type, accessible color palette (10 subject hues)
- Dark mode CSS variables (opt-in v1)

### Later

- Recurring reminders
- Export/import schedule (JSON)
- Full dark mode toggle
- Multiple week view (prev/next)
- Drag-and-drop rescheduling
- Overlap detection warnings
- iCal/Google Calendar sync (trainer approval needed)

### Never

- Login/auth
- Backend/database
- Multi-user sync
- Payments
- Live API integration
- Third-party analytics/tracking
- External font loads

## Architecture Summary

**Stack:** Vite + React + plain CSS + localStorage only

**Structure:** Single-page React app. `App` holds state + filters + localStorage sync. `WeeklyGrid` renders 5 `DayColumn`s (Mon–Fri). Each `DayColumn` maps classes to `ClassBlock` books laid out by start time. `FilterBar` (sticky) controls day + search. `AddClassButton` opens `ClassFormModal`. `ClassFormModal` handles add/edit with `ReminderList` inline. `EmptyState` shows when no classes match.

**State Model:**
```ts
type Reminder = { id: string; text: string; time: string };
type Class = {
  id: string;
  name: string;           // "Calculus I"
  lectureName: string;    // "Prof. Smith"
  day: 0|1|2|3|4|5|6;     // Mon–Sun (Sun hidden in v1)
  startTime: string;      // "09:00"
  endTime: string;        // "10:30"
  type: 'lecture'|'lab'|'tutorial'|'exam';
  color: string;          // subject-assigned hue
  reminders: Reminder[];
};
type ScheduleState = {
  classes: Class[];
  filters: { day: 'all'|0|1|2|3|4|5|6; search: string };
};
```

**Storage:** Key `student-schedule`. On mount: read, parse, fallback to `[]`. On change: debounced (300ms) write. Format: `{ version: 1, classes: [...] }`.

**Constraints:** Single data type (Class + Reminders). Max 7 fields. No backend. Mobile-first. Accessible.

## Design Direction Summary

**Borrow from inspiration:**
- Bookshelf metaphor: 5 shelves = Mon–Fri, spatial time mapping
- Book width = duration (visual time-blocking)
- Book style = class type (textbook/spiral/icon)
- Spine labels: course code, subject, time (horizontal, readable)
- Hover lift + click modal for details + quick links
- Frosted glass shelves, clean premium feel
- Dynamic subject color-coding for at-a-glance differentiation

**Do NOT copy:**
- Realistic wood grain / heavy textures → use subtle frosted glass
- Cluttered spines → minimal, horizontal text only
- Angled/curved spine text → all upright
- Animation overload → subtle 2–4px lift, 150ms modal fade only
- Fake logos, testimonials, stats, lorem ipsum
- Inaccessible contrasts → WCAG AA minimum everywhere

**Visual mood:** Student-friendly, calm, premium. Light/airy/organized. Muted subject colors. Generous whitespace. Rounded 8–12px. Subtle shadows.

## Implementation Rules

1. **Read first:** Always read `build-status.md`, `build-blueprint.md`, and current work card before editing.
2. **One card at a time:** Implement only the current work card. Do not jump ahead.
3. **Verify then stop:** Run verification steps, update `build-status.md`, stop for learner check.
4. **No scope creep:** No backend, auth, database, API, secrets, keys unless blueprint explicitly allows.
5. **No invented content:** No fake logos, testimonials, stats, real numbers, lorem ipsum in proof.
6. **Build shape guardrails:** Browser-local tool = one data type, localStorage only, no multi-user, no server.
7. **Design fidelity:** Follow `design.md` rules — frosted glass, book spines, color palette, mobile stacking, accessibility.
8. **CSS approach:** Plain CSS with custom properties. No Tailwind. Use CSS variables for theming (light/dark ready).
9. **Type safety:** TypeScript strict mode. Types in `/src/types/schedule.ts`.
10. **Performance:** Debounced localStorage (300ms). Memoize filtered classes. Lazy-load modal.

## File and Folder Expectations

```
/src
  /components
    WeeklyGrid.tsx        // renders 5 DayColumns
    DayColumn.tsx         // one shelf, label + books
    ClassBlock.tsx        // book spine, hover/tap → modal
    AddClassButton.tsx    // floating "+"
    ClassFormModal.tsx    // add/edit form + ReminderList
    FilterBar.tsx         // day pills + search
    EmptyState.tsx        // illustration + message + CTA
    ReminderList.tsx      // inline add/edit/delete reminders
    DetailModal.tsx       // read-only detail + quick-launch links
  /hooks
    useLocalStorage.ts    // generic localStorage sync with debounce
    useSchedule.ts        // schedule CRUD + filter logic
  /types
    schedule.ts           // Class, Reminder, ScheduleState, filters
  /utils
    time.ts               // parse, format, sort, duration, overlap
    colors.ts             // subject palette (10 hues), contrast picker
    constants.ts          // DAYS, TYPE_ICONS, STORAGE_KEY
  /styles
    variables.css         // CSS custom properties (colors, spacing, radii, shadows)
    reset.css             // normalize
    layout.css            // grid, shelf, book, modal, mobile
    components.css        // buttons, inputs, pills, badges, focus rings
  App.tsx                 // root, state, providers
  main.tsx                // entry
  index.css               // imports all /styles
```

## Work Card Plan

| Card | Title | Scope |
|------|-------|-------|
| 01 | Project Scaffold | `npm create vite@latest . -- --template react-ts`, install deps, folder structure, CSS variables, TypeScript config |
| 02 | Types & Storage Hook | `schedule.ts` types, `useLocalStorage.ts`, `useSchedule.ts` with CRUD + filter |
| 03 | Utility Functions | `time.ts` (parse, format, sort, duration), `colors.ts` (palette, contrast), `constants.ts` |
| 04 | FilterBar Component | Day pills (All/Mon–Fri), search input, controlled by App |
| 05 | DayColumn + ClassBlock | Shelf layout, book width by duration, spine labels, type icon, hover lift, click → modal |
| 06 | WeeklyGrid + EmptyState | 5 columns, responsive stack, empty state per day + global |
| 07 | ClassFormModal + ReminderList | Add/edit form (all 7 fields), reminder inline list, validation, save/cancel |
| 08 | DetailModal + Quick Links | Read-only detail, instructor, location, type badge, launch buttons (portal/video/PDF) |
| 09 | AddClassButton + App Integration | Floating "+", wiring all modals, state flow, localStorage sync |
| 10 | Polish & Accessibility | Focus rings, ARIA, focus trap, reduced motion, keyboard nav, contrast audit, mobile bottom-sheet |
| 11 | Sample Data & Proof Build | 5–6 real sample classes, Vercel deploy, refresh-persistence test, screenshots |

## Review Mirror

After each work card, the coding agent runs the Review Mirror:
1. Lint + typecheck (`npm run lint && npm run typecheck`)
2. Visual check against `design.md` rules
3. Functional test per card's verification steps
4. Update `build-status.md` with completed card
5. Stop for learner confirmation before next card

## Proof Ladder

1. **Local dev:** `npm run dev` — all cards work, no console errors
2. **Build:** `npm run build` — clean production build
3. **Preview:** `npm run preview` — verify production build
4. **GitHub:** Push to repo, verify Actions (lint/typecheck/build)
5. **Vercel:** Deploy, verify live URL
6. **Persistence proof:** Add class → refresh → class remains (video/GIF)
7. **Mobile proof:** Chrome DevTools device toolbar — stack, bottom-sheet, touch targets

## 60-Second Explanation Template

> "This is a student class schedule built as a browser-local tool. The UI is a bookshelf: five shelves for Monday through Friday. Each class is a book — width shows duration, style shows type (lecture, lab, tutorial). Spines show course code, subject, and time. Hover a book to lift it; click to open a modal with instructor, location, and quick-launch links for the portal, video call, or syllabus. Filter by day or search by name. All data saves to localStorage instantly — refresh and your schedule is still there. No login, no backend, no database. Built with Vite, React, plain CSS, and TypeScript. Deployed on Vercel."

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, and the current work card before editing
- Implement only the current work card; do not jump ahead
- Stop after verification; update `build-status.md` after each work card
- Do not add backend, auth, database, API, secrets, or keys
- Do not invent claims, testimonials, logos, or real numbers
- Apply browser-local tool guardrails: one data type, localStorage only, no multi-user, no server
- Follow `design.md` exactly: frosted glass shelves, book spines, color palette, mobile stacking, accessibility rules
- If a legacy file uses `Build Mode`, treat it as `Build Shape` without stopping
- Use plain CSS with custom properties; no Tailwind, no external fonts
- TypeScript strict mode; all types in `/src/types/schedule.ts`
- Debounce localStorage writes (300ms); memoize derived state
- Respect `prefers-reduced-motion`; WCAG AA contrast minimum