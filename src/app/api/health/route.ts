import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/db";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Endpoint de salud usado por el cron diario (cron-job.org) para evitar que la
 * base de datos de Supabase se pause por inactividad.
 *
 * Ejecuta una consulta real (`SELECT 1`) en cada llamada, por lo que es
 * siempre dinámico (nunca se cachea). Es público y no expone datos sensibles.
 */
export async function GET() {
  await connection();

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
