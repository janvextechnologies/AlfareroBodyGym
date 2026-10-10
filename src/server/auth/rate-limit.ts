import "server-only";

type AttemptEntry = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000; // 15 minutos de bloqueo

const globalForRateLimit = globalThis as unknown as {
  __abgLoginAttempts?: Map<string, AttemptEntry>;
};

const attempts =
  globalForRateLimit.__abgLoginAttempts ?? new Map<string, AttemptEntry>();
globalForRateLimit.__abgLoginAttempts = attempts;

/** Devuelve los segundos de espera si la clave está bloqueada, o 0. */
export function getLoginRetryAfterSeconds(key: string): number {
  const entry = attempts.get(key);
  if (!entry) return 0;

  const now = Date.now();
  if (entry.blockedUntil > now) {
    return Math.ceil((entry.blockedUntil - now) / 1000);
  }
  if (now - entry.windowStart > WINDOW_MS) {
    attempts.delete(key);
  }
  return 0;
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
    entry.count = 0;
    entry.windowStart = now;
  }
}

export function resetLoginFailures(key: string): void {
  attempts.delete(key);
}
