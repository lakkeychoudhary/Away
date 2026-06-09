# Away — Architecture

## System diagram

```
┌─────────────────┐     HTTPS      ┌──────────────────┐
│  GitHub Pages   │ ──────────────►│  Away API        │
│  apps/web       │   JSON REST    │  apps/api        │
│  (static SPA)   │                │  (your server)   │
└─────────────────┘                └────────┬─────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            NASA GIBS WMS           Nominatim OSM            In-memory cache
            (VIIRS Black Marble)    (geocoding)              (LRU, 1h TTL)
```

## Apps

### `apps/api` — Fastify + TypeScript

| Route | Purpose |
|-------|---------|
| `GET /health` | Liveness |
| `GET /api/v1/geocode?q=` | City search → `{ lat, lon, label }[]` |
| `GET /api/v1/sky?lat=&lon=&birthYear=` | Timeline + metrics + share payload |
| `GET /api/v1/away?lat=&lon=&radiusKm=` | Nearest darker direction + distance |

**Layers:**

```
routes/     HTTP handlers, validation
services/   Business logic (orchestration)
nasa/       GIBS client, radiance sampling
sky/        Bortle, stars, loss calculations
geocode/    Nominatim client
cache/      LRU wrapper
```

### `apps/web` — Vite + React + TypeScript

| Section | Purpose |
|---------|---------|
| Hero | Hack Club-style landing, CTA to explorer |
| Explorer | Location search, birth year, results |
| Timeline chart | Recharts area chart of radiance/Bortle |
| Map panel | MapLibre + year scrubber |
| Share card | OG-friendly stats for devlogs |

**State:** React hooks + fetch to `VITE_API_URL`.

### `packages/shared`

Zod-free plain TS interfaces consumed by both apps (duplicated types kept in sync via shared package).

## Sky metrics pipeline

```
lat/lon + year
    → resolve GIBS layer + TIME (Black Marble 2012/2016, SNPP DNB 2017+)
    → WMS GetMap 9×9 PNG → center pixel luminance
    → scaled radiance (nW/cm²/sr approximate)
    → Bortle class (1–9)
    → limiting magnitude
    → estimated naked-eye stars
    → loss vs baseline year (birth year or earliest data)
    → 2013–2015 interpolated between 2012 and 2016 Black Marble
```

### Bortle from radiance

Uses a piecewise mapping calibrated for VIIRS DNB upward radiance (documented in `services/sky/metrics.ts`). Values are **estimates**, not ground SQM measurements — always disclose in UI.

### Dark sky search (`/away`)

1. Sample radiance at origin.
2. Walk 16 compass bearings × distance rings (5, 10, 20, … km).
3. Return bearing with lowest radiance where Bortle improves by ≥1 class.
4. Cache key includes rounded lat/lon.

## Environment variables

### API (`apps/api/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Listen port |
| `HOST` | `0.0.0.0` | Bind address |
| `CORS_ORIGIN` | `*` | Allowed frontend origin(s) |
| `GIBS_BASE` | NASA GIBS URL | Override for tests |
| `CACHE_TTL_MS` | `3600000` | Cache TTL |
| `NOMINATIM_USER_AGENT` | `Away/1.0` | Required by OSM policy |

### Web (`apps/web/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | API base URL |

## Error handling

- GIBS timeout → use last cached value or `fallback` synthetic curve (dev only flag).
- Geocode rate limit → 429 with retry-after hint.
- Invalid coords → 400 with Zod-style message from Fastify schema.

## Future extensions (document here when built)

- [ ] Redis cache
- [ ] Precomputed radiance tiles in S3
- [ ] SEDAC population overlay
- [ ] Static OG image generation on server
- [ ] PWA offline share cards
