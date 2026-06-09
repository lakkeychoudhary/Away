/**
 * Sky brightness metrics derived from VIIRS DNB upward radiance.
 * These are satellite-estimated approximations, not ground SQM readings.
 */

const BORTLE_THRESHOLDS = [
  { max: 0.05, bortle: 1 },
  { max: 0.11, bortle: 2 },
  { max: 0.27, bortle: 3 },
  { max: 0.59, bortle: 4 },
  { max: 1.4, bortle: 5 },
  { max: 3.4, bortle: 6 },
  { max: 8.5, bortle: 7 },
  { max: 22, bortle: 8 },
  { max: Infinity, bortle: 9 },
];

const STARS_BY_BORTLE: Record<number, number> = {
  1: 4500,
  2: 3200,
  3: 2200,
  4: 1500,
  5: 900,
  6: 450,
  7: 220,
  8: 95,
  9: 35,
};

export function radianceToBortle(radiance: number): number {
  const r = Math.max(0, radiance);
  for (const { max, bortle } of BORTLE_THRESHOLDS) {
    if (r <= max) return bortle;
  }
  return 9;
}

export function radianceToLimitingMagnitude(radiance: number): number {
  const r = Math.max(0.001, radiance);
  return Math.round((22 - 2.5 * Math.log10(r + 0.171)) * 10) / 10;
}

export function bortleToEstimatedStars(bortle: number): number {
  return STARS_BY_BORTLE[Math.min(9, Math.max(1, Math.round(bortle)))] ?? 35;
}

export function bearingLabel(degrees: number): string {
  const labels = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return labels[idx] ?? "N";
}

export function destinationPoint(
  lat: number,
  lon: number,
  bearingDeg: number,
  distanceKm: number,
): { lat: number; lon: number } {
  const R = 6371;
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const d = distanceKm / R;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    lat: Math.round((lat2 * 180) / Math.PI * 1e5) / 1e5,
    lon: Math.round(((lon2 * 180) / Math.PI) * 1e5) / 1e5,
  };
}

export function roundCoord(n: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
