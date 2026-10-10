import "server-only";

/**
 * Convierte un valor guardado en la base de datos en una URL mostrable.
 * - URLs absolutas y rutas locales (/images/...) se devuelven tal cual.
 * - Las rutas de objeto de Storage se resuelven a la URL pública del bucket.
 */
export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("/") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return "";

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "gym-media";
  return `${baseUrl.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}

/** Indica si un valor corresponde a un objeto dentro de Supabase Storage. */
export function isStoragePath(path: string | null | undefined): boolean {
  if (!path) return false;
  return (
    !/^https?:\/\//i.test(path) &&
    !path.startsWith("/") &&
    !path.startsWith("data:")
  );
}
