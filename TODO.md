# Away — Devlog & scratchpad

> Not a traditional TODO. This is where I brain-dump problems, half-baked ideas, and bugs I'm chasing.

---

## 2026-06-09 — Prepping for Stardance submission

- [x] Backend refactor into controllers/usecases pattern — was getting too fat in `routes/index.ts`
- [x] Extracted `buildSkyReport` and `findAwaySpot` as dedicated usecases so we can unit test them independently
- [x] NASA GIBS interpolation for 2013–2015: the Black Marble product doesn't have clean composites for those years. Currently lerping between 2012 and 2016 radiance values. This is... not great astronomy but it's what the data lets us do.
- [ ] **BUG**: Nominatim returns 403 on first request sometimes — User-Agent header should fix it but saw it happen once on Nest. Need to add retry logic.
- [ ] **WISHLIST**: Add client-side debouncing on the city search input. Nominatim rate-limits aggressively (1 req/sec).
- [ ] **TODO**: The fallback radiance estimator (`estimateRadianceFallback` in gibs.ts) is a sin against science. It uses `sin(lat) + cos(lon)` to fake urban gradients. Replace with actual population density raster when we have time.
- [x] Added GitHub Pages deploy workflow — frontend auto-deploys on push to main

---

## 2026-06-07 — GIBS WMS gave me a headache

Spent 4 hours debugging why the WMS `GetMap` requests kept returning 400 errors. The issue: the `TIME` parameter format is layer-dependent. The Black Marble layer uses `2012-01-01` format, but the Day/Night Band layer uses `YYYY-07-01` format. Was mixing them up.

Also found out that the PNG response from GIBS uses a different gamma encoding depending on the layer. The Black Marble tiles have gamma ~1.6, the DNB tiles use ~1.35. The `luminanceToRadiance` function handles this now but I'm not confident the absolute radiance values are correct — the *relative trends* should be fine though.

---

## 2026-06-05 — Bortle calibration rabbit hole

The canonical Bortle scale (John E. Bortle, 2001) defines classes based on naked-eye limiting magnitude and sky glow appearance. Converting satellite-measured radiance to Bortle is problematic because:

1. Satellite measures upward radiance (what escapes to space), not what an observer sees
2. The VIIRS Day/Night Band has a specific spectral response — it's not sampling all visible wavelengths equally
3. Bortle's original definitions are qualitative ("Milky Way appears highly structured" etc.)

What I did: cross-referenced known dark-sky sites (Mauna Kea Observatory ~ 2800m, Atacama Desert) and known bright-sky sites (NYC, Mumbai, Tokyo) with their VIIRS radiance values. Set thresholds empirically. The Bortle class boundaries are:

| Radiance (nW/cm²/sr) | Bortle class | What it looks like |
|-----------------------|-------------|-------------------|
| < 0.5 | 1 | Excellent dark sky — zodiacal light visible |
| 0.5–1.5 | 2 | Typical dark sky — Milky Way casts shadow |
| 1.5–4 | 3 | Rural sky — some light pollution on horizon |
| 4–10 | 4 | Rural/suburban transition — Milky Way washed out |
| 10–24 | 5 | Suburban sky — Milky Way faint or invisible |
| 24–50 | 6 | Bright suburban — sky is gray, not black |
| 50–100 | 7 | Urban sky — bright gray sky |
| 100–200 | 8 | City sky — sky glows orange |
| > 200 | 9 | Inner city — sky is brightly lit |

These are **approximate**. I should probably add a disclaimer in the UI.

---

## 2026-06-03 — Monorepo structure

Decided on a monorepo with npm workspaces. Three packages:

- `packages/shared` — TypeScript interfaces shared between frontend and backend (`SkyResponse`, `AwayResponse`, `GeocodeResult`)
- `apps/api` — Fastify server that proxies GIBS WMS requests, geocodes via Nominatim, computes sky reports
- `apps/web` — Vite + React SPA with MapLibre for the map overlay and Recharts for the timeline chart

This is overengineered for a simple Stardance project but honestly it makes the types stay in sync without duplicating interfaces. Just don't look at the build config.

---

## Known Issues (the honest ones)

1. **NASA GIBS has CORS issues in browser** — that's why we proxy through our API instead of calling GIBS directly from the frontend
2. **No dark mode** — ironic for a sky app, I know
3. **City search only works on small cities** — Nominatim returns too many results for "Delhi" or "Springfield", the dropdown gets messy
4. **The "drive this way" suggestion doesn't account for terrain** — it assumes Euclidean geometry on a sphere surface. Good luck driving straight through a mountain
5. **Stars lost calculation uses estimated visible stars per Bortle class** — these are statistical averages, not actual star counts. Your mileage may vary
6. **Cache eviction is naive** — memory cache clears *everything* after TTL. Could be smarter.