import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { AppError } from "./errors.js";

export type AuthToken = {
  sub: string;
  role: "ciudadano" | "gestor";
  email: string;
  exp: number;
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const previous = Buffer.from(hash, "hex");
  if (next.length !== previous.length) return false;
  return timingSafeEqual(next, previous);
}

function secret() {
  return process.env.JWT_SECRET ?? "change-me";
}

export function signToken(input: Omit<AuthToken, "exp">) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...input, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function readToken(request: FastifyRequest): AuthToken | null {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length);
  const [headerPart, bodyPart, signature] = token.split(".");
  if (!headerPart || !bodyPart || !signature) {
    throw new AppError(401, "UNAUTHORIZED", "La sesión no es válida. Vuelve a entrar.");
  }
  const expected = createHmac("sha256", secret()).update(`${headerPart}.${bodyPart}`).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    throw new AppError(401, "UNAUTHORIZED", "La sesión no es válida. Vuelve a entrar.");
  }
  const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString("utf8")) as AuthToken;
  if (payload.exp < Date.now()) {
    throw new AppError(401, "UNAUTHORIZED", "La sesión venció. Vuelve a entrar.");
  }
  return payload;
}

export function requireCiudadano(request: FastifyRequest) {
  const token = readToken(request);
  if (!token) {
    throw new AppError(401, "UNAUTHORIZED", "Inicia sesión para continuar.");
  }
  return token;
}
