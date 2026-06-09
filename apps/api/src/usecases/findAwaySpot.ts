import type { AwayResponse } from "@away/shared";
import { AVAILABLE_YEARS } from "@away/shared";
import { sampleRadianceSafe } from "../nasa/gibs.js";
import {
  bearingLabel,
  destinationPoint,
  radianceToBortle,
  roundCoord,
} from "../sky/metrics.js";

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

