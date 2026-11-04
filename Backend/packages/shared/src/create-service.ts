import Fastify, { type FastifyInstance } from "fastify";
import { AppError } from "./errors.js";

export function createService(
  name: string,
  register: (app: FastifyInstance) => void,
): FastifyInstance {
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

  app.get("/health", async () => ({ status: "ok", service: name }));
  register(app);
  return app;
}
