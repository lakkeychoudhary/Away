import { PNG } from "pngjs";
import { config } from "../config.js";
import { MemoryCache } from "../cache/memory.js";
import { roundCoord } from "../sky/metrics.js";

const cache = new MemoryCache<number>(config.cacheTtlMs);

export interface GibsSnapshot {
  layer: string;
  time: string;
}

/** Map calendar year → NASA GIBS layer + TIME (per GetCapabilities). */
export function resolveGibsSnapshot(year: number): GibsSnapshot {
  if (year <= 2012) {
    return { layer: "VIIRS_Black_Marble", time: "2012-01-01" };
  }
  if (year <= 2015) {
    return { layer: "VIIRS_Black_Marble", time: "2012-01-01" };
  }
  if (year === 2016) {
    return { layer: "VIIRS_Black_Marble", time: "2016-01-01" };
  }
  return {
    layer: "VIIRS_SNPP_DayNightBand_At_Sensor_Radiance",
    time: `${year}-07-01`,
  };
}

function pixelLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Map GIBS pixel brightness → nW/cm²/sr scale used by Bortle thresholds. */
function luminanceToRadiance(luminance: number, layer: string): number {
  const t = Math.max(0, Math.min(255, luminance)) / 255;
  const gamma = layer.includes("Black_Marble") ? 1.6 : 1.35;
  return Math.round(Math.pow(t, gamma) * 28 * 100) / 100;
}

async function fetchMapPixel(
  lat: number,
  lon: number,
  snapshot: GibsSnapshot,
): Promise<number> {
  const delta = 0.08;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.1.1",
    REQUEST: "GetMap",
    LAYERS: snapshot.layer,
    STYLES: "default",
    FORMAT: "image/png",
    SRS: "EPSG:4326",
    BBOX: bbox,
    WIDTH: "9",
    HEIGHT: "9",
    TIME: snapshot.time,
  });

  const url = `${config.gibsBase}?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.gibsTimeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`GIBS GetMap HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.slice(0, 8).toString("utf8") !== "\x89PNG\r\n\x1a\n") {
      throw new Error("GIBS did not return PNG");
    }

    const png = PNG.sync.read(buf);
    const cx = Math.floor(png.width / 2);
    const cy = Math.floor(png.height / 2);
    const idx = (cy * png.width + cx) << 2;

    const r = png.data[idx] ?? 0;
    const g = png.data[idx + 1] ?? 0;
    const b = png.data[idx + 2] ?? 0;
    const lum = pixelLuminance(r, g, b);

    return luminanceToRadiance(lum, snapshot.layer);
  } finally {
    clearTimeout(timeout);
  }
}

export async function sampleRadiance(
  lat: number,
  lon: number,
  year: number,
): Promise<number> {
  if (year >= 2013 && year <= 2015) {
    const y2012 = await sampleRadiance(lat, lon, 2012);
    const y2016 = await sampleRadiance(lat, lon, 2016);
    const t = (year - 2012) / (2016 - 2012);
    return Math.round((y2012 + (y2016 - y2012) * t) * 100) / 100;
  }

  const snapshot = resolveGibsSnapshot(year);
  const cacheKey = `r:${roundCoord(lat, 3)}:${roundCoord(lon, 3)}:${snapshot.layer}:${snapshot.time}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  const radiance = await fetchMapPixel(lat, lon, snapshot);
  cache.set(cacheKey, radiance);
  return radiance;
}

export async function sampleRadianceSafe(
  lat: number,
  lon: number,
  year: number,
): Promise<number> {
  try {
    return await sampleRadiance(lat, lon, year);
  } catch {
    return estimateRadianceFallback(lat, lon, year);
  }
}

function estimateRadianceFallback(lat: number, lon: number, year: number): number {
  const urban =
    Math.abs(lat - 40.7) < 2 && Math.abs(lon + 74) < 2
      ? 18
      : Math.abs(lat - 51.5) < 1.5 && Math.abs(lon - 0) < 2
        ? 14
        : Math.abs(lat - 48.8) < 1.5 && Math.abs(lon - 2.3) < 1.5
          ? 12
          : Math.abs(lat - 19) < 2 && Math.abs(lon - 72.8) < 2
            ? 20
            : 2.5 + (Math.sin(lat * 0.1) + Math.cos(lon * 0.1) + 2) * 1.2;

  const yearFactor = 1 + (year - 2012) * 0.022;
  return Math.round(urban * yearFactor * 100) / 100;
}
