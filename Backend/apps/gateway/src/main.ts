import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import { AppError, serviceCatalog, upstreamFor } from "@mpm/shared";

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  request.log.error(error);
  return reply.status(500).send({
    code: "INTERNAL",
    message: "Error interno",
    details: null,
  });
});

app.addHook("onRequest", async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (request.method === "OPTIONS") {
    return reply.status(204).send();
  }
});

app.get("/health", async () => ({ status: "ok", service: "gateway" }));

const byPrefixLength = [
  ...serviceCatalog,
  {
    name: "svc-ciudadano" as const,
    prefix: "/v1/auth",
    port: 3001,
    schema: "citizen",
    envUrl: "SVC_CIUDADANO_URL",
  },
].sort((a, b) => b.prefix.length - a.prefix.length);

for (const service of byPrefixLength) {
  app.register(proxy, {
    upstream: upstreamFor(service),
    prefix: service.prefix,
    rewritePrefix: service.prefix,
  });
}

app.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({
    code: "NOT_FOUND",
    message: `Ruta no encontrada: ${request.method} ${request.url}`,
    details: null,
  });
});

const port = Number(process.env.PORT_GATEWAY ?? 3000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
