import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "abg_admin_session";

function getSessionTtlSeconds(): number {
  const hours = Number(process.env.SESSION_TTL_HOURS ?? "8");
  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 8;
  return Math.round(safeHours * 3600);
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET no está configurada o es demasiado corta (mínimo 16 caracteres).",
    );
  }
  return new TextEncoder().encode(secret);
}

export function getAdminSessionMaxAge(): number {
  return getSessionTtlSeconds();
}

export async function createAdminSessionToken(
  username: string,
): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${getSessionTtlSeconds()}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    const username = typeof payload.sub === "string" ? payload.sub : "";
    if (!username) return null;
    return { username };
  } catch {
    return null;
  }
}
