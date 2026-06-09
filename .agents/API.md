# Away — API Reference

Base URL: `{VITE_API_URL}` (default `http://localhost:3001`)

All JSON responses include `ok: true` on success.

---

## `GET /health`

```json
{ "ok": true, "service": "away-api", "version": "1.0.0" }
```

---

## `GET /api/v1/geocode`

**Query:** `q` (string, min 2 chars)

**Response:**

```json
{
  "ok": true,
  "results": [
    { "label": "Paris, France", "lat": 48.8566, "lon": 2.3522 }
  ]
}
```

---

## `GET /api/v1/sky`

**Query:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | number | yes | -90..90 |
| `lon` | number | yes | -180..180 |
| `birthYear` | integer | yes | 1950..current year |

**Response:**

```json
{
  "ok": true,
  "location": { "lat": 48.86, "lon": 2.35 },
  "birthYear": 2005,
  "timeline": [
    { "year": 2012, "radiance": 12.4, "bortle": 7, "limitingMagnitude": 4.2, "estimatedStars": 120 }
  ],
  "metrics": {
    "baselineYear": 2012,
    "currentYear": 2024,
    "baselineBortle": 6,
    "currentBortle": 8,
    "baselineStars": 450,
    "currentStars": 95,
    "starsLost": 355,
    "percentLost": 78.9,
    "brightnessIncreasePercent": 42.1
  },
  "share": {
    "headline": "You've lost ~79% of your visible stars",
    "subline": "Since 2005 in Paris — NASA VIIRS Black Marble",
    "stats": [
      { "label": "Bortle now", "value": "8" },
      { "label": "Stars lost", "value": "355" }
    ]
  }
}
```

---

## `GET /api/v1/away`

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lat` | number | required | |
| `lon` | number | required | |
| `radiusKm` | number | 80 | Max search radius |

**Response:**

```json
{
  "ok": true,
  "origin": { "lat": 48.86, "lon": 2.35, "bortle": 8, "radiance": 15.2 },
  "destination": {
    "bearing": 247,
    "bearingLabel": "WSW",
    "distanceKm": 34,
    "lat": 48.55,
    "lon": 1.82,
    "bortle": 5,
    "radiance": 2.1,
    "bortleImprovement": 3
  },
  "message": "Drive ~34 km WSW for a noticeably darker sky."
}
```

If no improvement within radius:

```json
{ "ok": true, "destination": null, "message": "No darker sky found within 80 km." }
```

---

## Errors

```json
{ "ok": false, "error": "Human-readable message", "code": "VALIDATION_ERROR" }
```

HTTP status: 400 validation, 502 upstream (GIBS/Nominatim), 500 internal.
