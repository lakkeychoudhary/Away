# Away — Frontend Guide

## Stack

- Vite 6 + React 19 + TypeScript
- MapLibre GL JS (NASA GIBS raster overlay optional; primary map is dark basemap)
- Recharts for timeline
- CSS modules + global tokens (no Tailwind — keeps DESIGN.md control explicit)

## Pages / sections

Single-page app with scroll sections:

1. **Nav** — fixed, glass blur, links: Explore / About / GitHub
2. **Hero** — "Away" wordmark, starfield, CTA scroll to explorer
3. **Explorer** — search + birth year + Analyze button
4. **Results** (conditional) — metrics tiles, chart, map scrubber, away card, share
5. **About** — NASA data explanation
6. **Footer** — attributions

## Hack Club × Apple fusion

| From Hack Club | From Apple (DESIGN.md) |
|----------------|------------------------|
| Dark hero with personality | 17px body, generous whitespace |
| Playful microcopy | Pill buttons, single blue CTA |
| Star/sparkle motif | Alternating light/dark sections |
| Pink accent for brand moments | No gratuitous gradients on chrome |

## Key components

| File | Role |
|------|------|
| `Hero.tsx` | Landing |
| `Explorer.tsx` | Form + loading states |
| `MetricsGrid.tsx` | Bortle, stars lost, % lost |
| `SkyTimeline.tsx` | Recharts area chart |
| `SkyMap.tsx` | MapLibre map + year slider |
| `AwayCard.tsx` | Dark-sky direction result |
| `ShareCard.tsx` | Copy/share stats |

## API client

`apps/web/src/lib/api.ts` — thin fetch wrapper, throws on `ok: false`.

## GitHub Pages notes

- `vite.config.ts` → `base: '/Away/'`
- Asset paths must be relative to base
- Router: hash-free SPA; use anchor sections only

## OG / social

`index.html` includes default meta tags. Dynamic OG would need server-side rendering (future).
