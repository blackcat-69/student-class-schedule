# Work Card 03 — Add Item

## Goal

Implement the "Add Class" flow: floating "+" button → modal form with all 7 fields + reminder list → save adds class to state and re-renders shelves.

## Inputs

- `build-blueprint.md` — Component Map (AddClassButton, ClassFormModal, ReminderList), User Flow steps 3–4
- `design.md` — Component Style (modal, form, buttons), Mobile Rules (bottom-sheet), Accessibility (focus trap, ARIA)
- `work-cards/02-static-layout.md` — completed static shelves

## Files likely touched

```
/src/components/AddClassButton.tsx
/src/components/ClassFormModal.tsx
/src/components/ReminderList.tsx
/src/hooks/useSchedule.ts
/src/App.tsx
/src/styles/components.css (modal, form, button styles)
```

## Instructions for the coding agent

1. Write `src/hooks/useSchedule.ts`:
   - State: `classes: Class[]`, `filters: { day, search }`
   - Actions: `addClass(class)`, `updateClass(id, patch)`, `deleteClass(id)`, `setFilters(filters)`
   - Derived: `filteredClasses` — applies day + search filter
   - Return `{ classes, filteredClasses, filters, addClass, updateClass, deleteClass, setFilters }`
   - No localStorage yet — pure in-memory state
2. Write `src/components/AddClassButton.tsx`:
   - Floating button, bottom-right (desktop) / bottom-center (mobile)
   - Props: `onClick: () => void`
   - Style: `var(--glass-bg)`, `var(--glass-blur)`, `var(--shadow-lg)`, rounded-full, icon "+"
   - Hover: scale 1.05, focus ring
   - `aria-label="Add class"`
3. Write `src/components/ReminderList.tsx`:
   - Props: `reminders: Reminder[]`, `onChange: (reminders: Reminder[]) => void`
   - Render list of reminders with: text input, time select (5/10/15/30/60 min before), delete button
   - "Add reminder" button appends empty reminder
   - Each reminder: unique `id` (crypto.randomUUID())
   - Accessible: labels, keyboard operable
4. Write `src/components/ClassFormModal.tsx`:
   - Props: `isOpen: boolean`, `onClose: () => void`, `onSave: (classData: Omit<Class,'id'>) => void`, `initialData?: Class` (for edit)
   - Modal: frosted glass panel, centered (desktop) / bottom-sheet (mobile), `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
   - Focus trap: `Tab` cycles within modal, `Esc` closes, click backdrop closes
   - Form fields (all required unless noted):
     - Course code (text, uppercase, max 10 chars)
     - Subject name (text, max 50)
     - Lecture name (text, max 50)
     - Type (select: lecture/lab/tutorial/exam)
     - Day (select: Mon–Fri)
     - Start time (input type="time")
     - End time (input type="time", > start)
     - Color (hidden — auto-assigned from subject via `getSubjectColor`)
   - ReminderList embedded
   - Buttons: Cancel (ghost), Save (primary, disabled until valid)
   - Validation: all required, end > start, no overlap detection (v1: skip)
   - On save: call `onSave({ ...formData, color: getSubjectColor(subject), reminders })`
5. Update `src/App.tsx`:
   - Use `useSchedule` hook
   - State: `modalMode: 'add' | 'edit' | null`, `editingClass: Class | null`
   - `handleAddClick` → `setModalMode('add')`, `setEditingClass(null)`
   - `handleSave` → `addClass(newClass)`, `closeModal()`
   - Render `AddClassButton onClick={handleAddClick}`
   - Render `ClassFormModal` with props wired
   - Pass `filteredClasses` to `WeeklyGrid`
6. Update `src/styles/components.css`:
   - `.modal-overlay`, `.modal-panel`, `.modal-header`, `.modal-body`, `.modal-footer`
   - `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-error`
   - `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
   - Mobile bottom-sheet: `@media (max-width: 640px) { .modal-panel { position: fixed; bottom: 0; left: 0; right: 0; border-radius: var(--radius-xl) var(--radius-xl) 0 0; max-height: 85vh; } }`
7. Run `npm run dev`, test add flow end-to-end.

## What not to do

- No edit/delete yet (modal supports `initialData` but not wired)
- No localStorage persistence
- No overlap detection
- No filter wiring (FilterBar still static)

## Done when

- "+" button opens modal (centered desktop, bottom-sheet mobile)
- Form has all 7 fields + reminder list
- Validation works (required, time order)
- "Add reminder" adds row, delete removes row
- Save adds class to shelves immediately
- New book appears on correct day, correct width, correct spine
- Modal closes on save, cancel, Esc, backdrop click
- Focus trapped in modal, focus returns to "+" button on close
- Mobile: bottom-sheet slides up, drag-to-dismiss not required v1
- No console errors

## Verification steps

- [ ] Click "+" → modal opens (desktop centered, mobile bottom-sheet)
- [ ] Form shows all fields: course code, subject, lecture, type, day, start, end, reminders
- [ ] Validation: empty submit shows errors, end < start shows error
- [ ] Add 2 reminders, delete one — list updates
- [ ] Fill valid data, click Save → modal closes, new book appears on shelf
- [ ] Book spine shows course code, subject+icon, time
- [ ] Book color matches subject auto-color
- [ ] Book width matches duration
- [ ] Tab through modal — focus trapped, Esc closes, focus returns to "+"
- [ ] Mobile: modal is bottom-sheet, scrollable if tall
- Design check: input form placement, modal style, button hierarchy, focus trap, mobile bottom-sheet follow `design.md`

## Localhost test before continuing

After this card, the learner should test:

- Click "+" → modal opens
- Fill valid class (e.g., "CS101", "Intro to CS", "Prof. Turing", "lecture", "Mon", "10:00", "11:30", add 1 reminder)
- Click Save → class appears on Monday shelf
- Verify spine text, width, color, icon correct
- Open on mobile width — modal is bottom-sheet

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If modal doesn't open, form validation broken, or new book doesn't render — stop and fix.

## Status

Done