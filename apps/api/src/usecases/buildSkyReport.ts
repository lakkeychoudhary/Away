import type { SkyResponse } from "@away/shared";
import { sampleRadianceSafe } from "../nasa/gibs.js";
import {
  bortleToEstimatedStars,
  radianceToBortle,
  radianceToLimitingMagnitude,
  roundCoord,
} from "../sky/metrics.js";
import { AVAILABLE_YEARS } from "@away/shared";

function timelineYears(birthYear: number): number[] {
  const start = Math.max(birthYear, AVAILABLE_YEARS[0]);
  return AVAILABLE_YEARS.filter((y) => y >= start);
}

export async function buildSkyReport(
  lat: number,
  lon: number,
  birthYear: number,
): Promise<SkyResponse> {
  const years = timelineYears(birthYear);
  const timeline = await Promise.all(
    years.map(async (year) => {
      const radiance = await sampleRadianceSafe(lat, lon, year);
      const bortle = radianceToBortle(radiance);
      return {
        year,
        radiance: Math.round(radiance * 100) / 100,
        bortle,
        limitingMagnitude: radianceToLimitingMagnitude(radiance),
        estimatedStars: bortleToEstimatedStars(bortle),
      };
    }),
  );

  const baseline = timeline[0];
  const current = timeline[timeline.length - 1];

  if (!baseline || !current) {
    throw new Error("Insufficient timeline data");
  }

  const starsLost = Math.max(0, baseline.estimatedStars - current.estimatedStars);
  const percentLost =
    baseline.estimatedStars > 0
      ? Math.round((starsLost / baseline.estimatedStars) * 1000) / 10
      : 0;

  const brightnessIncreasePercent =
    baseline.radiance > 0
      ? Math.round(((current.radiance - baseline.radiance) / baseline.radiance) * 1000) / 10
      : 0;

  const metrics = {
    baselineYear: baseline.year,
    currentYear: current.year,
    baselineBortle: baseline.bortle,
    currentBortle: current.bortle,
    baselineStars: baseline.estimatedStars,
    currentStars: current.estimatedStars,
    starsLost,
    percentLost,
    brightnessIncreasePercent,
  };

  return {
    ok: true,
    location: { lat: roundCoord(lat, 4), lon: roundCoord(lon, 4) },
    birthYear,
    timeline,
    metrics,
    share: {
      headline:
        percentLost > 0
          ? `You've lost ~${percentLost}% of your visible stars`
          : "Your sky hasn't dimmed much — yet",
      subline: `Since ${birthYear} · NASA VIIRS Black Marble · Bortle ${current.bortle} now`,
      stats: [
        { label: "Bortle now", value: String(current.bortle) },
        { label: "Stars lost", value: String(starsLost) },
        { label: "Sky brightening", value: `${brightnessIncreasePercent}%` },
      ],
    },
  };
}

