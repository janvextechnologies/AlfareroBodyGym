import "server-only";

import { compare } from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Verifica las credenciales del único administrador contra las variables
 * privadas del servidor. Nunca expone el hash ni la contraseña.
 */
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!expectedUsername || !expectedHash) return false;

  const usernameOk = safeEqual(username, expectedUsername);
  // Ejecutamos compare siempre para no filtrar por tiempo de respuesta.
  const passwordOk = await compare(password, expectedHash).catch(() => false);

  return usernameOk && passwordOk;
}
