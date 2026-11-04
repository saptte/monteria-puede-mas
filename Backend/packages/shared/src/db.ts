import pg from "pg";

const schemas = new Set([
  "citizen",
  "catalog",
  "report",
  "geo",
  "evidence",
  "case_mgmt",
  "project",
  "conversation",
  "participation",
]);

export function createPool(schema: string): pg.Pool | null {
  if (!schemas.has(schema)) {
    throw new Error(`Schema no permitido: ${schema}`);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  const pool = new pg.Pool({ connectionString });
  pool.on("connect", (client) => {
    void client.query(`SET search_path TO ${schema}, public`);
  });
  return pool;
}
