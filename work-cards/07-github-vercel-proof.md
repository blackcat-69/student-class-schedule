# Work Card 07 — GitHub + Vercel Proof

## Goal

Deploy to GitHub and Vercel. Record proof of working app with persistence. Update `build-status.md` with deployment URLs.

## Inputs

- `build-blueprint.md` — Proof Ladder, 60-Second Explanation Template
- `build-status.md` — current state
- All previous work cards completed

## Files likely touched

```
/.github/workflows/ci.yml (optional CI)
/vercel.json (if needed)
README.md (optional, for proof)
```

## Instructions for the coding agent

1. Initialize Git (if not already):
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit - student class schedule v1"
   ```
2. Create GitHub repository (via web or CLI):
   - Name: `student-class-schedule` (or similar)
   - Public or private
   - Push: `git remote add origin <url>`, `git push -u origin main`
3. Configure Vercel:
   - Import GitHub repo in Vercel dashboard
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Deploy
4. Verify live deployment:
   - Open Vercel URL
   - Test full flow: add → edit → delete → refresh
   - Test mobile (Chrome DevTools device toolbar)
   - Verify localStorage works on Vercel domain
5. Record proof:
   - Screenshot or GIF of: add class → refresh → class persists
   - Note Vercel URL in `build-status.md`
   - Note GitHub repo URL in `build-status.md`
6. Optional: Add CI workflow (`.github/workflows/ci.yml`) running lint, typecheck, build on push
7. Update `build-status.md`:
   - Deployment target: GitHub + Vercel ✓
   - Add Vercel URL and GitHub URL
   - Current phase: Shipped
   - Next instruction: (none — planning complete)

## What not to do

- No code changes beyond CI config
- No new features
- No environment variables needed (no secrets)

## Done when

- GitHub repo exists with full history
- Vercel deployment live and accessible
- Live app passes all functional tests (add/edit/delete/refresh)
- Mobile works on live URL
- URLs recorded in `build-status.md`

## Verification steps

- [ ] `git status` clean
- [ ] GitHub repo created, code pushed
- [ ] Vercel deployment succeeds (green check)
- [ ] Live URL loads app
- [ ] Add class on live URL → refresh → class persists
- [ ] Edit class on live URL → refresh → changes persist
- [ ] Delete class on live URL → refresh → class gone
- [ ] Mobile view on live URL — stacks, bottom-sheets work
- [ ] Vercel URL recorded in `build-status.md`
- [ ] GitHub URL recorded in `build-status.md`

## Localhost test before continuing

After this card, the learner should test:

- Open Vercel URL — app loads
- Add a class → F5 → class remains
- Open on phone (or device toolbar) — mobile layout works
- Share Vercel URL with trainer for review

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If Vercel deploy fails, or live app doesn't persist data, or GitHub push blocked — stop and fix.

## Status

Not started