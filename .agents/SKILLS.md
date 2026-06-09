# Away — Agent Skills

Instructions for AI agents continuing this project.

## Skill: Run the stack locally

```bash
# From repo root
npm install
npm run dev          # API :3001 + Web :5173
```

Or separately:

```bash
npm run dev -w apps/api
npm run dev -w apps/web
```

## Skill: UI changes

1. Read `DESIGN.md` at repo root before any UI work.
2. Hack Club flavor: bold hero copy, dark `#0a0a12` star sections, subtle starfield CSS, pink accent `#ff6b9d` for highlights (Stardance energy) while keeping Apple blue `#0066cc` for primary actions.
3. Typography: `Inter` from Google Fonts as SF Pro substitute.
4. Components live in `apps/web/src/components/`.
5. CSS tokens in `apps/web/src/styles/tokens.css`.

## Skill: Add API endpoint

1. Define types in `packages/shared/src/index.ts`.
2. Add service logic in `apps/api/src/services/`.
3. Register route in `apps/api/src/routes/`.
4. Document in `.agents/API.md`.
5. Wire frontend fetch in `apps/web/src/lib/api.ts`.

## Skill: Change NASA data layer

1. Read `.agents/DATA_SOURCES.md`.
2. Modify `apps/api/src/nasa/gibs.ts`.
3. Update year range constant `AVAILABLE_YEARS`.
4. Test with `curl "localhost:3001/api/v1/sky?lat=40.7&lon=-74&birthYear=2000"`.

## Skill: Deploy frontend (GitHub Pages)

1. Set repo name — `base` in `apps/web/vite.config.ts` must match (`/Away/`).
2. GitHub Actions workflow: `.github/workflows/deploy-web.yml`
3. Set repository secret or variable `VITE_API_URL` to production API.
4. Enable Pages from GitHub Actions artifact.

## Skill: Deploy API (your server)

```bash
cd apps/api
npm run build
node dist/index.js
```

Use PM2/systemd. Set env:

```
PORT=3001
CORS_ORIGIN=https://youruser.github.io
NOMINATIM_USER_AGENT=Away/1.0 (contact@yourdomain.com)
```

Put nginx/Caddy reverse proxy with TLS in front.

## Skill: Write Stardance devlogs

- Lead with a 10s screen recording of map slider.
- Mention NASA VIIRS Black Marble by name.
- Show one real city stat (e.g. "My sky in Mumbai lost X%").
- Link GitHub repo + live demo.

## Skill: README updates

Human README is `README.md` only — do not duplicate into `.agents/` unless architecture changes.

## Skill: Commits

Small atomic commits. Examples:

- `feat(api): add radial dark-sky search`
- `fix(web): map year scrubber sync`
- `docs(agents): document Redis migration`
