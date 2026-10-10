import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as {
  __alfareroSupabase?: SupabaseClient;
};

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "gym-media";
}

/**
 * Cliente de Supabase con la clave de servicio. SOLO debe usarse en el
 * servidor. Nunca debe importarse desde un componente de cliente.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage no está configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  if (!globalForSupabase.__alfareroSupabase) {
    globalForSupabase.__alfareroSupabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return globalForSupabase.__alfareroSupabase;
}
