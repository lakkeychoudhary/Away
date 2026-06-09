import type { FastifyReply } from "fastify";
import { buildSkyReport } from "../usecases/buildSkyReport.js";

function parseNumber(value: string | undefined): number {
  if (value === undefined) return NaN;
  return parseFloat(value);
}

export async function handleSkyReport(
  query: { lat?: string; lon?: string; birthYear?: string },
  reply: FastifyReply,
  reqLog: { error: (...args: any[]) => void },
): Promise<unknown> {
  const lat = parseNumber(query.lat);
  const lon = parseNumber(query.lon);
  const birthYear = parseInt(query.birthYear ?? "", 10);
  const currentYear = new Date().getFullYear();

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid lat (-90 to 90)",
      code: "VALIDATION_ERROR",
    });
  }
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid lon (-180 to 180)",
      code: "VALIDATION_ERROR",
    });
  }
  if (!Number.isFinite(birthYear) || birthYear < 1950 || birthYear > currentYear) {
    return reply.status(400).send({
      ok: false,
      error: `Invalid birthYear (1950–${currentYear})`,
      code: "VALIDATION_ERROR",
    });
  }

  try {
    return await buildSkyReport(lat, lon, birthYear);
  } catch (err) {
    reqLog.error(err);
    return reply.status(500).send({
      ok: false,
      error: "Failed to build sky report",
      code: "INTERNAL_ERROR",
    });
  }
}

