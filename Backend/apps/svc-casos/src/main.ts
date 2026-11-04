import { createService, findService } from "@mpm/shared";
import { registerRoutes } from "./routes/index.js";

const service = findService("svc-casos");
const app = createService(service.name, registerRoutes);
const port = Number(process.env.PORT ?? service.port);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
