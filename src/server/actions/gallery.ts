"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminSession } from "@/server/auth/session";
import { PUBLIC_CONTENT_TAG } from "@/server/public/tags";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItem,
  moveGalleryItem,
  setGalleryVisibility,
  updateGalleryItem,
  type GalleryItemInput,
} from "@/server/data/gallery";
import { isImageInUse } from "@/server/data/image-usage";
import {
  deleteStoredImage,
  uploadImage,
  validateImageFile,
} from "@/server/storage/images";
import {
  galleryMetaSchema,
  galleryUpdateSchema,
} from "@/server/validation/schemas";
import { getBoolean, getFile, getString, toActionError } from "./helpers";
import type { ActionState } from "./state";

export async function createGalleryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = galleryMetaSchema.safeParse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    span: getString(formData, "span") || "normal",
    visible: getBoolean(formData, "visible"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  const file = getFile(formData, "image");
  if (!file) return { status: "error", message: "Selecciona una imagen." };

  const fileError = validateImageFile(file);
  if (fileError) return { status: "error", message: fileError };

  const imagePath = await uploadImage(file, "gallery");
  await createGalleryItem({ ...parsed.data, imagePath });
  updateTag(PUBLIC_CONTENT_TAG);

  revalidatePath("/admin/galeria");
  revalidatePath("/admin/dashboard");
  return { status: "success", message: "Imagen agregada a la galería." };
}

export async function updateGalleryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = galleryUpdateSchema.safeParse({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    span: getString(formData, "span") || "normal",
    visible: getBoolean(formData, "visible"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  const { id, ...meta } = parsed.data;
  const update: Partial<GalleryItemInput> = { ...meta };

  const file = getFile(formData, "image");
  if (file) {
    const fileError = validateImageFile(file);
    if (fileError) return { status: "error", message: fileError };

    const current = await getGalleryItem(id);
    const newPath = await uploadImage(file, "gallery");
    update.imagePath = newPath;

    if (current?.imagePath && current.imagePath !== newPath) {
      const inUse = await isImageInUse(current.imagePath, {
        excludeGalleryId: id,
      });
      if (!inUse) {
        await deleteStoredImage(current.imagePath).catch(() => undefined);
      }
    }
  }

  await updateGalleryItem(id, update);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/galeria");
  return { status: "success", message: "Imagen actualizada." };
}

export async function deleteGalleryAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  if (id) await deleteGalleryItem(id);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/galeria");
  revalidatePath("/admin/dashboard");
}

export async function moveGalleryAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  const direction = getString(formData, "direction") === "up" ? "up" : "down";
  if (id) await moveGalleryItem(id, direction);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/galeria");
}

export async function toggleGalleryVisibilityAction(
  formData: FormData,
): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  const visible = getBoolean(formData, "visible");
  if (id) await setGalleryVisibility(id, visible);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/galeria");
  revalidatePath("/admin/dashboard");
}
