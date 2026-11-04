import { ApiError, request, TOKEN_KEY } from "./api-client";
import type { AuthCredentials, CitizenProfile, RegisterInput } from "@/types";

export type AuthProvider = "google" | "microsoft";

type SessionResponse = {
  token: string;
  profile: CitizenProfile;
};

const persistSession = (session: SessionResponse) => {
  window.localStorage.setItem(TOKEN_KEY, session.token);
  return session.profile;
};

export const authService = {
  async login(credentials: AuthCredentials): Promise<CitizenProfile> {
    const session = await request<SessionResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return persistSession(session);
  },

  async register(input: RegisterInput): Promise<CitizenProfile> {
    const session = await request<SessionResponse>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return persistSession(session);
  },

  async loginWithProvider(): Promise<CitizenProfile> {
    throw new ApiError("Para esta prueba entra con correo y contraseña.", 501);
  },

  async logout(): Promise<void> {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
