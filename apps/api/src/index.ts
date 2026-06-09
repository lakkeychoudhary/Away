import Fastify from "fastify";
import cors from "@fastify/cors";
import { config, getCorsOrigins } from "./config.js";
import { registerRoutes } from "./routes/index.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: getCorsOrigins() });
await registerRoutes(app);

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(`Away API listening on http://${config.host}:${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
