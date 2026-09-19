# Design Direction

## Design Inspiration URL

Custom description: Skeuomorphic bookshelf UI for student schedule — 5 horizontal shelves (Mon–Fri), books as classes with width=duration, style=type (textbook vs notebook), spines show course code/name/time. Hover elevates, click opens modal with details + quick-launch links. Frosted glass shelves, modern accessible palette, dynamic color-coding per subject.

## What We Borrow

- Bookshelf metaphor: 5 shelves = Mon–Fri, intuitive spatial mapping
- Book width = class duration (visual time-blocking)
- Book style = class type (textbook for lecture, spiral for lab, etc.)
- Spine labels: course code, subject name, time block
- Hover elevation + click-to-open modal for details
- Frosted glass / frosted shelf aesthetic — clean, premium feel
- Dynamic color-coding per subject for at-a-glance differentiation
- Quick-launch links in modal (portal, video call, syllabus)

## What We Do Not Copy

- Overly realistic wood grain / heavy textures (use subtle frosted glass)
- Cluttered spines — keep text horizontal, readable, minimal
- Hard-to-read angled or curved spine text — all text upright
- Animation overload — subtle hover lift (2–4px), fade-in modal (150ms), no parallax
- Fake logos, fake testimonials, fake stats, lorem ipsum in final proof
- Non-accessible color contrasts — WCAG AA minimum

## Visual Mood

Student-friendly, calm, premium. Light, airy, organized. Frosted glass shelves on a soft neutral background. Books have matte finishes with subtle depth. Color palette: muted subject colors (not neon), high contrast for text. Generous whitespace. Rounded corners (8–12px). Subtle drop shadows for elevation.

## Layout Rules

- Viewport: full-width, max-width ~1200px, centered
- Shelves: 5 horizontal bands (Mon–Fri), equal height, spaced evenly
- Each shelf: flex container, books laid out left-to-right by start time
- Book width: proportional to duration (e.g., 30min = 1 unit, 90min = 3 units)
- Gaps between books = gaps between classes
- Header: student name + week label, top center
- Filter bar: day pills (Mon–Fri/All) + search input, sticky top
- Modal: centered, max-width 480px, frosted backdrop, focus trap

## Color / Contrast Rules

- Background: `#f6f7fb` (light neutral) or `#1e1f26` (dark mode)
- Shelf surface: `rgba(255,255,255,0.7)` / `rgba(30,31,38,0.7)` with `backdrop-filter: blur(12px)`
- Book spines: subject-assigned colors from accessible palette (10 hues, WCAG AA on white/dark)
- Spine text: `#1a1a2e` on light books, `#f5f5f5` on dark books — auto-contrast
- Hover elevation: `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`, `transform: translateY(-3px)`
- Modal backdrop: `rgba(0,0,0,0.35)` + blur
- Focus ring: `0 0 0 3px rgba(59,130,246,0.5)`
- No pure black `#000` or pure white `#fff` for text — use near-black / near-white

## Typography Feel

- Font: system UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- Scale: clamp-based fluid type
  - Header: `clamp(1.5rem, 3vw, 2rem)` — student name
  - Shelf label (Mon/Tue): `0.75rem` uppercase, letter-spacing `0.08em`, color `#6b7280`
  - Book spine: `0.7rem` course code, `0.8rem` subject name, `0.65rem` time — all uppercase/lowercase mix for hierarchy
  - Modal title: `1.125rem` semibold
  - Modal body: `0.9rem` regular, line-height `1.6`
  - Links: `0.875rem` medium, underlined on hover
- No decorative fonts. Monospace only for time codes if needed.

## Component Style

**Book (ClassBlock)**
- Rounded top corners (8px), flat bottom (sits on shelf)
- Spine: vertical padding 12px, horizontal 10px, text centered horizontally
- Three lines max on spine: course code (small), subject (medium), time (small)
- Type indicator: tiny icon or pattern — 📘 lecture, 📓 lab, 📒 tutorial, 📕 exam
- Hover: lift + shadow + slight scale (1.02x)
- Focus: ring + lift
- Click: opens modal

**Shelf (DayColumn)**
- Label left of shelf: Mon/Tue/Wed/Thu/Fri, vertical text or horizontal above
- Min-height: 120px, grows with books
- Frozen glass background, subtle border `rgba(0,0,0,0.06)`

**Modal (ClassFormModal / DetailModal)**
- Frosted glass panel, rounded 16px
- Header: subject name + course code + close button
- Body: instructor, location, time range, type badge, description
- Quick-launch links: icon + label, each a styled button (primary for portal, secondary for video, ghost for PDF)
- Footer: edit / delete actions (edit = pencil, delete = trash, both icon+text)

**FilterBar**
- Day pills: `All` + Mon–Fri, single select, active = filled, inactive = outline
- Search input: placeholder "Search classes...", debounced 200ms
- Sticky top, z-index above shelves

**EmptyState**
- Centered on shelf or full grid: illustration (open book icon) + "No classes on [Day]" or "No classes match"
- Add button inline

## Mobile Rules

- < 640px: shelves stack vertically, each shelf full-width
- Book spines: horizontal text, tap to open modal (no hover)
- FilterBar: scrollable horizontal day pills, search below
- Modal: full-screen bottom sheet on mobile, drag-to-dismiss
- Touch targets: minimum 44x44px
- Font sizes clamp down but stay readable (≥14px body)
- Swipe between days? (v1: no, just scroll)

## Accessibility Basics

- Semantic HTML: `<section aria-labelledby="mon-heading">`, `<article class="book">`
- Each book: `role="button" tabindex="0" aria-label="Calculus I, Mon 09:00–10:30, Lecture"`
- Modal: `role="dialog" aria-modal="true" aria-labelledby="modal-title"`, focus trap, `Esc` closes
- Color contrast: all text ≥ 4.5:1, UI elements ≥ 3:1
- Reduced motion: respect `prefers-reduced-motion` — disable hover lift, modal fade
- Keyboard: Tab through books, Enter/Space opens modal, arrows between books (optional v1)
- Screen reader: announce filter changes, modal open/close

## Anti-Slop Rules

- No fake logos, no fake testimonials, no fake stats
- No lorem ipsum in final proof — use real sample classes
- One clear primary action per screen: "+" to add class, "Save" in modal
- Readable on phone width (375px) — no horizontal overflow
- No placeholder images — use SVG icons or CSS shapes only
- No external font loads — system stack only
- No analytics, no tracking, no third-party scripts
- No "coming soon" or disabled fake features

## Design Verification Checklist

- [ ] 5 shelves render Mon–Fri, labeled correctly
- [ ] Book width matches duration proportionally
- [ ] Book style (icon/pattern) reflects type (lecture/lab/tutorial)
- [ ] Spine shows course code, subject, time — all horizontal, readable
- [ ] Hover: subtle lift + shadow (desktop)
- [ ] Click/tap: opens modal with details + quick-launch links
- [ ] Color-coding: each subject has distinct accessible color
- [ ] Frosted glass shelves with blur backdrop
- [ ] Filter by day pills works
- [ ] Search filters by subject name / course code
- [ ] Empty state shows on empty day or no results
- [ ] Modal: focus trap, Esc closes, click backdrop closes
- [ ] Mobile: stacks vertically, bottom-sheet modal, 44px touch targets
- [ ] Dark mode works (optional v1, but CSS variables ready)
- [ ] WCAG AA contrast on all text
- [ ] `prefers-reduced-motion` respected
- [ ] No lorem ipsum, no fake content in proof build