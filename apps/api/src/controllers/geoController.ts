import type { FastifyReply } from "fastify";
import { searchPlaces } from "../geocode/nominatim.js";

export async function handleGeocode(
  q: string | undefined,
  reply: FastifyReply,
  reqLog: { error: (...args: any[]) => void },
): Promise<unknown> {
  const query = q?.trim();
  if (!query || query.length < 2) {
    return reply.status(400).send({
      ok: false,
      error: "Query must be at least 2 characters",
      code: "VALIDATION_ERROR",
    });
  }

  try {
    const results = await searchPlaces(query);
    return { ok: true, results };
  } catch (err) {
    reqLog.error(err);
    return reply.status(502).send({
      ok: false,
      error: "Geocoding service unavailable",
      code: "UPSTREAM_ERROR",
    });
  }
}

