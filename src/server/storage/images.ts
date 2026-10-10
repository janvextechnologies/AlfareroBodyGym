import "server-only";

import { randomUUID } from "node:crypto";
import { getStorageBucket, getSupabaseAdmin } from "./client";
import { isStoragePath } from "./urls";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateImageFile(file: File): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG o WebP.";
  }
  if (file.size <= 0) {
    return "El archivo está vacío.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen supera el límite de 5 MB.";
  }
  return null;
}

/** Sube una imagen al bucket y devuelve su ruta dentro de Storage. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const extension = EXTENSION_BY_TYPE[file.type] ?? "jpg";
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
  const path = `${safeFolder}/${randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });

  if (uploadError) {
    throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
  }

  return path;
}

/** Elimina un objeto de Storage. Ignora rutas locales (datos iniciales). */
export async function deleteStoredImage(
  path: string | null | undefined,
): Promise<void> {
  if (!isStoragePath(path) || !path) return;

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(`No se pudo eliminar la imagen: ${error.message}`);
  }
}
