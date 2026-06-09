# Away — NASA & External Data Sources

## Primary: NASA GIBS — VIIRS Black Marble

**What:** Annual composite of nighttime lights from VIIRS Day/Night Band (DNB).

**Why:** Public, no Earthdata login, global coverage, temporal stack for "sky lost since birth year."

**Endpoint:**

```
https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi
```

**Query type:** WMS 1.1.1 `GetMap` (PNG pixel sampling — GetFeatureInfo is disabled on GIBS)

**Layers used:**

| Years | Layer | TIME |
|-------|-------|------|
| 2012 | `VIIRS_Black_Marble` | 2012-01-01 |
| 2013–2015 | Interpolated from 2012 + 2016 Black Marble | — |
| 2016 | `VIIRS_Black_Marble` | 2016-01-01 |
| 2017+ | `VIIRS_SNPP_DayNightBand_At_Sensor_Radiance` | YYYY-07-01 (nearest granule) |

**Implementation:** `apps/api/src/nasa/gibs.ts`

### Attribution (required in UI)

> Night lights data: NASA Earth Observatory / VIIRS Black Marble via NASA GIBS.

Links:
- https://earthdata.nasa.gov/
- https://blackmarble.gsfc.nasa.gov/

## Secondary: OpenStreetMap Nominatim (geocoding)

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Policy:** Max 1 req/s, include `User-Agent: Away/1.0 (stardance project)`.

**Implementation:** `apps/api/src/geocode/nominatim.ts`

**Attribution:** © OpenStreetMap contributors

## Reference formulas (not direct datasets)

| Metric | Source literature |
|--------|-------------------|
| Bortle ↔ radiance | Falchi et al. 2016; common DNB radiance thresholds |
| Stars vs limiting magnitude | Astronomical handbook approximations |
| "Sky lost %" | Derived: `(stars_baseline - stars_now) / stars_baseline` |

Always label as **satellite-estimated**, not on-site SQM.

## Datasets considered but not used (yet)

| Dataset | Reason deferred |
|---------|-----------------|
| VNP46A2 daily granules | Requires Earthdata auth + heavy processing |
| SEDAC population density | Nice overlay; not MVP |
| World Atlas NPMS | Static 2015; less narrative for birth year |
| APOD | Not relevant to light pollution story |

## Adding a new NASA source

1. Document endpoint + layer here.
2. Add client under `apps/api/src/nasa/`.
3. Extend `/api/v1/sky` response in `packages/shared`.
4. Update footer attribution in `apps/web`.
5. Note rate limits and cache strategy in `ARCHITECTURE.md`.
