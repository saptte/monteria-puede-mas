import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.post("/v1/conversaciones", notImplemented("HU-E8-01"));
  app.get("/v1/conversaciones", notImplemented("HU-E8-01"));
  app.post("/v1/conversaciones/:id/cierre", notImplemented("HU-E8-04"));
  app.post("/v1/conversaciones/:id/mensajes", notImplemented("HU-E8-02"));
  app.get("/v1/conversaciones/:id/mensajes", notImplemented("HU-E8-03"));
}
