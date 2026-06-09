import type { FastifyReply } from "fastify";
import { findAwaySpot } from "../usecases/findAwaySpot.js";

export async function handleAway(
  query: { lat?: string; lon?: string; radiusKm?: string },
  reply: FastifyReply,
  reqLog: { error: (...args: any[]) => void },
): Promise<unknown> {
  const lat = parseFloat(query.lat ?? "");
  const lon = parseFloat(query.lon ?? "");
  const radiusKm = parseFloat(query.radiusKm ?? "80");

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid lat",
      code: "VALIDATION_ERROR",
    });
  }
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid lon",
      code: "VALIDATION_ERROR",
    });
  }

  try {
    return await findAwaySpot(lat, lon, Number.isFinite(radiusKm) ? radiusKm : 80);
  } catch (err) {
    reqLog.error(err);
    return reply.status(500).send({
      ok: false,
      error: "Failed to find away spot",
      code: "INTERNAL_ERROR",
    });
  }
}

