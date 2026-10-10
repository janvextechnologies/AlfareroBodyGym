"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/server/auth/password";
import {
  getLoginRetryAfterSeconds,
  recordLoginFailure,
  resetLoginFailures,
} from "@/server/auth/rate-limit";
import { endAdminSession, startAdminSession } from "@/server/auth/session";
import { loginSchema } from "@/server/validation/schemas";
import { getString, toActionError } from "./helpers";
import type { ActionState } from "./state";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    username: getString(formData, "username"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return toActionError(parsed.error);
  }

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = (forwarded?.split(",")[0] ?? headerList.get("x-real-ip") ?? "local")
    .trim();
  const rateKey = `login:${ip}`;

  const retryAfter = getLoginRetryAfterSeconds(rateKey);
  if (retryAfter > 0) {
    const minutes = Math.max(1, Math.ceil(retryAfter / 60));
    return {
      status: "error",
      message: `Demasiados intentos fallidos. Vuelve a intentarlo en ${minutes} minuto(s).`,
    };
  }

  const valid = await verifyAdminCredentials(
    parsed.data.username,
    parsed.data.password,
  );

  if (!valid) {
    recordLoginFailure(rateKey);
    return {
      status: "error",
      message: "Usuario o contraseña incorrectos.",
    };
  }

  resetLoginFailures(rateKey);
  await startAdminSession(parsed.data.username);
  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/admin");
}
