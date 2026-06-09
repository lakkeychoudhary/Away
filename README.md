# Away ✦

**Find where the stars still are.**

Away is a Stardance (Hack Club × NASA) web app that shows how much of your night sky VIIRS satellite data suggests you've lost since your birth year — and which direction to drive for darker skies.

![Stack](https://img.shields.io/badge/NASA-VIIRS%20Black%20Marble-0066cc)
![Stack](https://img.shields.io/badge/Hack%20Club-Stardance-ff6b9d)

## Try it

1. **Frontend** (GitHub Pages): set `VITE_API_URL` to your deployed API, then build.
2. **API** (your server): run `apps/api` with Node 20+.

### Local dev

```bash
npm install

# Terminal 1 — API on :3001
npm run dev:api

# Terminal 2 — Web on :5173 (proxies /api → API)
npm run dev:web
```

Open http://localhost:5173

## What it does

- Search any city (OpenStreetMap geocoding)
- Pick your birth year
- See **Bortle class**, **estimated stars lost**, and **brightness trend** from NASA VIIRS Black Marble (2012–2024)
- Scrub years on an interactive chart + map overlay
- Get a **"drive this way"** suggestion for darker sky within 80 km
- Copy stats for Stardance devlogs

## Architecture

| Part | Tech | Host |
|------|------|------|
| `apps/web` | Vite, React, MapLibre, Recharts | GitHub Pages |
| `apps/api` | Fastify, TypeScript | Your server |
| `packages/shared` | Shared types | — |
| `.agents/` | Agent context & skills | — |

See [`.agents/CONTEXT.md`](.agents/CONTEXT.md) for full docs.

## Deploy

### API (your server)

```bash
npm run build:api
cd apps/api && node dist/index.js
```

Env vars — see `apps/api/.env.example`.

### Web (GitHub Pages)

Set repository variable `VITE_API_URL=https://your-api-domain.com`, then push to `main`. Workflow: `.github/workflows/deploy-web.yml`.

`vite.config.ts` uses `base: '/Away/'` — change if your repo name differs.

## NASA attribution

Night lights data: [NASA Earth Observatory / VIIRS Black Marble](https://blackmarble.gsfc.nasa.gov/) via [NASA GIBS](https://earthdata.nasa.gov/).

Bortle estimates are derived from satellite radiance — not ground SQM readings.

## License

MIT
