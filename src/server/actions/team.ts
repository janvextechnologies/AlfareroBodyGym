"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminSession } from "@/server/auth/session";
import { PUBLIC_CONTENT_TAG } from "@/server/public/tags";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMember,
  moveTeamMember,
  setTeamVisibility,
  updateTeamMember,
  type TeamMemberInput,
} from "@/server/data/team";
import { isImageInUse } from "@/server/data/image-usage";
import {
  deleteStoredImage,
  uploadImage,
  validateImageFile,
} from "@/server/storage/images";
import { teamSchema, teamUpdateSchema } from "@/server/validation/schemas";
import { getBoolean, getFile, getString, toActionError } from "./helpers";
import type { ActionState } from "./state";

export async function createTeamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = teamSchema.safeParse({
    name: getString(formData, "name"),
    role: getString(formData, "role"),
    specialties: getString(formData, "specialties"),
    description: getString(formData, "description"),
    visible: getBoolean(formData, "visible"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  let imagePath: string | null = null;
  const file = getFile(formData, "image");
  if (file) {
    const fileError = validateImageFile(file);
    if (fileError) return { status: "error", message: fileError };
    imagePath = await uploadImage(file, "team");
  }

  await createTeamMember({ ...parsed.data, imagePath });
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/dashboard");
  return { status: "success", message: "Miembro agregado al equipo." };
}

export async function updateTeamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const parsed = teamUpdateSchema.safeParse({
    id: getString(formData, "id"),
    name: getString(formData, "name"),
    role: getString(formData, "role"),
    specialties: getString(formData, "specialties"),
    description: getString(formData, "description"),
    visible: getBoolean(formData, "visible"),
  });
  if (!parsed.success) return toActionError(parsed.error);

  const { id, ...meta } = parsed.data;
  const update: Partial<TeamMemberInput> = { ...meta };

  const file = getFile(formData, "image");
  if (file) {
    const fileError = validateImageFile(file);
    if (fileError) return { status: "error", message: fileError };

    const current = await getTeamMember(id);
    const newPath = await uploadImage(file, "team");
    update.imagePath = newPath;

    if (current?.imagePath && current.imagePath !== newPath) {
      const inUse = await isImageInUse(current.imagePath, { excludeTeamId: id });
      if (!inUse) {
        await deleteStoredImage(current.imagePath).catch(() => undefined);
      }
    }
  }

  await updateTeamMember(id, update);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/equipo");
  return { status: "success", message: "Miembro actualizado." };
}

export async function deleteTeamAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  if (id) await deleteTeamMember(id);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/dashboard");
}

export async function moveTeamAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  const direction = getString(formData, "direction") === "up" ? "up" : "down";
  if (id) await moveTeamMember(id, direction);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/equipo");
}

export async function toggleTeamVisibilityAction(
  formData: FormData,
): Promise<void> {
  await requireAdminSession();
  const id = getString(formData, "id");
  const visible = getBoolean(formData, "visible");
  if (id) await setTeamVisibility(id, visible);
  updateTag(PUBLIC_CONTENT_TAG);
  revalidatePath("/admin/equipo");
  revalidatePath("/admin/dashboard");
}
