import type { AwayResponse, GeocodeResponse, SkyResponse } from "@away/shared";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "" : "http://localhost:3001");

async function request<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}

export function geocode(q: string): Promise<GeocodeResponse> {
  return request(`/api/v1/geocode?q=${encodeURIComponent(q)}`);
}

export function fetchSky(
  lat: number,
  lon: number,
  birthYear: number,
): Promise<SkyResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    birthYear: String(birthYear),
  });
  return request(`/api/v1/sky?${params}`);
}

export function fetchAway(
  lat: number,
  lon: number,
  radiusKm = 80,
): Promise<AwayResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radiusKm: String(radiusKm),
  });
  return request(`/api/v1/away?${params}`);
}

export function bortleDescription(bortle: number): string {
  const map: Record<number, string> = {
    1: "Excellent dark-sky site",
    2: "Typical truly dark site",
    3: "Rural sky",
    4: "Rural/suburban transition",
    5: "Suburban sky",
    6: "Bright suburban",
    7: "Suburban/urban transition",
    8: "City sky",
    9: "Inner-city sky",
  };
  return map[bortle] ?? "Unknown";
}
