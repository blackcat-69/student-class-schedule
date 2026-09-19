# Work Card 06 — Review & Fix

## Goal

Full review against `design.md`, `build-blueprint.md`, and all verification checklists. Fix the single smallest useful issue. Polish accessibility, mobile, and visual fidelity.

## Inputs

- `design.md` — Design Verification Checklist, all rules
- `build-blueprint.md` — Review Mirror, Guardrails, Proof Ladder
- `work-cards/01` through `05` — completed implementation

## Files likely touched

```
/src/styles/*.css (polish)
/src/components/*.tsx (accessibility, edge cases)
/src/hooks/*.ts (edge cases)
/src/App.tsx (seed data, error boundaries)
/index.html (meta, title)
```

## Instructions for the coding agent

1. Run `npm run lint && npm run typecheck` — fix all errors.
2. Run `npm run build` — fix any build errors.
3. Visual review against `design.md` Design Verification Checklist:
   - [ ] 5 shelves Mon–Fri, labeled correctly
   - [ ] Book width ∝ duration
   - [ ] Book style/icon = type
   - [ ] Spine: course code, subject, time — horizontal, readable
   - [ ] Hover lift + shadow (desktop)
   - [ ] Click → DetailModal with details + quick-launch links
   - [ ] Subject color-coding distinct, accessible
   - [ ] Frosted glass shelves with blur
   - [ ] Filter by day pills works
   - [ ] Search filters by subject/code
   - [ ] Empty state per day + global no-results
   - [ ] Modal: focus trap, Esc closes, backdrop closes
   - [ ] Mobile: stacks vertical, bottom-sheet modals, 44px touch targets
   - [ ] Dark mode CSS variables present (opt-in)
   - [ ] WCAG AA contrast on all text
   - [ ] `prefers-reduced-motion` respected (no lift, instant modal)
   - [ ] No lorem ipsum, no fake content in proof
4. Accessibility audit:
   - Tab through entire app — focus visible everywhere
   - `role="button"` + `tabIndex=0` on ClassBlock
   - `aria-label` on each book with subject, day, time
   - Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
   - Focus trap in both modals
   - Form labels associated with inputs
   - Color not sole indicator (type has icon + label)
5. Mobile test (Chrome DevTools 375px):
   - Shelves stack, no horizontal scroll
   - Books readable, spines not cut off
   - "+" button reachable (bottom-center)
   - Modals: bottom-sheet, scrollable, drag-to-dismiss optional
   - FilterBar: scrollable day pills, search below
   - Touch targets ≥ 44px
6. FilterBar wiring (if not done):
   - Connect day pills + search to `useSchedule` filters
   - Active pill highlighted, "All" resets
   - Search debounced 200ms
7. Seed data: if localStorage empty, add 1 sample class (e.g., "Welcome", "Your Schedule", "KDBM Lite", "lecture", "Mon", "09:00", "10:00")
8. `index.html`: update `<title>`, meta description, viewport, theme-color
9. Identify **one** smallest useful fix (visual polish, a11y, mobile edge case) and fix it.
10. Document what was fixed in `build-status.md`.

## What not to do

- No new features
- No refactoring beyond the one fix
- No scope expansion

## Done when

- Lint + typecheck + build all pass
- All Design Verification Checklist items ✓
- Accessibility audit ✓
- Mobile test ✓
- FilterBar functional
- Seed data works for first-run
- One fix applied and documented

## Verification steps

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Design Verification Checklist: all 17 items ✓
- [ ] Accessibility audit: all 6 items ✓
- [ ] Mobile (375px): all 6 items ✓
- [ ] FilterBar: day pills + search filter shelves in real time
- [ ] Fresh incognito: seed class appears, can add/edit/delete, persists
- [ ] One fix documented

## Localhost test before continuing

After this card, the learner should test:

- Full app flow: add → edit → delete → refresh → all persist
- Mobile width: all interactions work, no cutoff
- Keyboard only: tab through all elements, modals trap focus
- Filter by day + search → results update instantly
- Incognito window → seed class visible, can add new, refresh persists

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If lint/typecheck/build fail, or major a11y/visual gaps remain — stop and fix.

## Status

Done