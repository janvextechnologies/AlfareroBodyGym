import { z, type ZodError } from "zod";
import type { ActionState } from "./state";

export function toActionError(error: ZodError): ActionState {
  const flattened = z.flattenError(error) as {
    fieldErrors?: Record<string, string[] | undefined>;
  };
  const source = flattened.fieldErrors ?? {};
  const fieldErrors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value) && value.length > 0) {
      fieldErrors[key] = value;
    }
  }
  return {
    status: "error",
    message: "Revisa los campos marcados.",
    fieldErrors,
  };
}

export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}
