import type { FastifyInstance } from "fastify";
import { notImplemented } from "@mpm/shared";

export function registerRoutes(app: FastifyInstance) {
  app.post("/v1/catalogo/categorias", notImplemented("HU-E1-01"));
  app.get("/v1/catalogo/categorias", notImplemented("HU-E1-02"));
  app.post("/v1/catalogo/barrios", notImplemented("HU-E1-03"));
  app.get("/v1/catalogo/barrios", notImplemented("HU-E1-03"));
  app.get("/v1/catalogo/barrios/contiene", notImplemented("HU-E1-04"));
}
