/**
 * Cliente de datos de la plataforma.
 *
 * Hoy todo se resuelve con datos mock de `/src/data`, pero cada servicio llama
 * siempre a través de este módulo, de modo que conectar la API real sea cambiar
 * `API_MODE` a "remote" y completar `request()` — sin tocar los componentes.
 */
export type ApiMode = "mock" | "remote";

export const API_MODE: ApiMode = "mock";
export const TOKEN_KEY = "mpm.token";

export const DEFAULT_LATENCY = 380;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Ejecuta la resolución mock respetando una latencia realista. */
export async function respond<T>(factory: () => T, latency = DEFAULT_LATENCY): Promise<T> {
  if (API_MODE === "remote") {
    throw new ApiError("La API remota todavía no está configurada.", 501);
  }
  await delay(latency);
  return factory();
}

/** Punto único de salida hacia el gateway del backend. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...init, headers });
  if (!response.ok) {
    let message = `Error consultando ${path}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // La respuesta no trae JSON.
    }
    throw new ApiError(message, response.status);
  }
  return (await response.json()) as T;
}

export const clone = <T,>(value: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
