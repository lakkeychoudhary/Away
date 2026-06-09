import { config } from "../config.js";

export interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
}

let lastRequestAt = 0;

async function throttle(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastRequestAt = Date.now();
}

export async function searchPlaces(query: string): Promise<
  { label: string; lat: number; lon: number }[]
> {
  await throttle();

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "6",
    addressdetails: "0",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: { "User-Agent": config.nominatimUserAgent },
    },
  );

  if (!res.ok) {
    throw new Error(`Nominatim HTTP ${res.status}`);
  }

  const data = (await res.json()) as NominatimPlace[];

  return data.map((p) => ({
    label: p.display_name,
    lat: parseFloat(p.lat),
    lon: parseFloat(p.lon),
  }));
}
