import type { FastifyInstance } from "fastify";
import { AppError, createPool, hashPassword, requireCiudadano, signToken, verifyPassword } from "@mpm/shared";

const pool = createPool("citizen");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CitizenRow = {
  citizen_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  password_hash: string | null;
  created_at: Date;
};

function profileOf(row: CitizenRow) {
  return {
    id: row.citizen_id,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    since: row.created_at.toISOString(),
    barrio: "",
  };
}

function sessionOf(row: CitizenRow) {
  return {
    token: signToken({ sub: row.citizen_id, role: "ciudadano", email: row.email ?? "" }),
    profile: profileOf(row),
  };
}

async function db() {
  if (!pool) throw new AppError(503, "DB_UNAVAILABLE", "La base de datos no está configurada.");
  return pool;
}

export function registerRoutes(app: FastifyInstance) {
  app.post("/v1/auth/register", async (request) => {
    const body = request.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!emailPattern.test(email)) {
      throw new AppError(422, "INVALID_EMAIL", "Revisa el correo electrónico ingresado.");
    }
    if (password.trim().length < 6) {
      throw new AppError(422, "INVALID_PASSWORD", "La contraseña debe tener al menos 6 caracteres.");
    }

    const client = await db();
    const existing = await client.query("SELECT citizen_id FROM citizen.citizen WHERE email = $1", [email]);
    if (existing.rowCount) {
      throw new AppError(409, "EMAIL_EXISTS", "Ese correo ya tiene una cuenta. Entra con tu contraseña.");
    }

    const created = await client.query<CitizenRow>(
      `INSERT INTO citizen.citizen (citizen_id, first_name, last_name, email, phone, password_hash)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
       RETURNING citizen_id, first_name, last_name, email, phone, password_hash, created_at`,
      [body.firstName?.trim() ?? "", body.lastName?.trim() ?? "", email, body.phone?.trim() ?? "", hashPassword(password)],
    );
    const row = created.rows[0];
    if (!row) throw new AppError(500, "INTERNAL", "No se pudo crear la cuenta.");

    await client.query(
      `INSERT INTO citizen.citizen_consent (consent_id, citizen_id, consent_type, accepted, policy_version, source)
       VALUES (gen_random_uuid(), $1, 'TRATAMIENTO_DATOS', TRUE, '2026-09', 'WEB')`,
      [row.citizen_id],
    );

    return sessionOf(row);
  });

  app.post("/v1/auth/login", async (request) => {
    const body = request.body as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!emailPattern.test(email)) {
      throw new AppError(422, "INVALID_EMAIL", "Revisa el correo electrónico ingresado.");
    }
    if (password.trim().length < 6) {
      throw new AppError(422, "INVALID_PASSWORD", "La contraseña debe tener al menos 6 caracteres.");
    }

    const client = await db();
    const found = await client.query<CitizenRow>(
      `SELECT citizen_id, first_name, last_name, email, phone, password_hash, created_at
       FROM citizen.citizen WHERE email = $1`,
      [email],
    );
    const row = found.rows[0];
    if (!row?.password_hash || !verifyPassword(password, row.password_hash)) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
    }
    return sessionOf(row);
  });

  app.get("/v1/ciudadanos/me", async (request) => {
    const token = requireCiudadano(request);
    const client = await db();
    const found = await client.query<CitizenRow>(
      `SELECT citizen_id, first_name, last_name, email, phone, password_hash, created_at
       FROM citizen.citizen WHERE citizen_id = $1`,
      [token.sub],
    );
    const row = found.rows[0];
    if (!row) throw new AppError(404, "NOT_FOUND", "No encontramos tu cuenta.");
    return profileOf(row);
  });
}
