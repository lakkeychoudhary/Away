import { AVAILABLE_YEARS, type AwayResponse, type SkyResponse } from "@away/shared";
import { sampleRadianceSafe } from "../nasa/gibs.js";
import {
  bearingLabel,
  bortleToEstimatedStars,
  destinationPoint,
  radianceToBortle,
  radianceToLimitingMagnitude,
  roundCoord,
} from "../sky/metrics.js";

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

export async function findAwaySpot(
  lat: number,
  lon: number,
  radiusKm: number,
): Promise<AwayResponse> {
  const originRadiance = await sampleRadianceSafe(lat, lon, AVAILABLE_YEARS.at(-1)!);
  const originBortle = radianceToBortle(originRadiance);

  const bearings = Array.from({ length: 8 }, (_, i) => i * 45);
  const distances = [10, 25, 45, 70].filter((d) => d <= radiusKm);

  let best: AwayResponse["destination"] = null;

  for (const dist of distances) {
    const samples = await Promise.all(
      bearings.map(async (bearing) => {
        const point = destinationPoint(lat, lon, bearing, dist);
        const radiance = await sampleRadianceSafe(
          point.lat,
          point.lon,
          AVAILABLE_YEARS.at(-1)!,
        );
        const bortle = radianceToBortle(radiance);
        const improvement = originBortle - bortle;
        return { bearing, point, radiance, bortle, improvement, dist };
      }),
    );

    for (const s of samples) {
      if (s.improvement >= 1) {
        const candidate = {
          bearing: Math.round(s.bearing),
          bearingLabel: bearingLabel(s.bearing),
          distanceKm: s.dist,
          lat: s.point.lat,
          lon: s.point.lon,
          bortle: s.bortle,
          radiance: Math.round(s.radiance * 100) / 100,
          bortleImprovement: s.improvement,
        };

        if (
          !best ||
          candidate.bortleImprovement > best.bortleImprovement ||
          (candidate.bortleImprovement === best.bortleImprovement &&
            candidate.distanceKm < best.distanceKm)
        ) {
          best = candidate;
        }
      }
    }

    if (best && best.bortleImprovement >= 2) break;
  }

  const message = best
    ? `Drive ~${best.distanceKm} km ${best.bearingLabel} for a noticeably darker sky (Bortle ${best.bortle}).`
    : `No darker sky found within ${radiusKm} km — you're in a bright zone.`;

  return {
    ok: true,
    origin: {
      lat: roundCoord(lat, 4),
      lon: roundCoord(lon, 4),
      bortle: originBortle,
      radiance: Math.round(originRadiance * 100) / 100,
    },
    destination: best,
    message,
  };
}
