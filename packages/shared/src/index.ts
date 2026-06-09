export interface GeocodeResult {
  label: string;
  lat: number;
  lon: number;
}

export interface SkyTimelinePoint {
  year: number;
  radiance: number;
  bortle: number;
  limitingMagnitude: number;
  estimatedStars: number;
}

export interface SkyMetrics {
  baselineYear: number;
  currentYear: number;
  baselineBortle: number;
  currentBortle: number;
  baselineStars: number;
  currentStars: number;
  starsLost: number;
  percentLost: number;
  brightnessIncreasePercent: number;
}

export interface ShareStat {
  label: string;
  value: string;
}

export interface SharePayload {
  headline: string;
  subline: string;
  stats: ShareStat[];
}

export interface SkyResponse {
  ok: true;
  location: { lat: number; lon: number };
  birthYear: number;
  timeline: SkyTimelinePoint[];
  metrics: SkyMetrics;
  share: SharePayload;
}

export interface AwayDestination {
  bearing: number;
  bearingLabel: string;
  distanceKm: number;
  lat: number;
  lon: number;
  bortle: number;
  radiance: number;
  bortleImprovement: number;
}

export interface AwayResponse {
  ok: true;
  origin: {
    lat: number;
    lon: number;
    bortle: number;
    radiance: number;
  };
  destination: AwayDestination | null;
  message: string;
}

export interface GeocodeResponse {
  ok: true;
  results: GeocodeResult[];
}

export interface ApiError {
  ok: false;
  error: string;
  code: string;
}

export const AVAILABLE_YEARS = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
] as const;

export type AvailableYear = (typeof AVAILABLE_YEARS)[number];
