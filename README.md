# Away ✦ — find where the stars still are

> **Built for [Hack Club × NASA Stardance](https://stardance.hackclub.com/).**  
> NASA VIIRS satellite data + your birth year = how many stars light pollution has stolen from you — and which direction to drive to get them back.

[![Stack](https://img.shields.io/badge/NASA-VIIRS%20Black%20Marble-0066cc)](https://blackmarble.gsfc.nasa.gov/)
[![Stack](https://img.shields.io/badge/Hack%20Club-Stardance-ff6b9d)](https://stardance.hackclub.com/)
[![Stack](https://img.shields.io/badge/Powered%20By-TypeScript-3178c6)](https://www.typescriptlang.org/)
[![Stack](https://img.shields.io/badge/API-Fastify-000000)](https://fastify.dev/)
[![Stack](https://img.shields.io/badge/Frontend-React%2FMapLibre-61DAFB)](https://react.dev/)

---

## ✨ The Pitch

Type any city, pick the year you were born, and **Away** shows you exactly how much of your childhood night sky you've lost to light pollution — with real NASA Black Marble satellite data spanning 2012–2024. It'll even point you which way to drive for a darker sky within 80 km. This isn't a generic light pollution map; it's a **personal, data-driven eulogy for your stars**.

Why "Away"? Because the solution is always a few kilometers of highway and a compass bearing away. Go find your dark sky.

---

## 🚀 Quickstart

### Prerequisites
- Node.js ≥ 20
- npm 9+

### One-liner (full stack)

```bash
git clone https://github.com/lakkeychoudhary/Away.git
cd Away
npm install

# Terminal 1 — API on localhost:3001
npm run dev:api

# Terminal 2 — Web on localhost:5173 (proxies /api → backend)
npm run dev:web
```

Open **http://localhost:5173**. Search a city, pick a birth year, and see your sky story.

### Try commands
- Search `Mumbai` or `New York` — any city works
- Birth year: try **1986** to see maximum light pollution increase
- Click **"Go darker"** — it'll suggest a direction to drive

---

## 🧠 Architecture

| Layer | Stack | Host |
|-------|-------|------|
| `apps/web` — Frontend | Vite, React, MapLibre GL JS, Recharts | GitHub Pages (via deploy workflow) |
| `apps/api` — Backend | Fastify, TypeScript, node-fetch | Hack Club Nest (container) |
| `packages/shared` — Types | TypeScript interfaces | Shared between packages |
| Data source | NASA GIBS / VIIRS Black Marble WMS | NASA Earthdata API |

### API endpoints

| Endpoint | What it does |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/v1/geocode?q=Mumbai` | Geocode a city name → lat/lon (OpenStreetMap Nominatim) |
| `GET /api/v1/sky?lat=19.07&lon=72.87&birthYear=1990` | Sky report: Bortle class, stars lost, brightness trend across years |
| `GET /api/v1/away?lat=19.07&lon=72.87&radiusKm=80` | "Drive this way" — finds darker sky within radius |

---

## 📡 How it works (the nerdy bits)

1. **You search a city** — frontend hits Nominatim OSM geocoding API
2. **API fetches NASA VIIRS data** — for every year from your birth year to now, it requests a PNG tile from [NASA GIBS WMS](https://earthdata.nasa.gov/) and samples the center pixel's radiance
3. **Radiance → Bortle scale** — satellite radiance (nW/cm²/sr) converts to Bortle class (1–9) using empirically derived thresholds from the Black Marble literature
4. **Away-spot search** — samples 8 compass bearings at 10/25/45/70 km, finds the darkest sky within range
5. **You get a share card** — with your personal "stars lost" stat, ready to copy for Stardance devlogs

### Hard parts we hit

- **NASA GIBS WMS has spotty coverage for 2013–2015** — the Black Marble product only has reliable composites for 2012 and 2016+. We interpolate between them.
- **Bortle thresholds are debated** — the canonical Bortle scale was defined for visual observers, not satellite pixels. We had to calibrate radiance values against known Bortle class locations.
- **Nominatim rate-limits** — on local dev, too many rapid geocodes get 429'd. We should probably add client-side debouncing (TODO).
- **MapLibre tile loading** — the NASA tiles have a different projection than standard OSM tiles, had to fiddle with the layer extent config.

---

## 🤖 AI toolbox

This project was built with heavy AI assistance. Here's what we used and why:

- **[Cline](https://github.com/cline/cline)** (VS Code extension) — our AI coding agent. Used for: generating boilerplate, debugging GIBS WMS response parsing, refactoring the backend into controllers/usecases pattern, fixing TypeScript type mismatches between packages.
- **ChatGPT 4o** — for rubber-ducking the Bortle radiance calibration math, helping structure the monorepo, and writing this README.
- **GitHub Copilot** — inline completions in VS Code for React component props, type definitions, and CSS modules.

**Why we're transparent about this:** Hack Club's Stardance rewards honesty in the Storytelling category. This wasn't a copy-paste — every piece of code was iterated on with AI, debugged, tested, and deployed by a human (me, [@lakkeychoudhary](https://github.com/lakkeychoudhary)). AI helped with the scaffolding; the problems, the fixes, and the decisions were mine.

---

## 🚢 Deployment

### Frontend → GitHub Pages
The workflow at `.github/workflows/deploy-web.yml` auto-deploys on push to `main`.  
Set repository variable `VITE_API_URL` to your Nest API's URL.  
**Important:** `vite.config.ts` uses `base: '/Away/'` — change this if your fork has a different repo name.

### Backend → Hack Club Nest
```bash
npm run build:api
cd apps/api && node dist/index.js
```

Required env vars:
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | API listen port |
| `HOST` | `0.0.0.0` | Bind address |
| `GIBS_BASE` | `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi` | NASA GIBS endpoint |
| `GIBS_TIMEOUT_MS` | 10000 | GIBS request timeout |
| `CACHE_TTL_MS` | 3600000 | In-memory radiance cache TTL |
| `CORS_ORIGINS` | `http://localhost:5173` (comma-separated for multiple) | Allowed CORS origins |

---

## 🌙 NASA attribution

Night lights data courtesy of [NASA Earth Observatory / VIIRS Black Marble](https://blackmarble.gsfc.nasa.gov/) served via [NASA GIBS](https://earthdata.nasa.gov/). Bortle estimates derived from satellite radiance — not ground SQM readings. They're approximate, but the trend is real.

---

## 📜 License

MIT — go build something. If you point people to darker skies, even better.

---

## 🗺️ Devlog / Story

*Ran into an issue where the Nest hosting environment dropped our webhooks. Used Cline to rewrite the connection loop using a fallback retry mechanism.*  
*Spent an embarrassing amount of time debugging why the GIBS WMS kept returning 400 errors — turns out the TIME parameter format was wrong for certain year ranges.*  
*The Bortle radiance calibration was a rabbit hole. Ended up calibrating against known dark-sky locations (Mauna Kea, Atacama) and bright-city locations (Mumbai, NYC).*