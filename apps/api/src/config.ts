export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  gibsBase:
    process.env.GIBS_BASE ??
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
  cacheTtlMs: Number(process.env.CACHE_TTL_MS ?? 3_600_000),
  nominatimUserAgent:
    process.env.NOMINATIM_USER_AGENT ??
    "Away/1.0 (https://github.com/hackclub/stardance)",
  gibsLayer: "VIIRS_Black_Marble",
  gibsTimeoutMs: 12_000,
};

export function getCorsOrigins(): boolean | string | string[] {
  if (config.corsOrigin === "*") return true;
  return config.corsOrigin.split(",").map((s) => s.trim());
}
