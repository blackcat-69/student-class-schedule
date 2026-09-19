# Work Card 01 — Project Skeleton

## Goal

Scaffold the Vite + React + TypeScript project with folder structure, CSS variables, and base configuration. No visible UI yet — just a running dev server with an empty app shell.

## Inputs

- `build-blueprint.md` — File and Folder Expectations, Stack Decision
- `design.md` — CSS variables (colors, spacing, radii, shadows, typography)

## Files likely touched

```
/package.json
/tsconfig.json
/vite.config.ts
/index.html
/src/main.tsx
/src/App.tsx
/src/index.css
/src/styles/variables.css
/src/styles/reset.css
/src/styles/layout.css
/src/styles/components.css
/src/types/schedule.ts
/src/constants.ts
```

## Instructions for the coding agent

1. Run `npm create vite@latest . -- --template react-ts` in the project root. Accept overwrites.
2. Install dependencies: `npm install`.
3. Create the folder structure per `build-blueprint.md`:
   - `src/components/`
   - `src/hooks/`
   - `src/types/`
   - `src/utils/`
   - `src/styles/`
4. Write `src/types/schedule.ts` with the exact types from the blueprint (Class, Reminder, ScheduleState, filters).
5. Write `src/constants.ts` with:
   - `DAYS = ['Mon','Tue','Wed','Thu','Fri']` (Mon–Fri only for v1)
   - `TYPE_LABELS = { lecture: 'Lecture', lab: 'Lab', tutorial: 'Tutorial', exam: 'Exam' }`
   - `TYPE_ICONS = { lecture: '📘', lab: '📓', tutorial: '📒', exam: '📕' }`
   - `STORAGE_KEY = 'student-schedule'`
6. Write `src/styles/variables.css` with design tokens from `design.md`:
   - Color palette: 10 subject hues (accessible), background, surface, text, border, focus ring
   - Spacing scale: `--space-1` ... `--space-8`
   - Border radius: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px)
   - Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-hover`
   - Typography: `--font-sans`, `--text-xs` ... `--text-2xl`, fluid clamp values
   - Frosted glass: `--glass-bg`, `--glass-blur`
   - Transitions: `--transition-fast` (150ms), `--transition-normal` (250ms)
7. Write `src/styles/reset.css` — minimal normalize (box-sizing, margin/padding reset, font inherit).
8. Write `src/styles/layout.css` — skeleton: `#root`, `.app`, `.shelves`, `.shelf`, `.book`, `.modal`, `.filter-bar`.
9. Write `src/styles/components.css` — placeholder (buttons, inputs, pills, badges, focus rings).
10. Write `src/index.css` importing variables, reset, layout, components in order.
11. Update `src/main.tsx` to import `index.css`.
12. Update `src/App.tsx` to render a minimal shell: `<div class="app">App skeleton</div>`.
13. Run `npm run dev` and verify no errors. Stop dev server.

## What not to do

- Do not implement any visible schedule UI, components, or logic.
- Do not add localStorage hooks yet.
- Do not write sample data.
- Do not style beyond the design token variables and reset.

## Done when

- `npm run dev` starts without errors
- Browser shows "App skeleton" (or similar minimal text)
- All folders and base files exist per blueprint
- TypeScript compiles (`npm run typecheck` or `tsc --noEmit`)
- ESLint passes (`npm run lint`)

## Verification steps

- [ ] `npm install` completes
- [ ] `npm run dev` starts, console clean
- [ ] `npm run build` succeeds (production build)
- [ ] `npm run lint` passes
- [ ] `tsc --noEmit` passes
- [ ] Folder structure matches blueprint
- [ ] `variables.css` contains all design tokens from `design.md`
- Design check: CSS variables cover all colors, spacing, radii, shadows, typography, glass tokens from `design.md`

## Localhost test before continuing

After this card, the learner should test:

- `npm run dev` starts and serves on localhost (e.g., http://localhost:5173)
- Browser loads with no console errors
- Minimal "App skeleton" text visible

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If `npm run dev` fails to start or TypeScript/ESLint errors block progress, stop and ask for help.

## Status

Done