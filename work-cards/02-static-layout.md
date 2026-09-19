# Work Card 02 — Static Layout

## Goal

Build the static bookshelf layout: 5 shelves (Mon–Fri), frosted glass shelves, book spines with width by duration, type icons, spine labels (course code, subject, time). No interactivity yet — pure static render with sample data.

## Inputs

- `build-blueprint.md` — Component Map, File Expectations, Design Direction
- `design.md` — Layout Rules, Component Style, Color/Contrast, Mobile Rules
- `work-cards/01-project-skeleton.md` — completed scaffold

## Files likely touched

```
/src/components/WeeklyGrid.tsx
/src/components/DayColumn.tsx
/src/components/ClassBlock.tsx
/src/components/FilterBar.tsx
/src/components/EmptyState.tsx
/src/utils/time.ts
/src/utils/colors.ts
/src/App.tsx
/src/types/schedule.ts (import only)
```

## Instructions for the coding agent

1. Create sample data in `App.tsx` (5–6 classes across Mon–Fri, varying durations/types):
   ```ts
   const sampleClasses: Class[] = [
     { id: '1', name: 'Calculus I', lectureName: 'Prof. Smith', day: 0, startTime: '09:00', endTime: '10:30', type: 'lecture', color: '#3b82f6', reminders: [] },
     { id: '2', name: 'Physics Lab', lectureName: 'Dr. Chen', day: 0, startTime: '11:00', endTime: '13:00', type: 'lab', color: '#ef4444', reminders: [] },
     { id: '3', name: 'Chemistry', lectureName: 'Prof. Lee', day: 1, startTime: '10:00', endTime: '11:30', type: 'lecture', color: '#22c55e', reminders: [] },
     { id: '4', name: 'English Lit', lectureName: 'Ms. Davis', day: 2, startTime: '13:00', endTime: '14:30', type: 'tutorial', color: '#f59e0b', reminders: [] },
     { id: '5', name: 'History', lectureName: 'Prof. Brown', day: 3, startTime: '09:00', endTime: '10:30', type: 'lecture', color: '#8b5cf6', reminders: [] },
     { id: '6', name: 'CS Final', lectureName: 'Dr. Wilson', day: 4, startTime: '14:00', endTime: '16:00', type: 'exam', color: '#ec4899', reminders: [] },
   ];
   ```
2. Write `src/utils/time.ts`:
   - `parseTime('09:00') → { hours: 9, minutes: 0 }`
   - `formatTime({ hours, minutes }) → '09:00'`
   - `durationMinutes(start, end) → number`
   - `sortByTime(a, b) → number`
   - `timeToPercent(time, dayStart='08:00', dayEnd='20:00') → 0–100` (for book positioning)
3. Write `src/utils/colors.ts`:
   - `SUBJECT_PALETTE: string[]` — 10 accessible hues (WCAG AA on light/dark)
   - `getSubjectColor(subjectName: string) → string` — deterministic hash → palette index
   - `getContrastText(bgColor: string) → '#1a1a2e' | '#f5f5f5'` — luminance check
4. Write `src/components/ClassBlock.tsx`:
   - Props: `classItem: Class`, `onClick: () => void`
   - Width: `durationMinutes / 30 * unitWidth` (or CSS `--book-unit` = 30min)
   - Style: `background: classItem.color`, `color: getContrastText(classItem.color)`
   - Spine: three lines — course code (uppercase, small), subject (medium), time (small)
   - Type icon: `TYPE_ICONS[classItem.type]` prefix on subject line
   - Hover: `transform: translateY(-3px)`, `box-shadow: var(--shadow-hover)`
   - Focus: `outline: none`, `box-shadow: var(--focus-ring)`
   - Cursor: pointer, `role="button"`, `tabIndex=0`, `aria-label`
5. Write `src/components/DayColumn.tsx`:
   - Props: `day: 0-4`, `classes: Class[]`, `onClassClick: (c) => void`
   - Filter classes by day, sort by startTime
   - Render label (Mon/Tue/...) + shelf track (frosted glass)
   - Map classes to `ClassBlock` with `onClick`
   - If no classes: render `EmptyState` with day-specific message
6. Write `src/components/WeeklyGrid.tsx`:
   - Props: `classes: Class[]`, `onClassClick: (c) => void`
   - Render 5 `DayColumn`s in horizontal flex (desktop) / vertical stack (mobile)
   - Container: `.shelves` with gap, max-width, centered
7. Write `src/components/FilterBar.tsx` (static for now):
   - Day pills: All + Mon–Fri, `All` active by default
   - Search input: placeholder "Search classes..."
   - No wiring yet — just render
8. Write `src/components/EmptyState.tsx`:
   - Props: `message: string`, `action?: React.ReactNode`
   - Illustration: SVG open book icon
   - Centered, muted text, optional action button
9. Update `src/App.tsx`:
   - Import components, sample data
   - Render `<FilterBar />` + `<WeeklyGrid classes={sampleClasses} onClassClick={() => {}} />`
   - Pass `onClassClick` as no-op for now
10. Ensure CSS in `layout.css` handles:
    - `.shelves` — flex row, gap, overflow-x-auto on mobile
    - `.shelf` — flex-1, min-width 0, frosted glass bg, blur, rounded
    - `.book` — height 100%, min-width, rounded-top, display flex, flex-col, justify-end, padding
    - Mobile: `@media (max-width: 640px) { .shelves { flex-direction: column; } }`
11. Run `npm run dev`, verify visual layout matches `design.md`.

## What not to do

- No modal, no add/edit/delete logic
- No localStorage integration
- No filter/search functionality (UI only)
- No dynamic color assignment — use sample data colors

## Done when

- 5 shelves render Mon–Fri with frosted glass background
- Books appear on correct days, width ∝ duration
- Spines show course code, subject + type icon, time — all horizontal, readable
- Type icons visible (📘📓📒📕)
- Hover lift works on desktop (3px up + shadow)
- Focus ring visible on keyboard tab
- Mobile: shelves stack vertically, no horizontal overflow
- EmptyState shows on empty days
- FilterBar renders (non-functional)
- No console errors

## Verification steps

- [ ] `npm run dev` starts clean
- [ ] 5 shelves visible, labeled Mon–Fri
- [ ] Sample classes render on correct days
- [ ] Book widths visually proportional to duration (90min ≈ 2× 45min)
- [ ] Spine text: course code / subject+icon / time — all upright
- [ ] Hover lift + shadow on desktop
- [ ] Tab through books → focus ring visible
- [ ] Mobile width (375px): shelves stack, books readable
- [ ] Empty day shows illustration + "No classes on [Day]"
- [ ] FilterBar renders with day pills + search input
- Design check: item card/list, shelf style, frosted glass, spine typography, color contrast, mobile stacking follow `design.md`

## Localhost test before continuing

After this card, the learner should test:

- Open localhost — 5 shelves, books on correct days
- Hover a book — lifts slightly with shadow
- Tab to a book — focus ring appears
- Resize to mobile width — shelves stack vertically, no cutoff
- Empty day (if any) shows illustration + message

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If layout breaks on mobile, or spine text overflows, or hover/focus missing — stop and fix.

## Status

Done