# Away — Agent Context

## What this project is

**Away** is a Stardance (Hack Club × NASA) web app that answers one question:

> *How much of your night sky have you lost — and where can you still get away from the glow?*

Users enter a location and birth year. The app uses **NASA VIIRS Black Marble** night-light radiance to chart sky brightness over time, estimate stars lost, and suggest the nearest darker-sky direction within driving range.

## Product name & positioning

- **App name:** Away
- **Tagline:** Find where the stars still are.
- **Audience:** Teens shipping for Stardance; general public curious about light pollution.
- **Demo hook:** Before/after map slider + shareable stat card.

## Repository layout

```
Away/
├── .agents/           ← YOU ARE HERE — read before coding
├── apps/
│   ├── api/           ← Fastify backend (host on your server)
│   └── web/           ← Vite + React (GitHub Pages)
├── packages/
│   └── shared/        ← Shared TypeScript types
├── DESIGN.md          ← Apple-inspired UI tokens (getdesign)
└── README.md          ← Human-facing project docs
```

## Current implementation status

| Area | Status |
|------|--------|
| Agent docs | Complete |
| API — sky timeline | Implemented (GIBS + cache + fallback) |
| API — dark sky search | Implemented (radial sampling) |
| API — geocode | Implemented (Nominatim) |
| Web — landing + explorer | Implemented |
| Web — share card | Implemented |
| GitHub Pages deploy | Configured (`base: /Away/`) |
| Production API URL | Set via `VITE_API_URL` env |

## Non-goals (for now)

- User accounts / auth
- Mobile native apps
- Real-time satellite passes
- Replacing professional dark-sky site maps (IDA, LightPollutionMap.info)

## Key decisions already made

1. **Split deploy:** static frontend on GitHub Pages, API on own server (CORS enabled).
2. **NASA data path:** GIBS WMS `GetMap` pixel sampling on VIIRS Black Marble + SNPP DNB layers — no Earthdata login for MVP.
3. **Caching:** In-memory LRU on API (swap for Redis in production if needed).
4. **Design:** Apple typography/spacing from `DESIGN.md` + Hack Club energy (dark star sections, punchy copy).

## Before you change anything

1. Read `ARCHITECTURE.md` and `DATA_SOURCES.md`.
2. Match existing patterns in `apps/api/src` and `apps/web/src`.
3. Update this file if you add major features or change deploy topology.
