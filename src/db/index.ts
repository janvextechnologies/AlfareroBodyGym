import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

type DbCache = {
  db: Database;
  pool: Pool;
};

const globalForDb = globalThis as unknown as {
  __alfareroDb?: DbCache;
};

/**
 * Devuelve una conexión perezosa y única a PostgreSQL (Supabase).
 * Usa `pg` (node-postgres), compatible con `"use cache"` en Next 16.
 */
export function getDb(): Database {
  if (!globalForDb.__alfareroDb) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL no está configurada. Revisa tu archivo .env.local.",
      );
    }
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 20_000,
    });
    globalForDb.__alfareroDb = {
      db: drizzle(pool, { schema }),
      pool,
    };
  }
  return globalForDb.__alfareroDb.db;
}

export { schema };
