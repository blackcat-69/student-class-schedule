# Work Card 04 — Update/Delete Item

## Goal

Implement edit and delete for existing classes: click a book → modal pre-filled → save updates shelf; delete button in modal → confirm → removes class.

## Inputs

- `build-blueprint.md` — User Flow steps 5–7, Component Map (ClassBlock click, ClassFormModal edit, DetailModal)
- `design.md` — Component Style (modal actions), Accessibility (focus management, ARIA)
- `work-cards/03-add-item.md` — completed add flow, modal component ready

## Files likely touched

```
/src/components/ClassBlock.tsx (add onClick → edit)
/src/components/ClassFormModal.tsx (support initialData for edit)
/src/components/DetailModal.tsx (new: read-only detail + quick-launch links)
/src/hooks/useSchedule.ts (updateClass, deleteClass)
/src/App.tsx (wire edit/delete, state for detail modal)
/src/styles/components.css (detail modal, quick-launch buttons)
```

## Instructions for the coding agent

1. Update `src/hooks/useSchedule.ts`:
   - `updateClass(id, patch)` — merges patch into class, returns updated array
   - `deleteClass(id)` — filters out class, returns updated array
2. Create `src/components/DetailModal.tsx`:
   - Props: `classItem: Class | null`, `isOpen: boolean`, `onClose: () => void`, `onEdit: () => void`, `onDelete: () => void`
   - Read-only detail view: subject + course code (header), instructor, location (placeholder), time range, type badge, reminders list
   - Quick-launch links (3 buttons):
     - Portal (primary) — `href="#"` placeholder, `target="_blank"`, `rel="noopener"`
     - Video call (secondary) — same
     - Syllabus PDF (ghost) — same
   - Footer actions: Edit (pencil icon + text), Delete (trash icon + text, destructive style)
   - Same modal styling as ClassFormModal (frosted glass, focus trap, bottom-sheet mobile)
   - `aria-labelledby="detail-title"`
3. Update `src/components/ClassFormModal.tsx`:
   - Accept `initialData?: Class` prop
   - If `initialData` provided: pre-fill all fields, set `reminders`, show "Delete" button in footer (next to Cancel)
   - On save with `initialData`: call `onSave({ ...formData, id: initialData.id, color: initialData.color })` — preserve ID and color
   - On delete click: `onClose()`, then parent calls `deleteClass(id)` after confirm
4. Update `src/components/ClassBlock.tsx`:
   - Click handler: instead of direct edit, open `DetailModal` with `classItem`
   - Keep hover/focus styles
5. Update `src/App.tsx`:
   - State: `detailClass: Class | null`
   - `handleClassClick(classItem)` → `setDetailClass(classItem)`
   - `handleEditFromDetail()` → `setEditingClass(detailClass)`, `setModalMode('edit')`, `setDetailClass(null)`
   - `handleDeleteFromDetail()` → `confirm('Delete this class?')` → `deleteClass(detailClass.id)`, `setDetailClass(null)`
   - Render `DetailModal` with props wired
   - Pass `onClassClick={handleClassClick}` to `WeeklyGrid`
   - `ClassFormModal` receives `initialData={editingClass}` when `modalMode === 'edit'`
   - `handleSave` distinguishes add vs edit: if `editingClass` → `updateClass`, else → `addClass`
6. Update `src/styles/components.css`:
   - `.detail-modal` — same as form modal
   - `.quick-launch` — flex gap, button variants
   - `.type-badge` — inline, rounded, muted bg
   - `.reminder-list-readonly` — simple list
   - `.modal-footer .btn-danger` — destructive style
7. Run `npm run dev`, test edit and delete flows.

## What not to do

- No localStorage persistence yet
- No actual portal/video/PDF links (placeholders only)
- No drag-and-drop
- No overlap detection on edit

## Done when

- Click a book → DetailModal opens with correct data
- DetailModal shows: subject+code, instructor, time range, type badge, reminders, 3 quick-launch buttons
- Click "Edit" → DetailModal closes, ClassFormModal opens pre-filled
- Edit fields, Save → shelf updates immediately (width, spine, color if subject changed)
- Click "Delete" → confirm dialog → class removed from shelf
- Focus management: DetailModal → FormModal → shelf (original book or next)
- Mobile: both modals are bottom-sheets
- No console errors

## Verification steps

- [ ] Click existing book → DetailModal opens with correct data
- [ ] DetailModal shows all fields read-only + quick-launch buttons
- [ ] Click Edit → FormModal opens pre-filled with same data
- [ ] Change subject name → Save → spine updates on shelf
- [ ] Change time → Save → book width/position updates
- [ ] Change type → Save → icon updates
- [ ] Click Delete → confirm → class removed from shelf
- [ ] Edit then cancel → no changes persisted
- [ ] Focus returns to correct element after each modal close
- [ ] Mobile: both modals work as bottom-sheets
- Design check: update/mark state style, delete affordance, detail modal, quick-launch links, mobile bottom-sheet follow `design.md`

## Localhost test before continuing

After this card, the learner should test:

- Click a book → DetailModal opens
- Click Edit → change subject name → Save → verify shelf updates
- Click a book → Delete → confirm → verify class gone
- Test on mobile width — both modals are bottom-sheets

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If edit doesn't pre-fill, save doesn't update shelf, or delete doesn't remove — stop and fix.

## Status

Done