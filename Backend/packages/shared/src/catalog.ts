export type ServiceName =
  | "svc-ciudadano"
  | "svc-catalogo"
  | "svc-reportes"
  | "svc-geo"
  | "svc-evidencias"
  | "svc-casos"
  | "svc-proyectos"
  | "svc-conversaciones"
  | "svc-participacion";

export type ServiceDefinition = {
  name: ServiceName;
  prefix: string;
  port: number;
  schema: string;
  envUrl: string;
};

export const serviceCatalog: readonly ServiceDefinition[] = [
  { name: "svc-ciudadano", prefix: "/v1/ciudadanos", port: 3001, schema: "citizen", envUrl: "SVC_CIUDADANO_URL" },
  { name: "svc-catalogo", prefix: "/v1/catalogo", port: 3002, schema: "catalog", envUrl: "SVC_CATALOGO_URL" },
  { name: "svc-reportes", prefix: "/v1/reportes", port: 3003, schema: "report", envUrl: "SVC_REPORTES_URL" },
  { name: "svc-geo", prefix: "/v1/geo", port: 3004, schema: "geo", envUrl: "SVC_GEO_URL" },
  { name: "svc-evidencias", prefix: "/v1/evidencias", port: 3005, schema: "evidence", envUrl: "SVC_EVIDENCIAS_URL" },
  { name: "svc-casos", prefix: "/v1/casos", port: 3006, schema: "case_mgmt", envUrl: "SVC_CASOS_URL" },
  { name: "svc-proyectos", prefix: "/v1/proyectos", port: 3007, schema: "project", envUrl: "SVC_PROYECTOS_URL" },
  { name: "svc-conversaciones", prefix: "/v1/conversaciones", port: 3008, schema: "conversation", envUrl: "SVC_CONVERSACIONES_URL" },
  { name: "svc-participacion", prefix: "/v1/participacion", port: 3009, schema: "participation", envUrl: "SVC_PARTICIPACION_URL" },
];

export function findService(name: ServiceName): ServiceDefinition {
  const service = serviceCatalog.find((item) => item.name === name);
  if (!service) {
    throw new Error(`Servicio no catalogado: ${name}`);
  }
  return service;
}

export function upstreamFor(service: ServiceDefinition): string {
  return process.env[service.envUrl] ?? `http://127.0.0.1:${service.port}`;
}
