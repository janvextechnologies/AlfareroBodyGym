import { timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/db";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function constantTimeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Endpoint de salud usado por el cron diario (Vercel) para evitar que la
 * base de datos de Supabase se pause por inactividad.
 *
 * Ejecuta una consulta real (`SELECT 1`) en cada llamada, por lo que es
 * siempre dinámico (no se cachea).
 *
 * Autenticación: `Authorization: Bearer <CRON_SECRET>` (que Vercel añade
 * automáticamente a las ejecuciones de cron) o `?token=<CRON_SECRET>`.
 */
export async function GET(request: Request) {
  await connection();

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json(
      { status: "misconfigured" },
      { status: 503, headers: NO_STORE },
    );
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const queryToken = new URL(request.url).searchParams.get("token") ?? "";
  const provided = bearer || queryToken;

  if (!provided || !constantTimeEqual(provided, secret)) {
    return Response.json(
      { status: "unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ status: "ok", db: "up" }, { headers: NO_STORE });
  } catch {
    return Response.json(
      { status: "down", db: "down" },
      { status: 503, headers: NO_STORE },
    );
  }
}
