import type { FastifyInstance } from "fastify";
import { handleAway, handleGeocode, handleSkyReport } from "../controllers/index.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({
    ok: true,
    service: "away-api",
    version: "1.0.0",
  }));

  app.get<{ Querystring: { q?: string } }>("/api/v1/geocode", async (req, reply) => {
    return await handleGeocode(req.query.q, reply, req.log);
  });

  app.get<{
    Querystring: { lat?: string; lon?: string; birthYear?: string };
  }>("/api/v1/sky", async (req, reply) => {
    return await handleSkyReport(req.query, reply, req.log);
  });

  app.get<{
    Querystring: { lat?: string; lon?: string; radiusKm?: string };
  }>("/api/v1/away", async (req, reply) => {
    return await handleAway(req.query, reply, req.log);
  });
}

