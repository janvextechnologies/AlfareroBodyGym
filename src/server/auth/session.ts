import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAge,
  verifyAdminSessionToken,
} from "./token";

export type AdminSession = {
  username: string;
};

/**
 * Lee y valida la sesión del administrador desde la cookie HttpOnly.
 * Memoizado por petición con React.cache.
 */
export const getAdminSession = cache(
  async (): Promise<AdminSession | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await verifyAdminSessionToken(token);
    if (!session) return null;

    const expectedUsername = process.env.ADMIN_USERNAME;
    if (expectedUsername && session.username !== expectedUsername) {
      return null;
    }

    return session;
  },
);

/** Lanza si no hay sesión válida. Úsalo en Server Actions y en el servidor. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("No autorizado.");
  }
  return session;
}

export async function startAdminSession(username: string): Promise<void> {
  const token = await createAdminSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminSessionMaxAge(),
  });
}

export async function endAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
